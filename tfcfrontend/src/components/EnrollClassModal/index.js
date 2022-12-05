import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import '../Common/modal.css';
import '../Common/buttons.css';
import '../Common/alerts.css';
import {useEffect, useState} from "react";
import {BASE_PORT, BASE_URL} from "../../settings/settings";
import {calculateDuration, capitalizeFirstLetter} from "../../utils/utils";
import LocationOnIcon from "@mui/icons-material/LocationOn";


const EnrollClassModal = ({open, onClose, classInfo, onEnroll}) => {

    const [description, setDescription] = useState('')
    const [enrollNotification, setEnrollNotification] = useState({
        cls: '',
        content: ''
    })

    useEffect(() => {
        fetch(`http://${BASE_URL}:${BASE_PORT}/studios/classes/${classInfo.cls.id}/description/`)
            .then(res => {
                if(res.status !== 200) {
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
        setEnrollNotification({
            cls: 'notification',
            content: ''
        })
    }, [])

    const handleEnroll = () => {
        fetch(`http://${BASE_URL}:${BASE_PORT}/studios/classes/${classInfo.cls.id}/enroll/one/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
            },
            body: JSON.stringify({
                email: localStorage.getItem('EMAIL'),
                date: classInfo.date
            })
        })
            .then(res => {
                if(res.status !== 400 && res.status !== 200 && res.status !== 401) {
                    setEnrollNotification({
                        cls: 'notification',
                        content: 'Unknown error occurred.'
                    })
                    throw new Error('Unknown error occurred.')
                } else if(res.status === 401) {
                    setEnrollNotification({
                        cls: 'notification',
                        content: 'Please log in to enroll.'
                    })
                    localStorage.removeItem('ACCESS_TOKEN')
                    localStorage.removeItem('EMAIL')
                    throw new Error('Unrecognized access token.')
                } else if (res.status === 400) {
                    return res.json().then(res => {
                        setEnrollNotification({
                            cls: 'notification',
                            content: `${capitalizeFirstLetter(res.status)}.`
                        })
                        throw new Error('Enrollment error.')
                    })
                } else {
                    return res.json()
                }
            })
            .then(res => {
                setEnrollNotification({
                    cls: 'success-notification',
                    content: 'Enrollment successful.'
                })
                onEnroll()
            })
            .catch((error) => {
                console.log(error.message)
            })
    }

    const handleEnrollAll = () => {
        fetch(`http://${BASE_URL}:${BASE_PORT}/studios/classes/${classInfo.cls.id}/enroll/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
            },
            body: JSON.stringify({
                email: localStorage.getItem('EMAIL')
            })
        })
            .then(res => {
                if(res.status !== 400 && res.status !== 200 && res.status !== 401) {
                    setEnrollNotification({
                        cls: 'notification',
                        content: 'Unknown error occurred.'
                    })
                    throw new Error('Unknown error occurred.')
                } else if(res.status === 401) {
                    setEnrollNotification({
                        cls: 'notification',
                        content: 'Please log in to enroll.'
                    })
                    localStorage.removeItem('ACCESS_TOKEN')
                    localStorage.removeItem('EMAIL')
                    throw new Error('Unrecognized access token.')
                } else if (res.status === 400) {
                    return res.json().then(res => {
                        setEnrollNotification({
                            cls: 'notification',
                            content: `${capitalizeFirstLetter(res.status)}.`
                        })
                        throw new Error('Enrollment error.')
                    })
                } else {
                    return res.json()
                }
            })
            .then(res => {
                setEnrollNotification({
                    cls: 'success-notification',
                    content: 'Enrollment successful.'
                })
                onEnroll()
            })
            .catch((error) => {
                console.log(error.message)
            })
    }

    if(!open) return null

    return (
        <div className="overlay en-modal-overlay" onClick={() => {}}>
            <div className="modal-container ps-5 pe-5" onClick={(event) => {event.stopPropagation()}} style={{maxHeight: '50vh'}}>
                <p className="close-btn" onClick={onClose}>&#x2715;</p>
                <div className="container d-flex flex-column">
                    <div className="row mb-3">
                        <span><LocationOnIcon className="en-pin"/> {classInfo.studioName}</span>
                    </div>
                    <div className="row">
                        <p className="h3 text-orange">{classInfo.startTime} - {classInfo.endTime}</p>
                        <p>Duration: {calculateDuration(classInfo.startTime, classInfo.endTime)} minutes</p>
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
                            <p className={classInfo.enrolled === classInfo.capacity ? "cem-unenrollable" : "cem-enrollable"}>
                                {classInfo.enrolled} / {classInfo.capacity}
                            </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <button className="btn btn-orange-grey-fade" onClick={handleEnroll}>Enroll</button>
                            <button className="btn btn-white-grey-fade" onClick={handleEnrollAll}>Enroll in all available classes</button>
                        </div>
                        <p className={enrollNotification.cls}>{enrollNotification.content}</p>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default EnrollClassModal;

