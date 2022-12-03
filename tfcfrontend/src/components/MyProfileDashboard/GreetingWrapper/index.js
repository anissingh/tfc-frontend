import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import Navbar from "../../Navbar/Navbar";
import MyProfileNavbar from "../../MyProfileNavbar";
import {useContext} from "react";
import {LoginContext} from "../../../clientinfo/clientinfo";

const GreetingWrapper = () => {

    const loginInfo = useContext(LoginContext)

    return (
        <>
        <div className="container-fluid p-0 d-flex flex-column">
            <p className="h1 align-self-center mt-5 mb-5">Hello, {loginInfo.email}</p>
            <MyProfileNavbar />
        </div>
        </>
    )

}

export default GreetingWrapper;