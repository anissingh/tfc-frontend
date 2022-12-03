import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'
import {useContext, useEffect, useState} from "react";
import {BASE_PORT, BASE_URL} from "../../settings/settings";
import {LoginContext} from "../../clientinfo/clientinfo";
import DoesNotExist from "../DoesNotExist";
import ImageSlider from "../ImageSlider";
import Navbar from "../Navbar/Navbar";
import '../Common/buttons.css';
import ClassScheduleItem from "../ClassScheduleItem";
import FilterStudioClassSchedule from "./FilterStudioClassSchedule";
import '../Common/alerts.css';

const StudioDashboard = ({studioId}) => {

    // TODO: when force update is called, set page number to 1
    // TODO: Not setting count = 0 on filter to prevent flicker -- make sure this is ok
    // TODO: Set to current location on initial load (through props?)

    const loginInfo = useContext(LoginContext)
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
    const [pageInfo, setPageInfo] = useState({
        page: 1,
        next: null,
        prev: null,
        count: 0
    })
    const [forceUpdate, setForceUpdate] = useState(false)

    const [filterParams, setFilterParams] = useState({
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
        if(pageInfo.next === null) return

        setPageInfo({...pageInfo, page: pageInfo.page + 1})
    }

    const handlePrev = () => {
        // Only allow this to happen if previous page exists
        if(pageInfo.prev === null) return

        setPageInfo({...pageInfo, page: pageInfo.page - 1})
    }

    const forceUpdateClassInfo = () => {
        setForceUpdate(!forceUpdate)
    }

    const generateDirectionsLink = () => {
        // TODO: Detect when user blocks notifications if already allowed
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
        setFilterParams({
            classNames: classFilters,
            coachNames: coachFilters,
            dates: dateFilters,
            startTime: startTime,
            endTime: endTime
        })

        setPageInfo({
            ...pageInfo,
            page: 1,
            next: null,
            prev: null
        })
    }

    useEffect(() => {
        fetch(`http://${BASE_URL}:${BASE_PORT}/studios/${studioId}/info/`)
            .then(res => {
                if(res.status === 404) {
                    setStudioFound(false)
                    throw new Error('Page not found.')
                } else if(res.status !== 200) {
                    // TODO: Display error page instead
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

    }, [loginInfo.accessToken, studioId])
    
    useEffect(() => {
        let searchParams = new URLSearchParams()

        for(const filter of filterParams.classNames) {
            searchParams.append('class-name', filter)
        }
        for(const filter of filterParams.coachNames) {
            searchParams.append('coach', filter)
        }
        for(const filter of filterParams.dates) {
            searchParams.append('date', filter)
        }
        if(filterParams.startTime !== '') {
            searchParams.append('start-time', filterParams.startTime )
        }
        if(filterParams.endTime  !== '') {
            searchParams.append('end-time', filterParams.endTime )
        }
        searchParams.append('page', `${pageInfo.page}`)

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
                setPageInfo({
                    ...pageInfo,
                    next: res.next,
                    prev: res.previous,
                    count: res.count
                })
                console.log(res.results)
                setClasses(res.results)
            })
            .catch((error) => {
                console.log(error.message)
            })
    }, [filterParams, pageInfo.page, studioId, forceUpdate])

    // useEffect(() => {
    //     setFilterParams({
    //         classNames: [],
    //         coachNames: [],
    //         dates: [],
    //         startTime: '',
    //         endTime: ''
    //     })
    // }, [])

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
                                <button className="btn btn-orange-border ms-1">View Class Schedule</button>
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
                <h1 className="h3 mt-5 mb-5 align-self-center">Class Schedule</h1>
                <div className="st-dash-club-class-schedule-container">
                    <div className="st-dash-filter-container">
                        <FilterStudioClassSchedule onFilter={onFilter}/>
                    </div>
                    <div className="st-dash-classes-container">
                        {pageInfo.count > 0 ? (
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
                                <button className={"btn btn-change-page" + (pageInfo.prev === null ? ' disabled' : '')} onClick={handlePrev}>Previous</button>
                                <button className={"btn btn-change-page" + (pageInfo.next === null ? ' disabled' : '')} onClick={handleNext}>Next</button>
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