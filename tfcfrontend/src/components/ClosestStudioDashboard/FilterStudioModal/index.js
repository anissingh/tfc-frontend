import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import '../../Common/modal.css'
import '../../Common/buttons.css'
import FilterItem from "../../FilterItem";
import {useState} from "react";

const FilterStudioModal = ({open, onClose, onFilter}) => {

    const [studioNameFilters, setStudioNameFilters] = useState([])
    const [studioAmenityFilters, setStudioAmenityFilters] = useState([])
    const [classNameFilters, setClassNameFilters] = useState([])
    const [coachNameFilters, setCoachNameFilters] = useState([])

    const indexOf = (arr, q) => arr.findIndex(item => q.toLowerCase() === item.toLowerCase());

    const onFilterItemDelete = (text, filterType) => {
        if(filterType === 'studio') {
            setStudioNameFilters(studioNameFilters.filter(filter => filter !== text))
        } else if(filterType === 'amenity') {
            setStudioAmenityFilters(studioAmenityFilters.filter(filter => filter !== text))
        } else if(filterType === 'class') {
            setClassNameFilters(classNameFilters.filter(filter => filter !== text))
        } else if(filterType === 'coach') {
            setCoachNameFilters(coachNameFilters.filter(filter => filter !== text))
        }
    }

    const handleKeyDown = (event, filterType) => {
        if(event.key !== 'Enter') return

        const text = event.target.value

        if(filterType === 'studio' && indexOf(studioNameFilters, text) === -1) {
            setStudioNameFilters(studioNameFilters => [...studioNameFilters, text])
            event.target.value = ''
        } else if(filterType === 'amenity' && indexOf(studioAmenityFilters, text) === -1) {
            setStudioAmenityFilters(studioAmenityFilters => [...studioAmenityFilters, text])
            event.target.value = ''
        } else if(filterType === 'class' && indexOf(classNameFilters, text) === -1) {
            setClassNameFilters(classNameFilters => [...classNameFilters, text])
            event.target.value = ''
        } else if(filterType === 'coach' && indexOf(coachNameFilters, text) === -1) {
            setCoachNameFilters(coachNameFilters => [...coachNameFilters, text])
            event.target.value = ''
        }

    }

    if(!open) return null

    return (
        <div className="overlay-sf" onClick={onClose}>
            <div className="modal-container modal-container-sf" onClick={(event) => {event.stopPropagation()}}>
                <p className="close-btn" onClick={onClose}>X</p>
                <div className="container ps-5 pe-5 d-flex flex-column h-90">
                    <p className="h3 text-uppercase"><b>Filters</b></p>
                    <div className="mt-3">
                        <div className="mt-1 mb-1">
                            <label htmlFor="studio-name-filter" className="form-label mb-1"><b>Add Studio Name</b></label>
                            <input type="text" className="form-control" id="studio-name-filter" placeholder="Enter studio name"
                            onKeyDown={(event) => {handleKeyDown(event, 'studio')}}/>
                            {studioNameFilters.map((filter, index) => (
                                <FilterItem key={index} text={filter} onDelete={() => {onFilterItemDelete(filter, 'studio')}} />
                            ))}
                        </div>

                        <div className="mt-1 mb-1">
                            <label htmlFor="studio-amenities-filter" className="form-label mb-1"><b>Add Amenity</b></label>
                            <input type="text" className="form-control" id="studio-amenities-filter" placeholder="Enter amenities"
                            onKeyDown={(event) => {handleKeyDown(event, 'amenity')}}/>
                            {studioAmenityFilters.map((filter, index) => (
                                <FilterItem key={index} text={filter} onDelete={() => {onFilterItemDelete(filter, 'amenity')}} />
                            ))}
                        </div>

                        <div className="mt-1 mb-1">
                            <label htmlFor="studio-cls-name-filter" className="form-label mb-1"><b>Add Class Name</b></label>
                            <input type="text" className="form-control" id="studio-cls-name-filter" placeholder="Enter class name"
                            onKeyDown={(event) => {handleKeyDown(event, 'class')}}/>
                            {classNameFilters.map((filter, index) => (
                                <FilterItem key={index} text={filter} onDelete={() => {onFilterItemDelete(filter, 'class')}} />
                            ))}
                        </div>

                        <div className="mt-1 mb-1">
                            <label htmlFor="studio-coach-filter" className="form-label mb-1"><b>Add Coach Name</b></label>
                            <input type="text" className="form-control" id="studio-coach-filter" placeholder="Enter coach name"
                            onKeyDown={(event) => {handleKeyDown(event, 'coach')}}/>
                            {coachNameFilters.map((filter, index) => (
                                <FilterItem key={index} text={filter} onDelete={() => {onFilterItemDelete(filter, 'coach')}} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="mt-2 mb-3 d-flex justify-content-center">
                            <button className="btn btn-orange-grey-fade ps-4 pe-4"
                            onClick={() => {onFilter(studioNameFilters, studioAmenityFilters, classNameFilters, coachNameFilters)}}>
                                Apply Filters</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default FilterStudioModal;