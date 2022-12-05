import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'
import {useEffect, useState} from "react";
import {BASE_PORT, BASE_URL} from "../../settings/settings";
import DoesNotExist from "../DoesNotExist";
import ImageSlider from "../ImageSlider";
import Navbar from "../Navbar/Navbar";
import '../Common/buttons.css';
import ClassScheduleItem from "../ClassScheduleItem";
import FilterStudioClassSchedule from "./FilterStudioClassSchedule";
import '../Common/alerts.css';

const StudioDashboard = ({studioId}) => {

    const [studioFound, setStudioFound] = useState(false)
    const [studioInfo, setStudioInfo] = useState({
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        postalCode: '',
        phone: ''
    })
    const [studioImages, setStudioImages] = useState([])
    const [studioAmenities, setStudioAmenities] = useState([])
    const [classes, setClasses] = useState([])
    const [searchInfo, setSearchInfo] = useState({
        page: 1,
        next: null,
        prev: null,
        count: 0,
        forceUpdate: false,
        classNames: [],
        coachNames: [],
        dates: [],
        startTime: '',
        endTime: ''
    })

    const [getDirectionsNotification, setGetDirectionsNotification] = useState('')

    const beautifyPhoneNumber = (pNum) => {
        return '(' + pNum.slice(0, 3) + ') ' + pNum.slice(3, 6) + '-' + pNum.slice(6)
    }

    const beautifyPostalCode = (pCode) => {
        return pCode.slice(0, 3) + ' ' + pCode.slice(3)
    }

    const handleNext = () => {
        // Only allow this to happen if next page exists
        if(searchInfo.next === null) return

        setSearchInfo({...searchInfo, page: searchInfo.page + 1})
    }

    const handlePrev = () => {
        // Only allow this to happen if previous page exists
        if(searchInfo.prev === null) return

        setSearchInfo({...searchInfo, page: searchInfo.page - 1})
    }

    const forceUpdateClassInfo = () => {
        setSearchInfo({...searchInfo,
            forceUpdate: !searchInfo.forceUpdate
        })
    }

    const generateDirectionsLink = () => {
        if (!("geolocation" in navigator)) {
            setGetDirectionsNotification('Location permissions disabled.')
            return
        }

        navigator.geolocation.getCurrentPosition(position => {
            window.open(`https://www.google.com/maps/dir/?api=1&origin=${position.coords.latitude},${position.coords.longitude}&destination=${studioInfo.latitude},${studioInfo.longitude}`, '_blank')
        })
        setGetDirectionsNotification('')
    }

    const onFilter = (classFilters, coachFilters, dateFilters, startTime, endTime) => {
        setSearchInfo({
            ...searchInfo,
            classNames: classFilters,
            coachNames: coachFilters,
            dates: dateFilters,
            startTime: startTime,
            endTime: endTime,
            page: 1,
            next: null,
            prev: null,
            forceUpdate: !searchInfo.forceUpdate
        })
    }

    useEffect(() => {
        fetch(`http://${BASE_URL}:${BASE_PORT}/studios/${studioId}/info/`)
            .then(res => {
                if(res.status === 404) {
                    setStudioFound(false)
                    throw new Error('Page not found.')
                } else if(res.status !== 200) {
                    setStudioFound(false)
                    throw new Error('Unknown error occurred.')
                } else {
                    return res.json()
                }
            })
            .then(res => {
                setStudioFound(true)
                setStudioInfo({
                    name: res.studio_info.name,
                    address: res.studio_info.address,
                    latitude: res.studio_info.latitude,
                    longitude: res.studio_info.longitude,
                    postalCode: beautifyPostalCode(res.studio_info.postal_code),
                    phone: beautifyPhoneNumber(res.studio_info.phone)
                })
                setStudioImages(res.studio_images.map((obj) => (
                    `http://${BASE_URL}:${BASE_PORT}${obj.image}`
                )))
                setStudioAmenities(res.studio_amenities)
            })
            .catch((error) => {
                console.log(error.message)
            })

    }, [studioId])
    
    useEffect(() => {
        let searchParams = new URLSearchParams()

        for(const filter of searchInfo.classNames) {
            searchParams.append('class-name', filter)
        }
        for(const filter of searchInfo.coachNames) {
            searchParams.append('coach', filter)
        }
        for(const filter of searchInfo.dates) {
            searchParams.append('date', filter)
        }
        if(searchInfo.startTime !== '') {
            searchParams.append('start-time', searchInfo.startTime )
        }
        if(searchInfo.endTime  !== '') {
            searchParams.append('end-time', searchInfo.endTime )
        }
        searchParams.append('page', `${searchInfo.page}`)

        fetch(`http://${BASE_URL}:${BASE_PORT}/studios/${studioId}/classes/search/?` + searchParams)
            .then(res => {
                if(res.status !== 200) {
                    // TODO: Handle properly
                    throw new Error('Unexpected error occurred.')
                } else {
                    return res.json()
                }
            })
            .then(res => {
                setSearchInfo(searchInfo => ({
                    ...searchInfo,
                    next: res.next,
                    prev: res.previous,
                    count: res.count
                }))
                console.log(res.results)
                setClasses(res.results)
            })
            .catch((error) => {
                console.log(error.message)
            })
    }, [searchInfo.classNames, searchInfo.coachNames, searchInfo.dates, searchInfo.endTime, searchInfo.page, searchInfo.startTime, studioId, searchInfo.forceUpdate])

    if(!studioFound) return <DoesNotExist />

    return (
        <div className="container-fluid p-0">
            <Navbar />
            <div className="st-dash-page-container">
                <h1 className="h2 mt-2 mb-5 align-self-center">{studioInfo.name}</h1>
                <div className="st-dash-general-container">
                    <div className="st-dash-club-info-col">
                        <div className="st-dash-club-info-container">
                            <div className="st-dash-club-info-wrapper">
                                <h1 className="h3">Club Information</h1>
                                <p className="mb-0"><span className="studio-info-title">Address: </span>{studioInfo.address}</p>
                                <p className="mb-0"><span className="studio-info-title">Postal code: </span>{studioInfo.postalCode}</p>
                                <p className="mb-1"><span className="studio-info-title">Phone number: </span>{studioInfo.phone}</p>
                                <button className="btn btn-grey-border-text me-1" onClick={generateDirectionsLink}>Get Directions</button>
                                <button className="btn btn-orange-border ms-1" onClick={() => window.location.replace(`/studios/${studioId}/view/#schedule`)}>View Class Schedule</button>
                                <p className="notification">{getDirectionsNotification}</p>
                            </div>
                        </div>
                    </div>
                    <div className="st-dash-club-amenities-col">
                        <div className="st-dash-club-amenities-container">
                            <div className="st-dash-club-amenities-wrapper">
                                <h1 className="h3">Club Amenities</h1>
                                {studioAmenities.length > 0 ? (
                                    <ul className="studio-amenities-list">
                                        {studioAmenities.map((obj, index) => (
                                            <li key={index}><p className="studio-info-title">{obj.type}: </p> {obj.quantity}</li>
                                        ))}
                                    </ul>
                                    ) : (
                                        <p className="text-center">This studio currently has no amenities.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {studioImages.length > 0 ? (
                    <div className="image-slider-container">
                        <ImageSlider slides={studioImages}/>
                    </div>
                ) : <p className="text-center">Images of this studio are currently unavailable.</p>}
                <h1 id="schedule" className="h3 mt-5 mb-5 align-self-center">Class Schedule</h1>
                <div className="st-dash-club-class-schedule-container">
                    <div className="st-dash-filter-container">
                        <FilterStudioClassSchedule onFilter={onFilter}/>
                    </div>
                    <div className="st-dash-classes-container">
                        {searchInfo.count > 0 ? (
                            <>
                            <ul className="list-unstyled">
                                {classes.map((clsInstance, index) => (
                                    <li className="class-schedule-item-li" key={index}>
                                        <ClassScheduleItem classInfo={{
                                            id: clsInstance.id,
                                            cls: {
                                                id: clsInstance.cls.id,
                                                name: clsInstance.cls.name
                                            },
                                            studioName: clsInstance.cls.studio.name,
                                            date: clsInstance.date,
                                            startTime: clsInstance.start_time,
                                            endTime: clsInstance.end_time,
                                            enrolled: clsInstance.enrolled,
                                            capacity: clsInstance.capacity,
                                            coach: clsInstance.coach,
                                        }} update={forceUpdateClassInfo}/>
                                    </li>
                                ))}
                            </ul>
                            <div className="align-self-center">
                                <button className={"btn btn-change-page" + (searchInfo.prev === null ? ' disabled' : '')} onClick={handlePrev}>Previous</button>
                                <button className={"btn btn-change-page" + (searchInfo.next === null ? ' disabled' : '')} onClick={handleNext}>Next</button>
                            </div>
                            </>
                        ) : (
                                <p className="text-center">No classes to display.</p>
                            )}
                    </div>
                </div>
            </div>
        </div>

    )

}

export default StudioDashboard;