import React from 'react';
import {cognitoLoginUrl} from '../Services/aws-services';

const renderRedirect=()=>{
    console.log(cognitoLoginUrl);debugger
    window.location.href = cognitoLoginUrl;
}
const Login = () => {
    return (
        <div>
            {renderRedirect()}
        </div>
    )
}

export default Login;