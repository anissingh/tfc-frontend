import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import Navbar from "../Navbar/Navbar";
import GreetingWrapper from "../MyProfileDashboard/GreetingWrapper";
import {useEffect, useState} from "react";
import Unauthorized from "../Unauthorized";
import {BASE_PORT, BASE_URL} from "../../settings/settings";
import '../Common/alerts.css';
import MyClassScheduleDashboard from "./MyClassScheduleDashboard";
import MyClassHistoryDashboard from "./MyClassHistoryDashboard";

const MyBookingsDashboard = () => {

    const [userId, setUserId] = useState(-1)


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
                    // TODO: Handle
                    throw new Error('Error occurred.')
                } else {
                    return res.json()
                }
            })
            .then(res => {
                setUserId(res['user-info'].id)
            })
            .catch((error) => {
                console.log(error.message)
            })

    }, [])

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

    return (
        <div className="container-fluid p-0">
            <Navbar />
            <GreetingWrapper />
            <div className="container d-flex flex-column mt-5">
                <div>
                    <MyClassScheduleDashboard userId={userId} />
                </div>
                <div className="mt-5">
                    <MyClassHistoryDashboard userId={userId}/>
                </div>
            </div>
        </div>
    )

}

export default MyBookingsDashboard;