import LoggedOutNavbar from "../LoggedOut";
import LoggedInNoSubscriptionNavbar from "../LoggedInNoSubscription";
import {useState} from "react";

const Navbar = () => {

    const [accessToken, setAccessToken] = useState(localStorage.getItem('ACCESS_TOKEN'))

    const logOut = () => {
        localStorage.removeItem('ACCESS_TOKEN')
        localStorage.removeItem('EMAIL')
        setAccessToken(null)
    }

    if(accessToken === null || accessToken === undefined) {
        // User is logged out
        return (
            <LoggedOutNavbar />
        )
    } else {
        // User is logged in
        return (
            <LoggedInNoSubscriptionNavbar logOut={logOut} />
        )
    }

}

export default Navbar;