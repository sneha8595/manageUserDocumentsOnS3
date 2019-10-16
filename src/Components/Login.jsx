import React from 'react';

class Login extends React.Component{
    componentDidMount(){
        window.opener.postMessage({'idToken':this.getIdToken()}, 'http://localhost:3000');
        window.close();
    } 
    getIdToken = () => {
        try {
            const hashArray = window.location.hash.split("&");
            for (let i = 0; i < hashArray.length; i++) {
                if (hashArray[i].includes("id_token")) {
                    return hashArray[i].split("=")[1]
                }
            }
        } catch (err) {
            console.log(err);
        }
    }   
    render(){
        return(
            <div></div>
        )        
    }
}

export default Login;