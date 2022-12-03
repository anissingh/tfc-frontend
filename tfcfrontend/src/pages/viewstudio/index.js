import './style.css';
import {useParams} from "react-router-dom";
import StudioDashboard from "../../components/StudioDashboard";

const ViewStudio = () => {

    const {studioId} = useParams()

    return (
        <StudioDashboard studioId={studioId} />
    )

}

export default ViewStudio;