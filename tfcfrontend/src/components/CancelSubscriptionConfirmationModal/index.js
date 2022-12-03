import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import {BASE_PORT, BASE_URL} from "../../settings/settings";
import {useContext, useState} from "react";
import {LoginContext} from "../../clientinfo/clientinfo";
import '../Common/alerts.css';

const CancelSubscriptionConfirmationModal = ({open, onClose, updateParent}) => {

    const loginInfo = useContext(LoginContext)
    const [cancelSubscriptionNotification, setCancelSubscriptionNotification] = useState({
        cls: 'notification',
        content: ''
    })

    const onCancel = () => {
        fetch(`http://${BASE_URL}:${BASE_PORT}/subscriptions/cancel/`, {
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
                if(res.status === 400) {
                    setCancelSubscriptionNotification({
                        cls: 'notification',
                        content: 'You do not have an active subscription.'
                    })
                    throw new Error('No active subscription.')
                } else if(res.status === 406) {
                    setCancelSubscriptionNotification({
                        cls: 'notification',
                        content: 'Your subscription has already been cancelled.'
                    })
                    throw new Error('No subscription due to cancellation.')
                }
                else if(res.status !== 200) {
                    setCancelSubscriptionNotification({
                        cls: 'notification',
                        content: 'Unknown error occurred.'
                    })
                    throw new Error('Unknown error occurred.')
                } else {
                    return res.json()
                }
            })
            .then(res => {
                setCancelSubscriptionNotification({
                    cls: 'success',
                    content: 'Successfully cancelled subscription.'
                })
                updateParent()
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
                <div className="cscm-flex-container">
                    <p>Are you sure you want to cancel your subscription?</p>
                    <div className="cscm-btn-container">
                        <button className="btn btn-danger" onClick={onCancel}>Yes</button>
                        <button className="btn cscm-no-btn" onClick={onClose}>No</button>
                    </div>
                    <p className={cancelSubscriptionNotification.cls}>{cancelSubscriptionNotification.content}</p>
                </div>
            </div>
        </div>
    )

}

export default CancelSubscriptionConfirmationModal;