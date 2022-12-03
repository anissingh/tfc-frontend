import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'
import {useEffect, useState} from "react";
import FilterItem from "../../FilterItem";
import '../../Common/buttons.css';

const FilterStudioClassSchedule = ({onFilter}) => {

    const dateRegex = new RegExp(/^\d{4}[-]\d{2}[-]\d{2}$/)
    const timeRegex = new RegExp(/^\d{2}[-]\d{2}[-]\d{2}$/)

    const [classNameFilters, setClassNameFilters] = useState([])
    const [coachNameFilters, setCoachNameFilters] = useState([])
    const [dateFilters, setDateFilters] = useState([])
    const [startTime, setStartTime] = useState({
        time: '',
        dateObj: null
    })
    const [endTime, setEndTime] = useState({
        time: '',
        dateObj: null
    })

    const onFilterItemDelete = (text, filterType) => {
        if(filterType === 'class') {
            setClassNameFilters(classNameFilters.filter(filter => filter !== text))
        } else if(filterType === 'coach') {
            setCoachNameFilters(coachNameFilters.filter(filter => filter !== text))
        } else if(filterType === 'date') {
            setDateFilters(dateFilters.filter(filter => filter !== text))
        } else if(filterType === 'startTime') {
            setStartTime({
                time: '',
                dateObj: null
            })
        } else if(filterType === 'endTime') {
            setEndTime({
                time: '',
                dateObj: null
            })
        }
    }

    const indexOf = (arr, q) => arr.findIndex(item => q.toLowerCase() === item.toLowerCase());

    const handleKeyDown = (event, filterType) => {
        if(event.key !== 'Enter') return

        const text = event.target.value

        if(filterType === 'class') {
            if(indexOf(classNameFilters, text) === -1) {
                setClassNameFilters(classNameFilters => [...classNameFilters, text])
                event.target.value = ''
            }
        } else if(filterType === 'coach') {
            if(indexOf(coachNameFilters, text) === -1) {
                setCoachNameFilters(coachNameFilters => [...coachNameFilters, text])
                event.target.value = ''
            }
        } else if(filterType === 'date') {
            if(indexOf(dateFilters, text) === -1 && dateRegex.test(text)) {
                setDateFilters(setDateFilters => [...setDateFilters, text])
                event.target.value = ''
            }
        } else if(filterType === 'startTime' || filterType === 'endTime') {
            if(timeRegex.test(text)) {
                const hour = parseInt(text.slice(0, 2))
                const minute = parseInt(text.slice(3, 5))
                const second = parseInt(text.slice(6))

                if(hour < 0 || hour > 24 || minute < 0 || minute > 60 || second < 0 || second > 60) return

                const date = new Date(2022, 1, 1, hour, minute, second)

                if(filterType === 'startTime') {
                    if(endTime.time === '' || date < endTime.dateObj) {
                        setStartTime({
                            time: text,
                            dateObj: date
                        })
                        event.target.value = ''
                    }
                } else if(filterType === 'endTime') {
                    if(startTime === '' || startTime.dateObj < date) {
                        setEndTime({
                            time: text,
                            dateObj: date
                        })
                        event.target.value = ''
                    }
                }
            }
        }

    }

    useEffect(() => {
        setClassNameFilters([])
        setCoachNameFilters([])
        setDateFilters([])
        setStartTime({
            time: '',
            dateObj: null
        })
        setEndTime({
            time: '',
            dateObj: null
        })
    }, [])

    return (
        <>
        <p className="h4 align-self-center">Class Schedule Filters</p>
        <div className="ms-4 me-4">
            <div className="mb-1">
            <label htmlFor="std-class-name-filter" className="form-label mb-1"><b>Add Class Name</b></label>
            <input type="text" className="form-control" id="std-class-name-filter" placeholder="Enter class name"
                   onKeyDown={event => handleKeyDown(event, 'class')}/>
            {classNameFilters.map((filter, index) => (
                <FilterItem key={index} text={filter} onDelete={() => {onFilterItemDelete(filter, 'class')}} />
            ))}
            </div>

            <div className="mb-1">
            <label htmlFor="std-coach-name-filter" className="form-label mb-1"><b>Coach Name</b></label>
            <input type="text" className="form-control" id="std-coach-name-filter" placeholder="Enter coach name"
                   onKeyDown={event => handleKeyDown(event, 'coach')}/>
            {coachNameFilters.map((filter, index) => (
                <FilterItem key={index} text={filter} onDelete={() => {onFilterItemDelete(filter, 'coach')}} />
            ))}
            </div>

            <div className="mb-1">
            <label htmlFor="std-date-name-filter" className="form-label mb-1"><b>Date</b></label>
            <input type="text" className="form-control" id="std-date-name-filter" placeholder="e.g., 2022-03-22 for March 23, 2022"
                   onKeyDown={event => handleKeyDown(event, 'date')}/>
            {dateFilters.map((filter, index) => (
                <FilterItem key={index} text={filter} onDelete={() => {onFilterItemDelete(filter, 'date')}} />
            ))}
            </div>

            <div className="mb-1 d-flex">
            <div className="me-1 col-6">
                <label htmlFor="std-start-time-filter" className="form-label mb-1"><b>Start Time</b></label>
                <input type="text" className="form-control" id="std-start-time-filter" placeholder="e.g., 09-30-00 for 9:30am"
                       onKeyDown={event => handleKeyDown(event, 'startTime')}/>
                {startTime.time !== '' ? <FilterItem text={startTime.time} onDelete={() => {onFilterItemDelete(startTime.time, 'startTime')}} /> : <></>}
            </div>
            <div className="ms-1 col-6">
                <label htmlFor="std-end-time-filter" className="form-label mb-1"><b>End Time</b></label>
                <input type="text" className="form-control" id="std-end-time-filter" placeholder="e.g., 13-45-00 for 1:45pm"
                       onKeyDown={event => handleKeyDown(event, 'endTime')}/>
                {endTime.time !== '' ? <FilterItem text={endTime.time} onDelete={() => {onFilterItemDelete(endTime.time, 'endTime')}} /> : <></>}
            </div>
            </div>

            <div className="mt-2 d-flex justify-content-center">
                <button className="btn btn-grey-border-text ps-5 pe-5"
                        onClick={() => onFilter(classNameFilters, coachNameFilters, dateFilters, startTime.time, endTime.time)}>Filter</button>
            </div>
        </div>
        </>
    )

}

export default FilterStudioClassSchedule