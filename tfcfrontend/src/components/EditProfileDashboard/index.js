import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import EditProfileForm from "../EditProfileForm";
import Navbar from "../Navbar/Navbar";
import {useContext} from "react";
import {LoginContext, NO_ACCESS_TOKEN} from "../../clientinfo/clientinfo";
import Unauthorized from "../Unauthorized";

const EditProfileDashboard = () => {

    const loginInfo = useContext(LoginContext)

    if(loginInfo.accessToken === NO_ACCESS_TOKEN) {
        return (
            <div className="container-fluid p-0">
                <Navbar />
                <div className="container-fluid">
                    <Unauthorized />
                </div>
            </div>
        )
    } else {
        return (
            <div className="container-fluid p-0">
                <Navbar />
                <div className="container">
                    <h1 className="display-5 bold-text">Edit Profile</h1>
                    <div className="mt-1 mb-3 warning-container">
                        Only alter the fields that represent attributes of your profile that you wish to change.
                    </div>
                    <EditProfileForm />
                </div>
            </div>
        )
    }

}

export default EditProfileDashboard;