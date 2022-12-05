import Navbar from "../Navbar/Navbar";
import '../Common/fonts.css'
import '../Common/buttons.css'
import '../Common/sizes.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {GoogleMap, useJsApiLoader, MarkerF} from "@react-google-maps/api";
import {useEffect, useState} from "react";
import {BASE_URL, BASE_PORT} from "../../settings/settings";
import StudioListItem from "../StudioListItem";
import './style.css'
import FilterStudioModal from "./FilterStudioModal";
import Geocode from "react-geocode"
import NearMeIcon from '@mui/icons-material/NearMe';


const ClosestStudioDashboard = ({startLoc}) => {

    const API_KEY = 'AIzaSyAVIpBPUVZn01E_eztRpuBqa5sRt3ukL5k'
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: API_KEY
    })

    Geocode.setApiKey('AIzaSyAVIpBPUVZn01E_eztRpuBqa5sRt3ukL5k')
    Geocode.setLanguage('en')
    Geocode.setLocationType('ROOFTOP')

    const [map, setMap] = useState(/** @type google.maps.Map */null)
    const [markers, setMarkers] = useState([])

    const [openFilterModal, setOpenFilterModal] = useState(false)
    const [searchBarText, setSearchBarText] = useState('')
    const [searchError, setSearchError] = useState('')

    const [searchInfo, setSearchInfo] = useState({
        page: 1,
        next: null,
        prev: null,
        forceUpdate: false,
        lat: startLoc.lat,
        lng: startLoc.lng,
        studioNames: [],
        studioAmenities: [],
        classNames: [],
        coachNames: []
    })

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

    const onFilter = (studioFilters, amenityFilters, classFilters, coachFilters) => {
        setOpenFilterModal(false)


        setSearchInfo({
            ...searchInfo,
            studioNames: studioFilters,
            studioAmenities: amenityFilters,
            classNames: classFilters,
            coachNames: coachFilters,
            page: 1,
            prev: null,
            next: null,
            forceUpdate: !searchInfo.forceUpdate
        })
    }

    const onSearchFromLoc = (event) => {
        event.preventDefault()
        console.log(searchBarText)

        Geocode.fromAddress(searchBarText).then(
            (response) => {
                const { lat, lng } = response.results[0].geometry.location;
                setSearchInfo({
                    ...searchInfo,
                    lat: lat,
                    lng: lng,
                    page: 1,
                    prev: null,
                    next: null,
                    forceUpdate: !searchInfo.forceUpdate
                })
                console.log(lat, lng);

            },
            (error) => {
                setSearchError('Invalid location.')
                console.error(error);
            }
        );
    }

    const onSearchFromClick = (ev) => {
        setSearchInfo({
            ...searchInfo,
            lat: ev.latLng.lat(),
            lng: ev.latLng.lng(),
            page: 1,
            prev: null,
            next: null,
            forceUpdate: !searchInfo.forceUpdate
        })
    }

    const onLocationReset = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                console.log(position.coords.latitude, position.coords.longitude)
                setSearchInfo({
                    ...searchInfo,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    page: 1
                })
            })
        }
    }

    const getDirectionsLink = (dLat, dLong) => {
        window.open(`https://www.google.com/maps/dir/?api=1&origin=${searchInfo.lat},${searchInfo.lng}&destination=${dLat},${dLong}`, '_blank')
    }

    const loadMap = (map) => {
        setMap(map)
    }

    const panToStudioLoc = (lat, lng) => {
        map.panTo({lat: parseFloat(lat), lng: parseFloat(lng)})
    }

    useEffect(() => {
        setSearchInfo(searchInfo => ({
            ...searchInfo,
            lat: startLoc.lat,
            lng: startLoc.lng,
            page: 1
        }))
    }, [startLoc])

    useEffect(() => {
        let searchParams = new URLSearchParams()

        for(const filter of searchInfo.studioNames) {
            searchParams.append('name', filter)
        }
        for(const filter of searchInfo.studioAmenities) {
            searchParams.append('amenity', filter)
        }
        for(const filter of searchInfo.classNames) {
            searchParams.append('class-name', filter)
        }
        for(const filter of searchInfo.coachNames) {
            searchParams.append('coach', filter)
        }

        searchParams.append('page', `${searchInfo.page}`)
        searchParams.append('lat', `${searchInfo.lat}`)
        searchParams.append('long', `${searchInfo.lng}`)

        setSearchError('')

        fetch(`http://${BASE_URL}:${BASE_PORT}/studios/search/?` + searchParams)
        .then(res => {
            if(res.status !== 200) {
                throw new Error('Unexpected Error.')
            } else {
                return res.json()
            }
        })
        .then(res => {
            setSearchInfo(searchInfo => ({
                ...searchInfo,
                prev: res.previous,
                next: res.next
            }))
            console.log(res.results)
            console.log(searchInfo.lat)
            console.log(searchInfo.lng)
            setMarkers(res.results)
        })
        .catch((error) => {
            console.log(error)
        })
        // map.panTo(loc)
    }, [searchInfo.lat, searchInfo.lng, searchInfo.page, searchInfo.forceUpdate, searchInfo.classNames,
    searchInfo.coachNames, searchInfo.studioNames, searchInfo.studioAmenities])

    if(!isLoaded) {
        return <h1>Loading</h1>
    }

    return (
        <>
        <div className="container-fluid p-0">
            <FilterStudioModal open={openFilterModal} onClose={() => {setOpenFilterModal(false)}} onFilter={onFilter}/>
            <Navbar></Navbar>
            <div className="container-fluid">
                <div className="row mb-5 mt-4">
                    <h1 className="display-4 semi-bold underline-style text-center">Find a Club</h1>
                </div>

                <div className="cs-top-bar">
                    <button className="studio-location-reset-btn me-3" onClick={onLocationReset}><NearMeIcon /></button>
                    <div className="studio-search-and-filter-container">
                        <div className="s-wrapper-div">
                        <div className="studio-search-form-filter-container">
                            <form className="form-inline studio-search-form" onSubmit={(event) => {onSearchFromLoc(event)}}>
                                <input className="form-control mr-sm-2 rounded-0 studio-search-bar" type="search" placeholder="Search by address, postal code, etc." aria-label="Search"
                                       onChange={(event) => {setSearchBarText(event.target.value)}}/>
                                <button className="btn btn-orange my-2 my-sm-0 pl-5 pr-5 text-uppercase" type="submit">Search</button>
                            </form>
                            <button className="btn btn-grey-border-text text-uppercase studio-filters-btn"
                                    onClick={() => {setOpenFilterModal(true)}}>Filters</button>
                        </div>
                        <p className="mb-0 studio-search-error">{searchError}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div className="studios-container">
            <div className="studio-list-col d-flex flex-column">
                <div className="align-self-center">
                    <ul className="list-unstyled studio-list">
                        {markers.map((studio) => (
                            <li className="studio-li" key={`st-item-${studio.id}`}>
                                <StudioListItem studioInfo={{
                                    id: studio.id,
                                    name: studio.name,
                                    address: studio.address,
                                    latitude: studio.latitude,
                                    longitude: studio.longitude,
                                    postal_code: studio.postal_code,
                                    phone: studio.phone
                                }}
                                key={`st-item-${studio.id}-1`}
                                onGetDirections={getDirectionsLink}
                                onPanTo={() => {panToStudioLoc(studio.latitude, studio.longitude)}}
                                />
                            </li>
                        ))}
                    </ul>
                    <button className={"btn btn-change-page" + (searchInfo.prev === null ? ' disabled' : '')} onClick={handlePrev}>Previous</button>
                    <button className={"btn btn-change-page" + (searchInfo.next === null ? ' disabled' : '')} onClick={handleNext}>Next</button>
                </div>
            </div>
            <div className="studio-map-container studio-map-col">
                <GoogleMap
                    center={{lat: searchInfo.lat, lng: searchInfo.lng}}
                    zoom={13}
                    mapContainerStyle={{width: '99%', height: '100%'}}
                    options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                        styles: [
                            {
                                featureType: "poi",
                                stylers: [
                                    { visibility: "off" }
                                ]
                            },
                            {
                                featureType: "transit",
                                stylers: [
                                    { visibility: "off" }
                                ]
                            },
                            {
                                featureType: "water",
                                stylers: [
                                    { visibility: "simple" },
                                    { color: "#adddec" }
                                ]
                            },
                            {
                                featureType: 'landscape',
                                stylers: [
                                    { visibility: "simple" },
                                    { color: "#f0f0f1" }
                                ]
                            },
                            {
                                featureType: "road.highway",
                                stylers: [
                                    { visibility: "simple" },
                                    { color: "#e2e2e2" }
                                ]
                            },
                            {
                                featureType: "road.local",
                                stylers: [
                                    { visibility: "simple" },
                                    { color: "#ffffff" }
                                ]
                            }
                        ]
                    }}
                    onLoad={(map => loadMap(map))}
                    onClick={(ev) => {onSearchFromClick(ev)}}
                >
                    {markers.map((studio) => (
                        <MarkerF
                            position={{lat: parseFloat(studio.latitude), lng: parseFloat(studio.longitude)}}
                            key={studio.id}
                        />
                    ))}
                </GoogleMap>
            </div>
        </div>
        </>
    )

}

export default ClosestStudioDashboard;