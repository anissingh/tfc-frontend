import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'

const FilterItem = ({text, onDelete}) => {

    return (
        <button className="btn filter-btn m-1" onClick={onDelete}>{text}</button>
    )

}

export default FilterItem;