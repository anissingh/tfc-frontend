import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import '../Common/buttons.css';
import '../Common/alerts.css';
import {useState} from "react";
import {BASE_PORT, BASE_URL} from "../../settings/settings";

const EditPaymentMethodModal = ({open, onClose, updateParentCard}) => {

    const [formData, setFormData] = useState({
        cardNumber: '',
        cardHolderName: '',
        expDate: '',
        cvv: ''
    })

    const [updatePaymentNotification, setUpdatePaymentNotification] = useState({
        content: '',
        cls: 'notification'
    })


    const update = (field, value) => {
        setFormData({...formData, [field]: value})
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if(localStorage.getItem('ACCESS_TOKEN') === null) {
            setUpdatePaymentNotification({
                cls: 'notification',
                content: 'Please login to subscribe.'
            })
            return
        }

        fetch(`http://${BASE_URL}:${BASE_PORT}/subscriptions/update/card/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
            },
            body: JSON.stringify({
                email: localStorage.getItem('EMAIL'),
                card_number: formData.cardNumber,
                cardholder_name: formData.cardHolderName,
                expiration_date: formData.expDate,
                cvv: formData.cvv
            })
        })
            .then(res => {
                if(res.status === 401) {
                    // TODO: Re-direct to login page?
                    setUpdatePaymentNotification({
                        cls: 'notification',
                        content: 'Access token expired. Please log in again.'
                    })
                    throw new Error('Access token invalid.')
                } else if(res.status === 400) {
                    setUpdatePaymentNotification({
                        cls: 'notification',
                        content: 'Invalid card data provided.'
                    })
                    throw new Error('Invalid card data.')
                } else if(res.status === 406) {
                    setUpdatePaymentNotification({
                        cls: 'notification',
                        content: 'No subscription detected. Please update your subscription in edit profile.'
                    })
                    // TODO: Handle better
                    throw new Error('No subscription detected. Please update your subscription in edit profile.')
                } else if(res.status !== 200) {
                    setUpdatePaymentNotification({
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
                setUpdatePaymentNotification({
                    cls: 'success-notification',
                    content: 'Successfully updated payment method.'
                })
                updateParentCard()
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
                <h1 className="display-6 bold-text">Update Payment Method</h1>
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
                    <p className={updatePaymentNotification.cls}>{updatePaymentNotification.content}</p>
                    <button type="submit" className="btn btn-orange-fade mt-1">Update</button>
                </form>
            </div>
        </div>
    )

}

export default EditPaymentMethodModal;