import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import '../Common/buttons.css';
import {BASE_URL, BASE_PORT} from "../../settings/settings";
import {useState} from "react";
import '../Common/alerts.css'
import {capitalizeFirstLetter} from "../../utils/utils";


const RegisterForm = () => {

    // TODO: Add success notification to register and redirect (after timeout?)

    const [formData, setFormData] = useState({
        'firstName': '',
        'lastName': '',
        'email': '',
        'phone': '',
        'password': '',
        'password2': '',
    })

    const [emailNotification, setEmailNotification] = useState('')
    const [passwordNotification, setPasswordNotification] = useState('')
    const [password2Notification, setPassword2Notification] = useState('')
    const [phoneNotification, setPhoneNotification] = useState('')
    const [registerNotification, setRegisterNotification] = useState('')


    const update = (field, value) => {
        setFormData({...formData, [field]: value})
    }

    const validatePasswordEquality = (password1, password2) => {
        return password1 === password2
    }

    const parsePhoneNumber = (phoneNumber) => {
        return phoneNumber.replaceAll('-', '')
    }

    const validatePhoneNumber = (parsedPhoneNumber) => {
        return parsedPhoneNumber.length === 10
    }

    const resetNotifications = () => {
        setEmailNotification('')
        setPhoneNotification('')
        setPasswordNotification('')
        setPassword2Notification('')
        setRegisterNotification('')
    }

    const handleSubmit = (event) => {

        event.preventDefault()

        resetNotifications()

        let clientSideEvalError = false

        if(!validatePasswordEquality(formData.password, formData.password2)) {
            setPassword2Notification('Passwords do not match.')
            clientSideEvalError = true
        }

        if (!validatePhoneNumber(parsePhoneNumber(formData.phone))) {
            setPhoneNotification('Invalid phone number.')
            clientSideEvalError = true
        }

        if(clientSideEvalError) {
            setRegisterNotification('Please correct the errors above before preceding.')
            return
        }

        fetch(`http://${BASE_URL}:${BASE_PORT}/accounts/register/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone: parsePhoneNumber(formData.phone),
                password: formData.password
            })
        })
        .then(res => {
            if(res.status === 400) {
                return res.json().then(res => {

                    if('email' in res) {
                        setEmailNotification(capitalizeFirstLetter(res.email[0]))
                    }
                    if('phone' in res) {
                        setPhoneNotification(capitalizeFirstLetter(res.phone[0]))
                    }
                    if('password' in res) {
                        setPasswordNotification(res.password[0])
                    }

                    throw new Error('Please correct the errors above before preceding.')
                })
            } else if(res.status !== 200 && res.status !== 201) {
                throw new Error('Unexpected error.')
            } else {
                return res.json()
            }
        })
        .then(res => {
            console.log(res)
        })
        .catch((error) => {
            setRegisterNotification(error.message)
        })
    }

    return (
        <div className="container">
            <h1 className="display-5 bold-text">Register</h1>
            <form action='/' onSubmit={(e) => handleSubmit(e)}>
                <div className="row">
                    <div className="form-group col-md-6">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" className="form-control" id="firstName" placeholder="e.g. John"
                        onChange={event => update('firstName', event.target.value)}></input>
                        <p></p>
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" className="form-control" id="lastName" placeholder="e.g. Smith"
                               onChange={event => update('lastName', event.target.value)}></input>
                        <p></p>
                    </div>
                </div>
                <div className="row">
                    <div className="form-group required">
                        <label htmlFor="email">Email</label>
                        <input type="email" className="form-control" id="email" placeholder="e.g. john@gmail.com"
                               onChange={event => update('email', event.target.value)}></input>
                        <p className="notification">{emailNotification}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="form-group required">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input type="text" className="form-control" id="phoneNumber" placeholder="e.g. 289-443-6117"
                               onChange={event => update('phone', event.target.value)}></input>
                        <p className="notification">{phoneNotification}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="form-group required col-md-6">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" id="password" placeholder="Your password"
                               onChange={event => update('password', event.target.value)}></input>
                        <p className="notification">{passwordNotification}</p>
                    </div>
                    <div className="form-group required col-md-6">
                        <label htmlFor="password2">Re-type Password</label>
                        <input type="password" className="form-control" id="password2" placeholder="Your password"
                               onChange={event => update('password2', event.target.value)}></input>
                        <p className="notification">{password2Notification}</p>
                    </div>
                </div>
                <p className="notification">{registerNotification}</p>
                <button type="submit" className="btn btn-orange-fade mt-1">Register</button>
            </form>
        </div>
    )
}

export default RegisterForm;