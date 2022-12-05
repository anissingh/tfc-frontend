import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import EditProfileForm from "../EditProfileForm";
import Navbar from "../Navbar/Navbar";
import Unauthorized from "../Unauthorized";

const EditProfileDashboard = () => {

    if(localStorage.getItem('ACCESS_TOKEN') === null) {
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
                        <b>Only alter the fields that represent attributes of your profile that you wish to change.</b>
                    </div>
                    <EditProfileForm />
                </div>
            </div>
        )
    }

}

export default EditProfileDashboard;