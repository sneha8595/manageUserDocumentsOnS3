import React from 'react';
import {cognitoLoginUrl} from '../Services/aws-services';

const renderRedirect=()=>{
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