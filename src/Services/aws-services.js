import { CognitoAuth } from 'amazon-cognito-auth-js';
import { CognitoUserPool } from 'amazon-cognito-identity-js';

const AWS = require("aws-sdk");
const bluebird = require('bluebird');
const fileStorageS3Bucket = process.env.REACT_APP_s3BucketName;
const region = process.env.REACT_APP_region;
const IdentityPoolId = process.env.REACT_APP_IdentityPoolId;
const dbTableName = process.env.REACT_APP_dbTableName;
const UserPoolId = process.env.REACT_APP_UserPoolId;
const AppClientId = process.env.REACT_APP_AppClientId;
const appWebDomain = process.env.REACT_APP_DOMAIN;
const cognitoAuthUrl = process.env.REACT_APP_COGNITO_AUTH;
const signedUrlExpireSeconds = 600;
let docClient;
let s3;

const data = {
    UserPoolId: UserPoolId,
    ClientId: AppClientId
};
const userPool = new CognitoUserPool(data);

// configure AWS to work with promises
AWS.config.setPromisesDependency(bluebird);

export const storeUserInfoInLSAndSetAWSConfig = (cb) => {
    // Configuration for Auth instance.
    var authData = {
        UserPoolId: UserPoolId,
        ClientId: AppClientId,
        RedirectUriSignIn: `${appWebDomain}/login`,
        RedirectUriSignOut: `${appWebDomain}/logout`,
        AppWebDomain: appWebDomain,
        TokenScopesArray: ['email']
    };
    var auth = new CognitoAuth(authData);
    //Callbacks, you must declare, but can be empty. 
    auth.userhandler = {
        onSuccess: function (result) {

        },
        onFailure: function (err) {
        }
    };
    //Get the full url with the hash data.
    var curUrl = window.location.href;
    //here is the trick, this step configure the LocalStorage with the user.
    auth.parseCognitoWebResponse(curUrl);  
    checkIfUserLoggedInAndSetAWSConfig(cb);
}

export const checkIfUserLoggedInAndSetAWSConfig=(cb)=>{
    //behind the scene getCurrentUser looks for the user on the local storage. 
    var cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
        cognitoUser.getSession(function (err, result) {
            if (result) {
                console.log('You are now logged in.');
                AWS.config.update({
                    credentials: new AWS.CognitoIdentityCredentials({
                        IdentityPoolId: IdentityPoolId,
                        Logins: {
                            [`cognito-idp.${region}.amazonaws.com/${UserPoolId}`]: result.getIdToken().getJwtToken()
                        }
                    }),
                    region: region
                });

                s3 = new AWS.S3({
                    apiVersion: '2006-03-01',
                    params: { Bucket: fileStorageS3Bucket }
                });

                docClient = new AWS.DynamoDB.DocumentClient();

                cb(cognitoUser);
            } else {
                cb(false);
            }
        });
    }else{
        cb(false);
    }
}

export const logout=()=>{
    var cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
        cognitoUser.signOut();
    }    
    window.location.href = cognitoLogoutUrl;
}

export function uploadFileToS3(fileName, file) {
    const params = {
        Key: fileName + '.' + file.name.split(".").pop(),
        Body: file,
        ContentType: file.type
    }
    return s3.upload(params);
}

export function uploadUserDetailsToDDB(item) {
    const params = {
        TableName: dbTableName,
        Item: { ...item, dayTimestamp: new Date().setHours(0, 0, 0, 0) }
    }
    return docClient.put(params).promise();
}

export async function getFileUrls(key, value) {
    let params, data;
    if (key === 'name') {
        value = value.toLowerCase();
        params = {
            TableName: dbTableName,
            FilterExpression: "contains (#key, :value)",
            ExpressionAttributeNames: {
                "#key": "searchName"
            },
            ExpressionAttributeValues: {
                ":value": value
            }
        }
        data = await scanData(params);
    }
    else if (key === 'tags') {
        let filterEx, exAttrValues={};
        const tagsCount = value.length
        if(tagsCount>1){
            filterEx = [...Array(tagsCount).keys()].map(i=>`contains (#key, :val${i})`).join(" AND ")
        }else{
            filterEx = `contains (#key, :val0)`;
        }
        value.forEach((val,i)=>exAttrValues[":val"+i]=val.toLowerCase());
        params = {
            TableName: dbTableName,
            FilterExpression: filterEx,
            ExpressionAttributeNames: {
                "#key": "searchTags"
            },
            ExpressionAttributeValues:exAttrValues
        }
        data = await scanData(params);
    }
    else if (key === 'dateRange') {
        params = {
            TableName: dbTableName,
            FilterExpression: "#key BETWEEN :start and :end",
            ExpressionAttributeNames: {
                "#key": "dayTimestamp"
            },
            ExpressionAttributeValues: {
                ":start": Date.parse(value.start),
                ":end": Date.parse(value.end)
            }
        }
        data = await scanData(params);
    }
    return getPresignedUrls(data);
}

const scanData = async (params) => {
    return await docClient.scan(params).promise();
}

const getPresignedUrls = async (data) => {
    try {
        return data.Items.map(item => ({
            ...item, 'fileName': item.s3FileKey, 'fileUrl': s3.getSignedUrl('getObject', {
                Bucket: fileStorageS3Bucket,
                Key: item.s3FileKey,
                Expires: signedUrlExpireSeconds
            })
        }))
    } catch (err) {
        return null;
    }
}

export const cognitoParams = `response_type=token&client_id=${AppClientId}&redirect_uri=${appWebDomain}${process.env.REACT_APP_COGNITO_REDIRECT_ROUTE}`
export const cognitoLoginUrl = `${cognitoAuthUrl}/login?${cognitoParams}`;
export const cognitoLogoutUrl = `${cognitoAuthUrl}/logout?${cognitoParams}`;