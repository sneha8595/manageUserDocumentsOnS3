const AWS = require("aws-sdk");
const bluebird = require('bluebird');

const fileStorageS3Bucket = 'omc-dms-files';
const bucketRegion = 'ap-south-1';
const IdentityPoolId = 'ap-south-1:8a0cbc67-bdea-4894-b37d-2400934862fb';
const dbTableName = 'omc-dms-file-details';
const signedUrlExpireSeconds = 600;
const UserPoolId = "ap-south-1_Ut8WAkZ0b";
//const AppClientId = "5okb1tnp8coildss53virj6dvf";
let docClient;
let s3;

// configure AWS to work with promises
AWS.config.setPromisesDependency(bluebird);

export const setAWSConfig=(idToken)=>{
    AWS.config.update({
        credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: IdentityPoolId,
            Logins: {
                [`cognito-idp.${bucketRegion}.amazonaws.com/${UserPoolId}`]: idToken
            }
        }),
        region: bucketRegion
    });

    s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        params: { Bucket: fileStorageS3Bucket }
    });

    docClient = new AWS.DynamoDB.DocumentClient();
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
    if (typeof value == "string") {
        value = value.toLowerCase();
    }
    if (key === 'name') {
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
    else if (key === 'description') {
        params = {
            TableName: dbTableName,
            FilterExpression: "contains (#key, :value)",
            ExpressionAttributeNames: {
                "#key": "searchDescription"
            },
            ExpressionAttributeValues: {
                ":value": value
            }
        }
        data = await scanData(params);
    }
    else if (key === 'dateRange') {
        debugger
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

export const getUserProfileData=()=>{
    
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




