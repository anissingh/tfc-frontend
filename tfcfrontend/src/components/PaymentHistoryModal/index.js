import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import {useContext, useEffect, useState} from "react";
import {BASE_URL, BASE_PORT} from "../../settings/settings";
import {LoginContext} from "../../clientinfo/clientinfo";

const PaymentHistoryModal = ({open, onClose, userId}) => {

    // TODO: Handle pagination
    // TODO: Remove fake data

    const loginInfo = useContext(LoginContext)
    const [payments, setPayments] = useState([])

    const beautifyDatePaid = (datePaid) => {
        return datePaid.slice(0, 10)
    }

    useEffect(() => {
        fetch(`http://${BASE_URL}:${BASE_PORT}/subscriptions/user/${userId}/payments/history/?page=1`, {
            headers: {'Authorization': `Bearer ${loginInfo.accessToken}`}
        })
            .then(res => {
                if(res.status !== 200) {
                    // TODO: Handle this
                    throw new Error('Unexpected error.')
                } else {
                    return res.json()
                }
            })
            .then(res => res.results)
            .then(res => {
                setPayments(res)
            })
            .catch((error) => {
                console.log(error.message)
            })
    }, [loginInfo.accessToken, userId])

    if(!open) return null

    return (
        <div className="overlay" onClick={onClose}>
            <div className="modal-container-p" onClick={(event) => {event.stopPropagation()}}>
                <p className="close-btn" onClick={onClose}>X</p>
                <p className="h3 payment-history-list-title">Payment History</p>
                <div className="payment-history-list">
                    {payments.map((payment, index) => (
                        <div className="payment-row" key={index}>
                            <div className="payment-date-container">
                                <p><b>{beautifyDatePaid(payment.date_and_time)}</b></p>
                            </div>
                            <div className="payment-info-container">
                                <p className="payment-info-item">
                                    <span className="ph-title">Amount:</span> ${payment.amount} (CAD)
                                </p>
                                <p className="payment-info-item">
                                    <span className="ph-title">Card Used:</span> {payment.card_used.number}
                                </p>
                                <p className="payment-info-item">
                                    <span className="ph-title">Cardholder Name:</span> {payment.card_used.holder_name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

}

export default PaymentHistoryModal;