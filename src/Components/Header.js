import React from 'react';
import {
    Button, Navbar,
    NavbarBrand,
    Nav,
    NavItem,
} from 'reactstrap';

const Header = (props) => {
    const openLoginPage = () => {
        const w = 400;
        const h = 400;
        const LeftPosition = (window.screen.width) ? (window.screen.width - w) / 2 : 0;
        const TopPosition = (window.screen.height) ? (window.screen.height - h) / 2 : 0;
        const settings =
            'height=' + h + ',width=' + w + ',top=' + TopPosition + ',left=' + LeftPosition + ',scrollbars=false,resizable'
        window.open(`https://omc-dms.auth.ap-south-1.amazoncognito.com/login?response_type=token&client_id=5okb1tnp8coildss53virj6dvf&redirect_uri=http://localhost:3000/Login    
        `, "login", settings)
    }
    const openLogoutPage=()=>{

    }
    return (
        <div>
            <Navbar color="light" light>
                <NavbarBrand href="/Search"><img className="omc-logo" src="https://omcltd.in/Portals/0/logo.png" alt="OMC Logo" />&nbsp;&nbsp;<b>Document Management System</b></NavbarBrand>
                <Nav>
                    {!props.userLoggedIn && <NavItem>
                        <Button onClick={openLoginPage}>Login</Button>
                    </NavItem>}
                    {props.userLoggedIn && 
                    <NavItem>
                        <Button onClick={openLogoutPage}>Logout</Button>
                    </NavItem>}
                </Nav>
            </Navbar>
        </div>
    )
}
export default Header;