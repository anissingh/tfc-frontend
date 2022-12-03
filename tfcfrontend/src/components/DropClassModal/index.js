import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import '../Common/modal.css';
import '../Common/buttons.css';
import '../Common/alerts.css';
import {useContext, useEffect, useState} from "react";
import {BASE_PORT, BASE_URL} from "../../settings/settings";
import {LoginContext} from "../../clientinfo/clientinfo";
import {beautifyDate, capitalizeFirstLetter} from "../../utils/utils";
import LocationOnIcon from '@mui/icons-material/LocationOn';


const DropClassModal = ({open, onClose, classInfo, onDrop}) => {

    // TODO: Add studio name at top?
    const [description, setDescription] = useState('')
    const [dropNotification, setDropNotification] = useState({
        cls: '',
        content: ''
    })
    const loginInfo = useContext(LoginContext)

    useEffect(() => {
        fetch(`http://${BASE_URL}:${BASE_PORT}/studios/classes/${classInfo.cls.id}/description/`)
            .then(res => {
                if(res.status !== 200) {
                    // TODO: Handle better
                    throw new Error('Unknown error occurred.')
                } else {
                    return res.json()
                }
            })
            .then(res => {
                setDescription(res.description)
            })
            .catch((error) => {
                console.log(error.message)
            })
    }, [classInfo.cls.id])

    useEffect(() => {
        setDropNotification({
            cls: 'notification',
            content: ''
        })
    }, [])

    const handleDrop = () => {
        fetch(`http://${BASE_URL}:${BASE_PORT}/studios/classes/${classInfo.cls.id}/drop/one/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginInfo.accessToken}`
            },
            body: JSON.stringify({
                email: loginInfo.email,
                date: classInfo.date
            })
        })
            .then(res => {
                if(res.status !== 400 && res.status !== 200 && res.status !== 401) {
                    setDropNotification({
                        cls: 'notification',
                        content: 'Unknown error occurred.'
                    })
                    throw new Error('Unknown error occurred.')
                } else if(res.status === 401) {
                    setDropNotification({
                        cls: 'notification',
                        content: 'Your session has expired. Please log in again.'
                    })
                    throw new Error('Unrecognized access token.')
                } else if (res.status === 400) {
                    return res.json().then(res => {
                        setDropNotification({
                            cls: 'notification',
                            content: `${capitalizeFirstLetter(res.status)}.`
                        })
                        throw new Error('Drop error.')
                    })
                } else {
                    return res.json()
                }
            })
            .then(res => {
                setDropNotification({
                    cls: 'success-notification',
                    content: 'Successfully dropped this class.'
                })
                onDrop()
            })
            .catch((error) => {
                console.log(error.message)
            })
    }

    const handleDropAll = async () => {
        await fetch(`http://${BASE_URL}:${BASE_PORT}/studios/classes/${classInfo.cls.id}/drop/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginInfo.accessToken}`
            },
            body: JSON.stringify({
                email: loginInfo.email
            })
        })
            .then(res => {
                if(res.status !== 400 && res.status !== 200 && res.status !== 401) {
                    setDropNotification({
                        cls: 'notification',
                        content: 'Unknown error occurred.'
                    })
                    throw new Error('Unknown error occurred.')
                } else if(res.status === 401) {
                    setDropNotification({
                        cls: 'notification',
                        content: 'Your session has expired. Please log in again.'
                    })
                    throw new Error('Unrecognized access token.')
                } else if (res.status === 400) {
                    return res.json().then(res => {
                        setDropNotification({
                            cls: 'notification',
                            content: `${capitalizeFirstLetter(res.status)}.`
                        })
                        throw new Error('Drop error.')
                    })
                } else {
                    return res.json()
                }
            })
            .then(res => {
                setDropNotification({
                    cls: 'success-notification',
                    content: 'Successfully dropped all classes.'
                })
                onDrop()
            })
            .catch((error) => {
                console.log(error.message)
            })
    }

    if(!open) return null

    return (
        <div className="overlay dp-overlay" onClick={() => {}}>
            <div className="modal-container ps-5 pe-5" onClick={(event) => {event.stopPropagation()}} style={{maxHeight: '50vh'}}>
                <p className="close-btn" onClick={onClose}>&#x2715;</p>
                <div className="container d-flex flex-column">
                    <div className="row mb-3">
                        <span><LocationOnIcon className="dp-pin"/> {classInfo.studioName}</span>
                    </div>
                    <div className="row">
                        <p className="h3 text-orange">{classInfo.startTime} - {classInfo.endTime}</p>
                        <p>Duration: x minutes</p>
                    </div>
                    <div className="row">
                        <p className="h3">{classInfo.cls.name}</p>
                    </div>
                    <div className="row">
                        <p>{description}</p>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <p className="cem-subheading mb-0">Coach:</p>
                            <p>{classInfo.coach}</p>
                        </div>
                        <div className="col-6">
                            <p className="cem-subheading mb-0">Capacity:</p>
                            <p>
                                {classInfo.enrolled} / {classInfo.capacity}
                            </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <button className="btn btn-orange-grey-fade" onClick={handleDrop}>Drop</button>
                            <button className="btn btn-white-grey-fade" onClick={handleDropAll}>Drop all classes of this type</button>
                        </div>
                        <p className={dropNotification.cls}>{dropNotification.content}</p>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default DropClassModal;

