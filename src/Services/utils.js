export const centeredPopup=()=>{
    const w=400;
    const h=400;
    const LeftPosition = (window.screen.width) ? (window.screen.width - w) / 2 : 0;
    const TopPosition = (window.screen.height) ? (window.screen.height - h) / 2 : 0;
    const settings =
        'height=' + h + ',width=' + w + ',top=' + TopPosition + ',left=' + LeftPosition + ',scrollbars=false,resizable'
    window.open(`https://omc-dms.auth.ap-south-1.amazoncognito.com/login?response_type=token&client_id=5okb1tnp8coildss53virj6dvf&redirect_uri=http://localhost:3000/Login    
    `, "login", settings)
}