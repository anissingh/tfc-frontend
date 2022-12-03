import {useEffect, useState} from "react";
import '../Common/buttons.css'
import './style.css'
import {useNavigate} from "react-router-dom";

const StudioListItem = (props) => {

    const navigate = useNavigate()
    const [studioInfo, setStudioInfo] = useState({
        id: '',
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        postal_code: '',
        phone: ''
    })

    const beautifyPhoneNumber = (pNum) => {
        return '(' + pNum.slice(0, 3) + ') ' + pNum.slice(3, 6) + '-' + pNum.slice(6);
    }

    useEffect(() => {
        setStudioInfo({
            id: props.studioInfo.id,
            name: props.studioInfo.name,
            address: props.studioInfo.address,
            latitude: props.studioInfo.latitude,
            longitude: props.studioInfo.longitude,
            postal_code: props.studioInfo.postal_code,
            phone: beautifyPhoneNumber(props.studioInfo.phone)
        });
    }, [props])


    return (
        <div className="studio-item">
            <div>
                <p className="h4">{studioInfo.name}</p>
                <p className="studio-item-subtext">{studioInfo.address}</p>
                <p className="studio-item-subtext">{studioInfo.phone}</p>
                <p className="studio-item-subtext">x km away</p>
            </div>
            <div className="flex-container">
                <button className="flex-child btn btn-grey-border-text studio-item-button-text"
                onClick={() => {props.onGetDirections(studioInfo.latitude, studioInfo.longitude)}}>DIRECTIONS</button>
                <button className="flex-child btn btn-orange-border studio-item-button-text"
                onClick={() => {navigate(`/studios/${studioInfo.id}/view/`)}}>VIEW STUDIO</button>
            </div>
        </div>
    )

}

export default StudioListItem;