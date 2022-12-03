import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import logo from '../../../media/tfc_website_home_bg.jpg';
import {useNavigate} from "react-router-dom";

const MainBackground = () => {

    const navigate = useNavigate()

    return (
        <div className="main-background-container">
            <div className="main-background-image" style={{backgroundImage: `url(${logo})`}}>
                <div className="main-bg-content">
                    <h1 className="main-bg-welcome-title">Toronto Fitness Club</h1>
                    <p className="main-bg-welcome-description">The fitness facility for all your needs.</p>
                    <button className="btn main-bg-join-now-btn" onClick={() => navigate('/register')}>Join now</button>
                </div>
            </div>
        </div>
    )

}

export default MainBackground;