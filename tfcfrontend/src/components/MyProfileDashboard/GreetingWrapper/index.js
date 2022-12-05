import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import MyProfileNavbar from "../../MyProfileNavbar";

const GreetingWrapper = () => {


    return (
        <>
        <div className="container-fluid p-0 d-flex flex-column">
            <p className="h1 align-self-center mt-5 mb-5">Hello, {localStorage.getItem('EMAIL')}</p>
            <MyProfileNavbar />
        </div>
        </>
    )

}

export default GreetingWrapper;