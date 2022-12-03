import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import RegisterForm from "../RegisterForm";
import {Link} from "react-router-dom";
import Navbar from "../Navbar/Navbar";

const RegisterDashboard = () => {

    return (
        <div className="container-fluid p-0">
            <Navbar />
            <RegisterForm />
            <div className="d-flex flex-column align-items-center">
                <div>
                    Already have an account?
                </div>
                <div>
                    <Link to="/login">
                        <button className="btn btn-light-fade">Login</button>
                    </Link>
                </div>
                <div>
                    <p className="notification" id="register-notification"></p>
                </div>
            </div>
        </div>
    )
}

export default RegisterDashboard;