import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import '../Common/buttons.css'
import LoginForm from "../LoginForm";
import {Link} from "react-router-dom";
import Navbar from "../Navbar/Navbar";

const LoginDashboard = () => {

    return (
        <div className="container-fluid p-0">
            <Navbar />
            <LoginForm />
            <div className="d-flex flex-column align-items-center">
                <div>
                    Don't have an account?
                </div>
                <div>
                    <Link to="/register">
                        <button className="btn btn-light-fade">Register</button>
                    </Link>
                </div>
            </div>
        </div>
    )

}

export default LoginDashboard;