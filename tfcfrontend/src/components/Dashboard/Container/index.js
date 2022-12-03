import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import Navbar from "../../Navbar/Navbar";
import FindStudioNavbar from "../FindStudioNavbar";
import MainBackground from "../MainBackground";


const Dashboard = () => {

    return (
        <div className="container-fluid p-0">
            <Navbar />
            <FindStudioNavbar />
            <MainBackground />
        </div>
    )

}

export default Dashboard;