import '../Common/buttons.css'
import {useNavigate} from "react-router-dom";

const Unauthorized = () => {

    const navigate = useNavigate();

    return (
        <div className="d-flex flex-column align-items-center">
            <div className="row">
                <h1 className="display-4">We're sorry.</h1>
            </div>
            <div className="row">
                <p>The page you are trying to access is restricted to website users only. Please log in to view
                this page.</p>
            </div>
            <div className="row">
                <button className="btn btn-orange-fade" onClick={() => navigate("/login")}>Log In</button>
            </div>
        </div>
    )

}

export default Unauthorized;