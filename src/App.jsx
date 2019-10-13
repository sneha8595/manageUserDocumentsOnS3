import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import UploadFile from './Components/UploadFile';
import SearchFile from './Components/SearchFile';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from 'reactstrap';
import './App.css';

export default function App() {
    return (
        <div>
            <div className="d-flex justify-content-center margin-header">
                <img className="omc-logo" src="https://omcltd.in/Portals/0/logo.png" alt="OMC Logo"/>
                <h1>Document management System</h1>
            </div>
            <Router><div>

                <div className="margin-all route-buttons">
                    <div className="d-flex justify-content-around">
                        <div className="p-2 text-center"><Link to="/uploadFile"><Button outline color="info">Upload Document</Button></Link></div>
                        <div className="p-2 text-center"><Link to="/searchFile"><Button outline color="info">Search Document</Button></Link></div>
                    </div>
                </div>
                <Route path="/uploadFile" component={UploadFile}></Route>
                <Route path="/searchFile" component={SearchFile}></Route>

            </div></Router>
        </div>
    )
}