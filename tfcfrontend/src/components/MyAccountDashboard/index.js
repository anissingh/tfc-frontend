import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import {useContext, useEffect, useState} from "react";
import {LoginContext, NO_ACCESS_TOKEN} from "../../clientinfo/clientinfo";
import Navbar from "../Navbar/Navbar";
import Unauthorized from "../Unauthorized";
import {BASE_PORT, BASE_URL} from "../../settings/settings";
import {Link, useNavigate} from "react-router-dom";
import '../Common/buttons.css';
import EditPaymentMethodModal from "../EditPaymentMethodModal";
import PaymentHistoryModal from "../PaymentHistoryModal";
import CancelSubscriptionConfirmationModal from "../CancelSubscriptionConfirmationModal";
import GreetingWrapper from "../MyProfileDashboard/GreetingWrapper";

// TODO: Used getactivesubscription because if we use future payments it will tell the user they
// TODO: do not have an active subscription when they actually do

const MyAccountDashboard = () => {

    const loginInfo = useContext(LoginContext)

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

    const [membershipInfo, setMembershipInfo] = useState({
        nextPaymentDay: '',
        cardNumber: '',
        amount: '',
        frequency: '',
        name: '',
        active: ''
    })

    const updateCardInfo = () => {
        setForceUpdate(forceUpdate + 1)
    }

    const beautifyPhoneNumber = (pNum) => {
        return '(' + pNum.slice(0, 3) + ') ' + pNum.slice(3, 6) + '-' + pNum.slice(6);
    }

    useEffect(() => {
        fetch(`http://${BASE_URL}:${BASE_PORT}/accounts/view/`, {
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
                    // TODO: Handle
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
        
    }, [loginInfo])
    
    useEffect(() => {
        if((profileInfo.id) === '') return

        fetch(`http://${BASE_URL}:${BASE_PORT}/subscriptions/user/${profileInfo.id}/payments/future/`, {
            headers: {'Authorization': `Bearer ${loginInfo.accessToken}`}
        })
            .then(res => {
                if(res.status !== 200) {
                    // TODO: Handle
                    throw new Error('Error occurred.')
                } else {
                    return res.json()
                }
            })
            .then(res => {
                if(res.status !== 'success') {
                    setMembershipInfo({
                        active: 'FALSE'
                    })
                    // TODO: Handle better
                    throw new Error('Cancelled subscription.')
                } else {
                    return res.payment_info
                }
            })
            .then(res => {
                setMembershipInfo({
                    nextPaymentDay: res.next_payment_day,
                    cardNumber: res.card_number,
                    amount: res.amount,
                    frequency: res.recurrence,
                    active: 'TRUE'
                })
            })
            .catch((error) => {
                console.log(error.message)
            })
    }, [loginInfo.accessToken, profileInfo.id, forceUpdate])

    if(loginInfo.accessToken === NO_ACCESS_TOKEN) {
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
    // TODO: Subscription cancelled formatting
    // TODO: Fetch card info using new endpoint, add data to card serializer
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
                            {
                                membershipInfo.active === 'TRUE' ? (
                                    <>
                                    <p className="user-content-font"> <p className="membership-info-title">Next Payment Date:</p> {membershipInfo.nextPaymentDay}</p>
                                    <p className="user-content-font"><p className="membership-info-title">Amount:</p> ${membershipInfo.amount}</p>
                                    <p className="user-content-font"><p className="membership-info-title">Recurs:</p> {membershipInfo.frequency}</p>
                                    <p className="user-content-font"><p className="membership-info-title">Active:</p>
                                    <p className="membership-active-status"> {membershipInfo.active}</p>
                                    </p>
                                    <button className="btn btn-orange-border" style={{marginRight: '2px'}}
                                    onClick={() => {setOpenCancelSubscriptionModal(true)}}>Cancel</button>
                                    <button className="btn btn-orange-border" style={{marginLeft: '2px'}}
                                    onClick={() => {navigate('/memberships')}}>Update</button>
                                    </>
                                ) : (
                                    <>
                                    <p className="mb-1">No active subscription.</p>
                                    <button className="btn btn-orange-border"
                                    onClick={() => {navigate('/memberships')}}>Subscribe Now</button>
                                    </>
                                )
                            }
                        </div>
                    </div>

                </div>

                <div className="my-account-row">

                    <div className="profile-information-container">
                        <h1 className="h3 my-account-title">Payment Method</h1>
                        <div>
                            {
                                membershipInfo.active === 'TRUE' ? (
                                    <>
                                    <p className="user-content-font"><p className="membership-info-title">Card Number:</p> {membershipInfo.cardNumber}</p>
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