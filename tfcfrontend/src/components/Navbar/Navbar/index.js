import {useContext} from "react";
import {LoginContext, NO_ACCESS_TOKEN} from "../../../clientinfo/clientinfo";
import LoggedOutNavbar from "../LoggedOut";
import LoggedInNoSubscriptionNavbar from "../LoggedInNoSubscription";


const Navbar = () => {

    const loginInfo = useContext(LoginContext)

    if(loginInfo.accessToken === NO_ACCESS_TOKEN) {
        // User is logged out
        return (
            <LoggedOutNavbar />
        )
    } else {
        // User is logged in
        // TODO: Add functionality for subscription
        return (
            <LoggedInNoSubscriptionNavbar />
        )
    }

}

export default Navbar;