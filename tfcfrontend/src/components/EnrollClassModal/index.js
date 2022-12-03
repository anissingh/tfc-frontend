import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import '../Common/modal.css';
import '../Common/buttons.css';
import '../Common/alerts.css';
import {useContext, useEffect, useState} from "react";
import {BASE_PORT, BASE_URL} from "../../settings/settings";
import {LoginContext} from "../../clientinfo/clientinfo";
import {capitalizeFirstLetter} from "../../utils/utils";


const EnrollClassModal = ({open, onClose, classInfo, onEnroll}) => {

    // TODO: Add studio name at top?
    const [description, setDescription] = useState('')
    const [enrollNotification, setEnrollNotification] = useState({
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
                'Authorization': `Bearer ${loginInfo.accessToken}`
            },
            body: JSON.stringify({
                email: loginInfo.email,
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
                'Authorization': `Bearer ${loginInfo.accessToken}`
            },
            body: JSON.stringify({
                email: loginInfo.email
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
        <div className="overlay" onClick={onClose}>
            <div className="modal-container ps-5 pe-5" onClick={(event) => {event.stopPropagation()}} style={{maxHeight: '50vh'}}>
                <p className="close-btn" onClick={onClose}>&#x2715;</p>
                <div className="container d-flex flex-column">
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

