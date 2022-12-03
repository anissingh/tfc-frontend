import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import '../Common/buttons.css';
import '../Common/alerts.css';
import {useContext, useEffect, useState} from "react";
import {LoginContext, NO_ACCESS_TOKEN} from "../../clientinfo/clientinfo";
import {BASE_PORT, BASE_URL} from "../../settings/settings";

const SubscribeModal = ({open, onClose, planId}) => {

    const [formData, setFormData] = useState({
        cardNumber: '',
        cardHolderName: '',
        expDate: '',
        cvv: ''
    })

    const [subscribeNotification, setSubscribeNotification] = useState({
        content: '',
        cls: 'notification'
    })

    const loginInfo = useContext(LoginContext)

    const update = (field, value) => {
        setFormData({...formData, [field]: value})
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if(loginInfo.accessToken === NO_ACCESS_TOKEN) {
            setSubscribeNotification({
                cls: 'notification',
                content: 'Please login to subscribe.'
            })
            return
        }

        fetch(`http://${BASE_URL}:${BASE_PORT}/subscriptions/subscribe/${planId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginInfo.accessToken}`
            },
            body: JSON.stringify({
                email: loginInfo.email,
                card_number: formData.cardNumber,
                cardholder_name: formData.cardHolderName,
                expiration_date: formData.expDate,
                cvv: formData.cvv
            })
        })
            .then(res => {
                if(res.status === 401) {
                    // TODO: Re-direct to login page?
                    setSubscribeNotification({
                        cls: 'notification',
                        content: 'Access token expired. Please log in again.'
                    })
                    throw new Error('Access token invalid.')
                } else if(res.status === 400) {
                    setSubscribeNotification({
                        cls: 'notification',
                        content: 'Invalid card data provided.'
                    })
                    throw new Error('Invalid card data.')
                } else if(res.status === 406) {
                    setSubscribeNotification({
                        cls: 'notification',
                        content: 'Already subscribed. Please update your subscription in edit profile.'
                    })
                    throw new Error('Already subscribed.')
                } else if(res.status !== 200) {
                    setSubscribeNotification({
                        cls: 'notification',
                        content: 'Unknown error occurred.'
                    })
                    throw new Error('Unknown Error occurred.')
                } else {
                    return res.json()
                }
            })
            .then(res => {
                console.log(res)
                setSubscribeNotification({
                    cls: 'success-notification',
                    content: 'Successfully subscribed.'
                })
            })
            .catch((error) => {
                console.log(error.message)
            })
    }

    if(!open) return null;

    return (
        <div className="overlay" onClick={onClose}>
            <div className="modal-container" onClick={(event) => {event.stopPropagation()}}>
                <p className="close-btn" onClick={onClose}>X</p>
                <h1 className="display-6 bold-text">Subscribe Now</h1>
                <form action="/" onSubmit={(event) => handleSubmit(event)}>
                    <div className="row">
                        <div className="form-group required">
                            <label htmlFor="cardNumber">Card Number</label>
                            <input type="text" className="form-control" id="cardNumber" placeholder="Your Card Number"
                                   onChange={event => update('cardNumber', event.target.value)}></input>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group required">
                            <label htmlFor="cardHolderName">Cardholder Name</label>
                            <input type="text" className="form-control" id="cardHolderName" placeholder="Card Holder Name"
                                   onChange={event => update('cardHolderName', event.target.value)}></input>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6 form-group required">
                            <label htmlFor="expirationDate">Expiration Date</label>
                            <input type="text" className="form-control" id="expirationDate" placeholder="e.g., 03-2023"
                                   onChange={event => update('expDate', event.target.value)}></input>
                        </div>
                        <div className="col-6 form-group required">
                            <label htmlFor="cvv">CVV</label>
                            <input type="text" className="form-control" id="cvv" placeholder="e.g., 478"
                                   onChange={event => update('cvv', event.target.value)}></input>
                        </div>
                    </div>
                    <p className={subscribeNotification.cls}>{subscribeNotification.content}</p>
                    <button type="submit" className="btn btn-orange-fade mt-1">Subscribe</button>
                </form>
            </div>
        </div>
    )

}

export default SubscribeModal;