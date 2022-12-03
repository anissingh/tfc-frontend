import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import {useContext, useState} from "react";
import {BASE_PORT, BASE_URL} from "../../settings/settings";
import {LoginContext, NO_ACCESS_TOKEN} from "../../clientinfo/clientinfo";
import {capitalizeFirstLetter} from "../../utils/utils";
import {useNavigate} from "react-router-dom";


const EditProfileForm = () => {

    const loginInfo = useContext(LoginContext)
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        password2: '',
        avatar: null
    })

    const [emailNotification, setEmailNotification] = useState('')
    const [phoneNotification, setPhoneNotification] = useState('')
    const [password2Notification, setPassword2Notification] = useState('')
    const [updateNotification, setUpdateNotification] = useState({
        content: '',
        cls: 'notification'
    })

    const update = (field, value) => {
        setFormData({...formData, [field]: value})
    }

    const updateImage = (event) => {
        setFormData({...formData, avatar: event.target.files[0]})
        // let reader = new FileReader()
        // reader.readAsDataURL(event.target.files[0])
        //
        //
        // reader.onload = () => {
        //     setFormData({...formData, avatar: reader.result})
        //     console.log(reader.result)
        // }
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
        setPassword2Notification('')
        setUpdateNotification({
            content: '',
            cls: 'notification'
        })
        // TODO: Why is the above not setting?
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        resetNotifications()

        let clientError = false
        let data = new FormData()

        // Add non-empty fields to payload
        if(formData.firstName !== '') {
            data.append('first_name', formData.firstName)
        }
        if(formData.lastName !== '') {
            data.append('last_name', formData.lastName)
        }
        if(formData.email !== '') {
            data.append('email', formData.email)
        }
        if(formData.phone !== '') {
            data.append('phone', parsePhoneNumber(formData.phone))
        }
        if(formData.password !== '') {
            data.append('password', formData.password)
        }
        if(formData.avatar !== null && typeof formData.avatar !== 'undefined') {
            data.append('avatar', formData.avatar)
        }

        if(formData.password !== '' && !validatePasswordEquality(formData.password, formData.password2)) {
            clientError = true
            setPassword2Notification('Passwords do not match.')
        }

        if(formData.phone !== '' && !validatePhoneNumber(parsePhoneNumber(formData.phone))) {
            clientError = true
            setPhoneNotification('Invalid phone number.')
        }

        if(clientError) {
            setUpdateNotification({cls: 'notification', content: 'Please correct the errors above before preceding.'})
            return
        }

        fetch(`http://${BASE_URL}:${BASE_PORT}/accounts/edit/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${loginInfo.accessToken}`
            },
            body: data
        })
        .then(res => {
            if(res.status === 401) {
                loginInfo.setAccessToken(NO_ACCESS_TOKEN)
                throw new Error('Your session has expired. Please log in again.')
                // TODO: Display popup that allows user to click login
            } else if(res.status === 400) {
                return res.json().then(res => {
                    if('email' in res) {
                        setEmailNotification(capitalizeFirstLetter(res.email[0]))
                    }
                    if('phone' in res) {
                        setPhoneNotification(capitalizeFirstLetter(res.phone[0]))
                    }
                    throw new Error('Please correct the errors above before preceding.')
                })
            } else if(res.status !== 200) {
                throw new Error('Unexpected error.')
            } else {
                return res.json()
            }
        })
        .then(res => {
            setUpdateNotification({
                content: 'Successfully updated your profile.',
                cls: 'success-notification'
            })
            console.log(res)
        })
        .catch((error) => {
            setUpdateNotification({...updateNotification, content: error.message, cls: 'notification'})
        })
    }

    return (
        <div className="container-fluid p-0">
            <form action="/" onSubmit={event => handleSubmit(event)}>
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
                <div className="row mb-2">
                    <div className="form-group">
                        <label htmlFor="formFile" className="form-label">Profile Picture</label>
                        <input className="form-control" type="file" id="formFile"
                               onChange={event => updateImage(event)}/>
                    </div>
                </div>
                <div className="row">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" className="form-control" id="email" placeholder="e.g. john@gmail.com"
                               onChange={event => update('email', event.target.value)}></input>
                    </div>
                    <p className="notification">{emailNotification}</p>
                </div>
                <div className="row">
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input type="text" className="form-control" id="phoneNumber" placeholder="e.g. 289-443-6117"
                               onChange={event => update('phone', event.target.value)}></input>
                    </div>
                    <p className="notification">{phoneNotification}</p>
                </div>
                <div className="row">
                    <div className="form-group col-md-6">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" id="password" placeholder="Your password"
                               onChange={event => update('password', event.target.value)}></input>
                        <p></p>
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="password2">Re-type Password</label>
                        <input type="password" className="form-control" id="password2" placeholder="Your password"
                               onChange={event => update('password2', event.target.value)}></input>
                        <p className="notification">{password2Notification}</p>
                    </div>
                </div>
                <p className={updateNotification.cls}>{updateNotification.content}</p>
                <button type="submit" className="btn save-btn mt-1">Save</button>
            </form>
        </div>
    )
}

export default EditProfileForm;