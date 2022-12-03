import MyClassScheduleItem from "../MyClassScheduleItem";
import {useContext, useEffect, useState} from "react";
import {BASE_PORT, BASE_URL} from "../../../settings/settings";
import {LoginContext} from "../../../clientinfo/clientinfo";
import '../../Common/alerts.css';
import './style.css';

const MyClassScheduleDashboard = ({userId}) => {

    const loginInfo = useContext(LoginContext)
    const [classes, setClasses] = useState([])
    const [pageInfo, setPageInfo] = useState({
        page: 1,
        next: null,
        prev: null,
        forceUpdate: false,
        count: 0
    })

    const [userDropNotification, setUserDropNotification] = useState({
        cls: 'notification',
        content: ''
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

    const updateParent = () => {
        setPageInfo({...pageInfo, page: 1, forceUpdate: !pageInfo.forceUpdate, count: 0})
        setUserDropNotification({
            cls: 'success-notification',
            content: 'Success.'
        })
    }

    useEffect(() => {
        console.log(userId)
        fetch(`http://${BASE_URL}:${BASE_PORT}/studios/classes/user/schedule/${userId}/?page=${pageInfo.page}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${loginInfo.accessToken}`
            }
        })
            .then(res => {
                if(res.status !== 200) {
                    // TODO: Handle
                    throw new Error('Unknown error occurred.')
                } else {
                    return res.json()
                }
            })
            .then(res => {
                setPageInfo({
                    ...pageInfo,
                    next: res.next,
                    prev: res.previous,
                    count: res.count
                })
                setClasses(res.results)
            })
            .catch((error) => {
                console.log(error.message)
            })

    }, [loginInfo.accessToken, userId, pageInfo.page, pageInfo.forceUpdate])

    useEffect(() => {
        setUserDropNotification({
            cls: 'notification',
            content: ''
        })
    }, [])

    return (
        <>
        <div className="row my-booked-classes-container">
            <p className="h4 p-0"><b>My booked classes</b></p>
        </div>
        <div className="row">
            {
                pageInfo.count > 0 ? (
                    <>
                    <ul className="list-unstyled">
                        {classes.map((clsInstance, index) => (
                            <li className="my-class-schedule-item-li" key={index}>
                                <MyClassScheduleItem classInfo={{
                                    id: clsInstance.id,
                                    cls: {
                                        id: clsInstance.cls.id,
                                        name: clsInstance.cls.name
                                    },
                                    date: clsInstance.date,
                                    startTime: clsInstance.start_time,
                                    endTime: clsInstance.end_time,
                                    enrolled: clsInstance.enrolled,
                                    capacity: clsInstance.capacity,
                                    coach: clsInstance.coach,
                                }} updateParent={updateParent}/>
                            </li>
                        ))}
                    </ul>
                    <div className="align-self-center">
                        <button className={"btn btn-change-page" + (pageInfo.prev === null ? ' disabled' : '')} onClick={handlePrev}>Previous</button>
                        <button className={"btn btn-change-page" + (pageInfo.next === null ? ' disabled' : '')} onClick={handleNext}>Next</button>
                    </div>
                    </>
                ) : (
                    <p>Your class schedule is empty.</p>
                )
            }
            <p className={userDropNotification.cls}>
                {userDropNotification.content}
            </p>
        </div>
        </>
    )

}

export default MyClassScheduleDashboard;