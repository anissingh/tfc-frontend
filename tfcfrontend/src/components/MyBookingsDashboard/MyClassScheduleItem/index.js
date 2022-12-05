import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import '../../Common/buttons.css';
import {useEffect, useState} from "react";
import {BASE_URL, BASE_PORT} from "../../../settings/settings";
import DropClassModal from "../../DropClassModal";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {beautifyDate} from "../../../utils/utils";

const MyClassScheduleItem = ({classInfo, updateParent}) => {

    const [keywords, setKeywords] = useState([])
    const [openDropModal, setOpenDropModal] = useState(false)

    const onDrop = () => {
        setOpenDropModal(false)
        updateParent()
    }

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
        <>
        <DropClassModal open={openDropModal} onClose={() => setOpenDropModal(false)} classInfo={classInfo}
        onDrop={onDrop}/>
        <div className="container-fluid d-flex flex-column class-schedule-item-background">
            <div className="row mt-2">
                <div className="col-2 align-self-center">
                    <div className="d-flex flex-column">
                        <div className="ms-4">
                            <p className="mb-1"><b>{beautifyDate(classInfo.date)}</b></p>
                            <p>{classInfo.startTime} &#9679; {classInfo.endTime}</p>
                        </div>
                    </div>
                </div>
                <div className="col-1">
                </div>
                <div className="col-4 align-self-center">
                    <div className="d-flex flex-column">
                        <div className="align-self-center w-100">
                            <p className="mb-0"><b>{classInfo.cls.name}</b></p>
                            <p>{keywords.map((keyword, index) => (
                                <span key={index}>{keyword.word} &#9679; </span>
                            ))}</p>
                        </div>
                    </div>
                </div>
                <div className="col-3 align-self-center">
                    <div className="d-flex flex-column">

                        <p className="csi-coach-container"><span className="class-schedule-item-coach-name">{classInfo.coach}</span></p>
                        <p className="csi-studio-name-container">
                            <LocationOnIcon className="class-schedule-item-pin"/>
                            <span className="class-schedule-item-studio-name">{classInfo.studioName}</span>
                        </p>
                        {classInfo.cancelled ? (
                            <p className="class-schedule-item-cancelled">Cancelled</p>
                        ) : null}
                    </div>
                </div>
                <div className="col-2 align-self-center">
                    <div className="d-flex flex-column">
                        <div className="align-self-center">
                            <button className="btn btn-orange-fade" onClick={() => {setOpenDropModal(true)}}>Drop</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )

}

export default MyClassScheduleItem;