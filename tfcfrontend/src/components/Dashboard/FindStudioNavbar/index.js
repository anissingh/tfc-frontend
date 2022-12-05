import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {useEffect, useState} from "react";
import Geocode from "react-geocode"
import {Link} from "react-router-dom";

const FindStudioNavbar = () => {

    const [locName, setLocName] = useState('Unknown')

    const API_KEY = '*'
    Geocode.setApiKey(API_KEY)
    Geocode.setLanguage('en')
    Geocode.setLocationType('ROOFTOP')


    useEffect(() => {
        if(!('geolocation' in navigator)) return

        navigator.geolocation.getCurrentPosition(position => {
            Geocode.fromLatLng(`${position.coords.latitude}`, `${position.coords.longitude}`).then(
                (response) => {
                    let city = '';
                    for (let i = 0; i < response.results[0].address_components.length; i++) {
                        for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
                            // eslint-disable-next-line default-case
                            switch (response.results[0].address_components[i].types[j]) {
                                case "locality":
                                    city = response.results[0].address_components[i].long_name;
                                    break;
                            }
                        }
                    }
                    if(city !== '') setLocName(city)
                },
                (error) => {
                    console.error(error);
                }
            )
        })
    }, [])

    return (
        <div className="location-navbar">
            <span>
                <LocationOnIcon className="location-pin"/>
                <span className="loc-nav-city-label">{locName}</span>
                <Link className="loc-nav-fas-link" to="/studios/closest">Find a Studio</Link>
            </span>
            <span>
                <Link className="loc-nav-register-link" to="/register">Register Now</Link>
            </span>
        </div>
    )


}

export default FindStudioNavbar;
