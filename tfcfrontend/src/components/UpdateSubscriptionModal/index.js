import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import '../Common/alerts.css';
import {useContext, useEffect, useState} from "react";
import {LoginContext} from "../../clientinfo/clientinfo";
import {BASE_PORT, BASE_URL} from "../../settings/settings";

const UpdateSubscriptionModal = ({open, onClose, planId}) => {

    const loginInfo = useContext(LoginContext)
    const [updateSubscriptionNotification, setUpdateSubscriptionNotification] = useState({
        cls: 'notification',
        content: ''
    })

    useEffect(() => {
        setUpdateSubscriptionNotification({
            cls: 'notification',
            content: ''
        })
    }, [open])

    const updateSubscription = () => {
        fetch(`http://${BASE_URL}:${BASE_PORT}/subscriptions/update/plan/${planId}/`, {
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
                if(res.status !== 200) {
                    setUpdateSubscriptionNotification({
                        cls: 'notification',
                        content: 'Unknown error occurred.'
                    })
                    throw new Error('Unknown error occurred.')
                } else {
                    return res.json()
                }
            })
            .then(res => {
                setUpdateSubscriptionNotification({
                    cls: 'success',
                    content: 'Successfully updated your subscription.'
                })
            })
            .catch((error) => {
                console.log(error.message)
            })
    }

    if(!open) return null

    return (
        <div className="overlay" onClick={onClose}>
            <div className="modal-container" onClick={(event) => {event.stopPropagation()}}>
                <p className="close-btn" onClick={onClose}>X</p>
                <div className="usm-flex-container">
                    <p>Are you sure you want to subscribe?</p>
                    <div className="usm-btn-container">
                        <button className="btn btn-danger" onClick={updateSubscription}>Yes</button>
                        <button className="btn usm-no-btn" onClick={onClose}>No</button>
                    </div>
                    <p className={updateSubscriptionNotification.cls}>{updateSubscriptionNotification.content}</p>
                </div>
            </div>
        </div>
    )

}

export default UpdateSubscriptionModal;