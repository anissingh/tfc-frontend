import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import '../Navbar/style.css';
import {Link} from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import {useState} from "react";

const LoggedOutNavbar = () => {

    const [openDropdown, setOpenDropdown] = useState(false)

    return (
        <>
        <nav className="navbar navbar-expand navbar-light bg-orange my-navbar">

            <Link className="navbar-brand my-navbar-brand" to="/">Toronto Fitness Club</Link>

            <div className="navbar-collapse my-navbar-main">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link my-navbar-link" to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link my-navbar-link" to="/studios/closest">Studios</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link my-navbar-link" to="/memberships">Memberships</Link>
                    </li>
                </ul>
            </div>

            <div className="navbar-collapse my-navbar-end non-hidden-nav-item-block">
                <ul className="navbar-nav non-hidden-nav-item-block">
                    <li className="nav-item non-hidden-nav-item-block">
                        <Link className="nav-link my-navbar-link non-hidden-nav-item-inline" to="/login">Login</Link>
                    </li>
                </ul>
            </div>

            <button className="my-navbar-dropdown" onClick={() => {setOpenDropdown(!openDropdown)}}><MenuIcon /></button>

        </nav>
        {
            openDropdown ? (
                <div className="my-dropdown">
                    <ul className="my-dropdown-ul list-unstyled">
                        <li className="my-dropdown-li">
                            <Link className="my-dropdown-link" to="/">Home</Link>
                        </li>
                        <li className="my-dropdown-li">
                            <Link className="my-dropdown-link" to="/studios/closest">Studios</Link>
                        </li>
                        <li className="my-dropdown-li">
                            <Link className="my-dropdown-link" to="/memberships">Memberships</Link>
                        </li>
                    </ul>
                </div>
            ) : null
        }
        </>
    )
}



export default LoggedOutNavbar;