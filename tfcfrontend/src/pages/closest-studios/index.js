import ClosestStudioDashboard from "../../components/ClosestStudioDashboard";
import {useEffect, useState} from "react";

const ClosestStudios = () => {

    const [currLoc, setCurrLoc] = useState({
        lat: 43.6532,
        lng: -79.3470
    })

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                setCurrLoc({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
            })
        }
    }, [])

    return (
        <ClosestStudioDashboard startLoc={currLoc}/>
    )
}

export default ClosestStudios;