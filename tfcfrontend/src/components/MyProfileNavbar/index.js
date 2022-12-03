import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import {Link} from "react-router-dom";

const MyProfileNavbar = () => {

    return (
        <div className="container-fluid p-0">
            <div className="d-flex justify-content-center mpn-bg">
                <Link className="mpn-button" to="/profile/bookings">Bookings</Link>
                <Link className="mpn-button" to="/profile/view">My Account</Link>
            </div>
        </div>
    )

}

export default MyProfileNavbar;