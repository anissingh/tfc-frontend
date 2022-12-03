import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import '../../../Common/buttons.css'
import {useEffect, useState} from "react";
import {BASE_URL, BASE_PORT} from "../../../../settings/settings";


const MyClassHistoryItem = ({classInfo, updateParent}) => {

    const [keywords, setKeywords] = useState([])

    useEffect(() => {
        fetch(`http://${BASE_URL}:${BASE_PORT}/studios/classes/${classInfo.cls.id}/keywords/`)
            .then(res => {
                if(res.status !== 200) {
                    // TODO: Handle
                    throw new Error('Unknown error occurred.')
                } else {
                    return res.json()
                }
            })
            .then(res => {
                setKeywords(res.keywords)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [classInfo.cls.id])

    return (
        <div className="container-fluid d-flex flex-column class-schedule-item-background">
            <div className="row mt-2">
                <div className="col-2 align-self-center">
                    <div className="d-flex flex-column">
                        <div className="align-self-center">
                            <p className="mb-1"><b>Date: </b>{classInfo.date}</p>
                            <p>{classInfo.startTime} &#9679; {classInfo.endTime}</p>
                        </div>
                    </div>
                </div>
                <div className="col-1">
                </div>
                <div className="col-5 align-self-center">
                    <div className="d-flex flex-column">
                        <div className="align-self-center w-100">
                            <p className="mb-0"><b>{classInfo.cls.name}</b></p>
                            <p>{keywords.map((keyword, index) => (
                                <span key={index}>{keyword.word} &#9679; </span>
                            ))}</p>
                        </div>
                    </div>
                </div>
                <div className="col-2 align-self-center">
                    <div className="d-flex flex-column">
                        <div className="align-self-center">
                            <p>{classInfo.coach}</p>
                        </div>
                    </div>
                </div>
                <div className="col-2 align-self-center">

                </div>
            </div>
        </div>
    )

}

export default MyClassHistoryItem;