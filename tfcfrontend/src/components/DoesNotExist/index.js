import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'

const DoesNotExist = () => {

    return (
        <div className="d-flex flex-column align-items-center">
            <div className="row">
                <h1 className="display-4">We're sorry.</h1>
            </div>
            <div className="row">
                <p>The page you are trying to access does not exist.</p>
            </div>
        </div>
    )

}

export default DoesNotExist;