import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import {useContext, useState} from "react";
import {BASE_PORT, BASE_URL} from "../../settings/settings";
import {LoginContext} from "../../clientinfo/clientinfo";
import '../Common/alerts.css'
import {useNavigate} from "react-router-dom";

const LoginForm = () => {

    const loginInfo = useContext(LoginContext)
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        'email': '',
        'password': '',
    })

    const [loginNotification, setLoginNotification] = useState('')

    const update = (field, value) => {
        setFormData({...formData, [field]: value})
    }

    // TODO: Redirect upon successful login

    const handleSubmit = (event) => {
        event.preventDefault()

        fetch(`http://${BASE_URL}:${BASE_PORT}/accounts/api/token/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: formData.email,
                password: formData.password
            })
        })
        .then(res => {
            if(res.status === 401) {
                return res.json().then(res => {
                    console.log(res)
                    throw new Error(res['detail'])
                })
            } else if(res.status !== 200) {
                throw new Error('Unexpected error.')
            } else {
                return res.json()
            }
        })
        .then(res => {
            const token = res['access']
            const email = formData.email
            loginInfo.setAccessToken(token)
            loginInfo.setEmail(email)
            navigate('/')
        })
        .catch((error) => {
            setLoginNotification(`${error.message}.`)
        })
    }

    // TODO: Multiple elements with same id (in here and RegisterForm)
    return (
        <div className="container">
            <h1 className="display-5 bold-text">Login</h1>
            <form action="/" onSubmit={event => handleSubmit(event)}>
                <div className="row">
                    <div className="form-group required">
                        <label htmlFor="email">Email</label>
                        <input type="text" className="form-control" id="email" placeholder="e.g. john@gmail.com"
                               onChange={event => update('email', event.target.value)}></input>
                    </div>
                </div>
                <div className="row">
                    <div className="form-group required">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" id="password" placeholder="Your Password"
                               onChange={event => update('password', event.target.value)}></input>
                    </div>
                </div>
                <p className="notification" id="login-notification">{loginNotification}</p>
                <button type="submit" className="btn login-btn mt-1">Login</button>
            </form>
        </div>
    )

}

export default LoginForm;