import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import Navbar from "../Navbar/Navbar";
import {useState, useEffect} from "react";
import {BASE_PORT, BASE_URL} from "../../settings/settings";
import SubscribeModal from "../SubscribeModal";
import UpdateSubscriptionModal from "../UpdateSubscriptionModal";

const SubscriptionPlanDashboard = () => {

    const [plans, setPlans] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [openUpdateModal, setOpenUpdateModal] = useState(false)
    const [modalPlanId, setModalPlanId] = useState(0)

    const [pageInfo, setPageInfo] = useState({
        page: 1,
        next: null,
        prev: null
    })

    const handleNext = () => {
        // Only allow this to happen if next page exists
        if(pageInfo.next === null) return

        setPageInfo({...pageInfo, page: pageInfo.page + 1})
    }

    const handlePrev = () => {
        // Only allow this to happen if previous page exists
        if(pageInfo.prev === null) return

        setPageInfo({...pageInfo, page: pageInfo.page - 1})
    }

    useEffect(() => {
        fetch(`http://${BASE_URL}:${BASE_PORT}/subscriptions/plans/all/?page=${pageInfo.page}`)
            .then(res => {
                if(res.status !== 200) {
                    throw new Error('Unknown error occurred.')
                } else {
                    return res.json()
                }
            })
            .then(res => {
                setPageInfo(pageInfo => ({
                    ...pageInfo,
                    prev: res.previous,
                    next: res.next
                }))
                setPlans(res.results)
            })
            .catch((error) => {
                console.log(error.message)
            })
    }, [pageInfo.page])


    const handleSignup = async (event, id) => {
        event.preventDefault()

        if(localStorage.getItem('ACCESS_TOKEN') === null) {
            setModalPlanId(parseInt(id))
            setOpenModal(true)
        }

        let userHasActiveSubscription = false

        // Open update view if user is already subscribed.
        await fetch(`http://${BASE_URL}:${BASE_PORT}/subscriptions/user/active/`, {
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
                    throw new Error('No subscription or server error.')
                } else {
                    return res.json()
                }
            })
            .then(res => {
                userHasActiveSubscription = true
            })
            .catch((error) => {
                console.log(error.message)
            })

        if(userHasActiveSubscription) {
            setModalPlanId(parseInt(id))
            setOpenUpdateModal(true)
        } else {
            setModalPlanId(parseInt(id))
            setOpenModal(true)
        }
    }

    return (
        <div className="container-fluid p-0">
        <SubscribeModal open={openModal} onClose={() => {setOpenModal(false)}} planId={modalPlanId}/>
        <UpdateSubscriptionModal open={openUpdateModal} onClose={() => {setOpenUpdateModal(false)}} planId={modalPlanId}/>
        <Navbar />
        <div className="container-fluid p-0 plan-container">
            <div className="panel-container">
                <div className="panel">
                    {plans.map((plan) => (
                        <div className="subscription-plan" key={plan.id}>
                            <h2 className="plan-header">{plan.name}</h2>
                            <div className="plan-description">
                                {plan.description}
                            </div>
                            <span className="plan-price">${plan.amount} CAD</span>
                            <span className="plan-frequency">{plan.frequency}</span>
                            <a href="" className="plan-button" onClick={(event) => {handleSignup(event, plan.id)}}>Subscribe</a>
                        </div>
                    ))}
                </div>
                <div className="next-panel">
                    <div className={"arrow-subscription left-arrow-subscription" + (pageInfo.prev === null ? ' arrow-disabled' : '')} onClick={handlePrev}>&lt;</div>
                    <div className={"arrow-subscription right-arrow-subscription" + (pageInfo.next === null ? ' arrow-disabled' : '')} onClick={handleNext}>&gt;</div>
                </div>
            </div>
        </div>
        </div>
    )

}

export default SubscriptionPlanDashboard;