import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import {useContext, useEffect, useState} from "react";
import {LoginContext} from "../../../clientinfo/clientinfo";
import {BASE_PORT, BASE_URL} from "../../../settings/settings";
import MyClassHistoryItem from "./MyClassHistoryItem";

const MyClassHistoryDashboard = ({userId}) => {

    const loginInfo = useContext(LoginContext)
    const [pageInfo, setPageInfo] = useState({
        page: 1,
        next: null,
        prev: null,
        count: 0
    })
    const [classes, setClasses] = useState([])

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
        console.log(userId)
        fetch(`http://${BASE_URL}:${BASE_PORT}/studios/classes/user/history/${userId}/?page=${pageInfo.page}`, {
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
                    count: res.count,
                })
                setClasses(res.results)
            })
            .catch((error) => {
                console.log(error.message)
            })

    }, [loginInfo.accessToken, userId, pageInfo.page])

    return (
        <>
        <div className="row my-class-history-container">
            <p className="h4 p-0"><b>My class history</b></p>
        </div>
        <div className="row">
            {
                pageInfo.count > 0 ? (
                    <>
                    <ul className="list-unstyled">
                        {classes.map((clsInstance, index) => (
                            <li className="my-class-history-item-li" key={index}>
                                <MyClassHistoryItem classInfo={{
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
                                }}/>
                            </li>
                        ))}
                    </ul>
                    <div className="align-self-center">
                        <button className={"btn btn-change-page" + (pageInfo.prev === null ? ' disabled' : '')} onClick={handlePrev}>Previous</button>
                        <button className={"btn btn-change-page" + (pageInfo.next === null ? ' disabled' : '')} onClick={handleNext}>Next</button>
                    </div>
                    </>
                ) : (
                    <p>No class history to display.</p>
                )
            }

        </div>
        </>
    )
}

export default MyClassHistoryDashboard;