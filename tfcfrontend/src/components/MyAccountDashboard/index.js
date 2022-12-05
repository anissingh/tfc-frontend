import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import {useEffect, useState} from "react";
import Navbar from "../Navbar/Navbar";
import Unauthorized from "../Unauthorized";
import {BASE_PORT, BASE_URL} from "../../settings/settings";
import {Link, useNavigate} from "react-router-dom";
import '../Common/buttons.css';
import EditPaymentMethodModal from "../EditPaymentMethodModal";
import PaymentHistoryModal from "../PaymentHistoryModal";
import CancelSubscriptionConfirmationModal from "../CancelSubscriptionConfirmationModal";
import GreetingWrapper from "../MyProfileDashboard/GreetingWrapper";
import {beautifyDate} from "../../utils/utils";


const MyAccountDashboard = () => {

    const [openModal, setOpenModal] = useState(false)
    const [openPaymentModal, setOpenPaymentModal] = useState(false)
    const [openCancelSubscriptionModal, setOpenCancelSubscriptionModal] = useState(false)
    const [forceUpdate, setForceUpdate] = useState(0)
    const navigate = useNavigate()

    const [profileInfo, setProfileInfo] = useState({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        avatar: ''
    })

    const [paymentInfo, setPaymentInfo] = useState({
        nextPaymentDay: '',
        cardNumber: '',
        amount: '',
        frequency: '',
        name: '',
    })

    const [membershipStatus, setMembershipStatus] = useState('')

    const [cardInfo, setCardInfo] = useState({
        number: '',
        holderName: '',
        expirationDate: '',
        cvv: ''
    })

    const updateCardInfo = () => {
        setForceUpdate(forceUpdate + 1)
    }

    const beautifyPhoneNumber = (pNum) => {
        return '(' + pNum.slice(0, 3) + ') ' + pNum.slice(3, 6) + '-' + pNum.slice(6);
    }

    const stripExpDate = (date) => {
        return date.slice(5, 7) + '/' + date.slice(0, 4)
    }

    useEffect(() => {
        fetch(`http://${BASE_URL}:${BASE_PORT}/accounts/view/`, {
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
                if(res.status !== 200) {
                    throw new Error('Error occurred.')
                } else {
                    return res.json()
                }
            })
            .then(res => {
                return res['user-info']
            })
            .then(res => {
                setProfileInfo({
                    id: res.id,
                    firstName: res.first_name,
                    lastName: res.last_name,
                    phone: beautifyPhoneNumber(res.phone),
                    email: res.email,
                    avatar: `http://${BASE_URL}:${BASE_PORT}${res.avatar}`
                })
            })
            .catch((error) => {
                console.log(error.message)
            })
        
    }, [])
    
    useEffect(() => {
        if((profileInfo.id) === '') return

        fetch(`http://${BASE_URL}:${BASE_PORT}/subscriptions/user/${profileInfo.id}/payments/future/`, {
            headers: {'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`}
        })
            .then(res => {
                if(res.status !== 200) {
                    throw new Error('Error occurred.')
                } else {
                    return res.json()
                }
            })
            .then(res => {
                if(res.status !== 'success') {
                    setPaymentInfo({
                        nextPaymentDay: res.next_payment_day,
                        cardNumber: '',
                        amount: '',
                        frequency: '',
                    })
                    throw new Error('No future payment.')
                } else {
                    return res.payment_info
                }
            })
            .then(res => {
                setPaymentInfo({
                    nextPaymentDay: res.next_payment_day,
                    cardNumber: res.card_number,
                    amount: res.amount,
                    frequency: res.recurrence,
                })
            })
            .catch((error) => {
                console.log(error.message)
            })

        fetch(`http://${BASE_URL}:${BASE_PORT}/subscriptions/user/active/`, {
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
                if(res.status !== 200) {
                    throw new Error('Error occurred.')
                } else {
                    return res.json()
                }
            })
            .then(res => {
                if(res.status === 'user has an active subscription') {
                    setMembershipStatus('TRUE')
                } else {
                    setMembershipStatus('FALSE')
                }
            })
            .catch((error) => {
                console.log(error.message)
            })
    }, [profileInfo.id, forceUpdate])


    useEffect(() => {
        fetch(`http://${BASE_URL}:${BASE_PORT}/subscriptions/user/card/`, {
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
                if(res.status !== 200) {
                    throw new Error('Error occurred')
                } else {
                    return res.json()
                }
            })
            .then(res => {
                setCardInfo(cardInfo => ({
                    number: res.card.number,
                    holderName: res.card.holder_name,
                    expirationDate: res.card.expiration_date,
                    cvv: res.card.cvv
                }))
            })
            .catch((error) => {
                console.log(error.message)
            })
    }, [profileInfo.id, forceUpdate])


    if(localStorage.getItem('ACCESS_TOKEN') === null) {
        return (
            <div className="container-fluid p-0">
                <Navbar />
                <div className="container-fluid">
                    <Unauthorized />
                </div>
            </div>
        )
    }

    // User is logged in here
    return (
        <div className="container-fluid p-0">
            <EditPaymentMethodModal open={openModal} onClose={() => {setOpenModal(false)}} updateParentCard={updateCardInfo}/>
            <PaymentHistoryModal open={openPaymentModal} onClose={() => {setOpenPaymentModal(false)}} userId={profileInfo.id}/>
            <CancelSubscriptionConfirmationModal open={openCancelSubscriptionModal} onClose={() => {setOpenCancelSubscriptionModal(false)}}
            updateParent={updateCardInfo}/>
            <Navbar />
            <GreetingWrapper />
            <div className="my-account-container">
                <div className="my-account-row">

                    <div className="profile-information-container">
                        <h1 className="h3 my-account-title">My Profile</h1>
                        <div>
                            <img className="profile-picture" src={profileInfo.avatar}/>
                            {
                                (() => {
                                    if(profileInfo.firstName !== '' || profileInfo.lastName !== '') {
                                        return <p className="user-name-font">{profileInfo.firstName} {profileInfo.lastName}</p>
                                    } else {
                                        return <p className="user-name-font">No Name Set</p>
                                    }
                                })()
                            }
                            <p className="user-content-font">{profileInfo.phone}</p>
                            <p className="user-content-font" style={{marginBottom: 0}}>{profileInfo.email}</p>
                            <Link to="/profile/edit" className="edit-info-link">Edit Information</Link>
                        </div>
                    </div>

                    <div className="membership-container">
                        <h1 className="h3 my-account-title">My Subscription</h1>
                        <div>
                            {(() => {
                                if (membershipStatus === 'TRUE' && paymentInfo.frequency !== '') {
                                    return (
                                        <>
                                        <p className="user-content-font"> <span className="membership-info-title">Next Payment Date:</span> {beautifyDate(paymentInfo.nextPaymentDay)}</p>
                                        <p className="user-content-font"><span className="membership-info-title">Amount:</span> ${paymentInfo.amount}</p>
                                        <p className="user-content-font"><span className="membership-info-title">Recurs:</span> {paymentInfo.frequency}</p>
                                        <p className="user-content-font"><span className="membership-info-title">Active:</span>
                                        <span className="membership-active-status"> {membershipStatus}</span></p>

                                        <button className="btn btn-orange-border" style={{marginRight: '2px'}}
                                                onClick={() => {setOpenCancelSubscriptionModal(true)}}>Cancel</button>
                                        <button className="btn btn-orange-border" style={{marginLeft: '2px'}}
                                                onClick={() => {navigate('/memberships')}}>Update</button>
                                        </>
                                    )
                                } else if (membershipStatus === 'TRUE') {
                                    return (
                                        <>
                                        <p className="user-content-font"> <span className="membership-info-title">Next Payment Date:</span> <span>Cancelled</span></p>
                                        <p className="user-content-font"><span className="membership-info-title">Active:</span>
                                            <span className="membership-active-status"> {membershipStatus}</span></p>
                                        <p className="user-content-font"><span className="membership-info-title">Active Until: </span> {beautifyDate(paymentInfo.nextPaymentDay)}</p>
                                        <button className="btn btn-orange-border"
                                                onClick={() => {navigate('/memberships')}}>Re-Subscribe</button>
                                        </>
                                    )
                                } else {
                                    return (
                                        <>
                                            <p className="mb-1">No active subscription.</p>
                                            <button className="btn btn-orange-border"
                                                    onClick={() => {navigate('/memberships')}}>Subscribe Now</button>
                                        </>
                                    )
                                }
                            })()}
                        </div>
                    </div>

                </div>

                <div className="my-account-row">

                    <div className="profile-information-container">
                        <h1 className="h3 my-account-title">Payment Method</h1>
                        <div>
                            {
                                cardInfo.number !== '' ? (
                                    <>
                                    <p className="user-content-font"><span className="membership-info-title">Card Number:</span> {cardInfo.number}</p>
                                    <p className="user-content-font"><span className="membership-info-title">Cardholder Name:</span> {cardInfo.holderName}</p>
                                    <p className="user-content-font"><span className="membership-info-title">Expiration Date:</span> {stripExpDate(cardInfo.expirationDate)}</p>
                                    <p className="user-content-font"><span className="membership-info-title">CVV:</span> {cardInfo.cvv}</p>
                                    <button className="btn btn-orange-border" onClick={() => setOpenModal(true)}>Edit</button>
                                    </>
                                ) : (
                                    <p>No card on file.</p>
                                )
                            }
                        </div>
                    </div>

                    <div className="membership-container">
                        <h1 className="h3 my-account-title">Request Payment History</h1>
                        <div>
                            <p className="user-content-font"> Click the button below to see your payment history.</p>
                            <button className="btn btn-orange-border" onClick={() => setOpenPaymentModal(true)}>Request History</button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )

}

export default MyAccountDashboard;