import React from 'react';
import {
    Button, Navbar,
    NavbarBrand,
    Nav,
    NavItem,
} from 'reactstrap';
import * as AWSServices from '../Services/aws-services'
import { Link } from 'react-router-dom';

const handleLogout = () => {
    AWSServices.logout();
}
const Header = (props) => {
    return (
        <div>
            <Navbar color="light" light>
                <NavbarBrand>
                    <div className="row">
                    <Link to={'/Search'} ><img className="omc-logo" src="https://omcltd.in/Portals/0/logo.png" alt="OMC Logo" /></Link>
                        <div class="header-text">Document Management System</div>
                    </div>
                </NavbarBrand>
                <Nav>
                    {props.userLoggedIn &&
                        <NavItem>
                            <span class="username">Hi {props.username}&nbsp;&nbsp;</span>
                        <Button color="danger" onClick={handleLogout}>Logout</Button>
                        </NavItem>}
                </Nav>
            </Navbar>
        </div>
    )
}
export default Header;