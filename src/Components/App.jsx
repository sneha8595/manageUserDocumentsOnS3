import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import UploadDoc from './UploadDoc';
import SearchDoc from './SearchDoc';
import Login from './Login';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Header';
import '../App.css';
import * as AWSServices from '../Services/aws-services';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userLoggedIn: false,
            username: null
        }
    }
    componentWillMount() {
        AWSServices.checkIfUserLoggedInAndSetAWSConfig(userDetails=>{
            if(!userDetails){
                if (window.location.href.includes("id_token")) {
                    AWSServices.storeUserInfoInLSAndSetAWSConfig((userDetails) => {
                        this.setState({ userLoggedIn: userDetails ? true : false, username: userDetails.username })
                    });
                }
            }else{
                this.setState({ userLoggedIn: userDetails ? true : false, username: userDetails.username })
            }
        });
    }
    render() {
        return (
            <div className="container">
                <Router>
                    <div>
                        <Switch>
                            <Route exact path="/">
                                {!this.state.userLoggedIn && <Redirect to="/Login" />}
                                {this.state.userLoggedIn && <Redirect to="/Search" />}
                            </Route>
                            <Route exact path="/Login" component={Login} />
                            <Route exact path="/Search" >
                                {!this.state.userLoggedIn &&
                                    <Redirect to="/Login" />
                                }
                                {this.state.userLoggedIn &&
                                    <div><Header {...this.state} />
                                        <SearchDoc {...this.state} />
                                    </div>}
                            </Route>
                            <Route exact path="/Upload" >
                                {!this.state.userLoggedIn &&
                                    <Redirect to="/Login" />
                                }
                                {this.state.userLoggedIn &&
                                    <div><Header {...this.state} />
                                        <UploadDoc {...this.state} /></div>
                                }
                            </Route>
                        </Switch>
                    </div>
                </Router>
            </div>
        )
    }

}

export default App;