import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import UploadDoc from './UploadDoc';
import SearchDoc from './SearchDoc';
import Login from './Login';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Header';
import '../App.css';
import { setAWSConfig } from '../Services/aws-services';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userLoggedIn: false
        }
    }
    componentDidMount() {
        const self = this;
        const eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        const eventer = window[eventMethod];
        const messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
        // Listen to message from child window
        eventer(messageEvent, function (e) {
            console.log('origin: ', e.origin);
            // Check if origin is proper
            if (e.origin != 'http://localhost:3000') { return }
            console.log('parent received message!: ', e.data);
            if (e.data.idToken) {
                self.setState({userLoggedIn:true});
                setAWSConfig(e.data.idToken);
            }
        }, false);
    }
    render() {
        return (
            <div class="container">
                <Header {...this.state} />
                <Router>
                    <div>
                        <Switch>
                            <Route exact path="/Search" component={SearchDoc} {...this.state} />
                            <Route exact path="/" component={SearchDoc} {...this.state}>
                                <Redirect to="/Search" />
                            </Route>
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/Upload" component={UploadDoc} {...this.state} />
                        </Switch>
                    </div>
                </Router>
            </div>
        )
    }

}

export default App;