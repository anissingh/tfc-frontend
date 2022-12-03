
export const capitalizeFirstLetter = s => {
    if(!s) {
        return ''
    } else {
        console.log(s)
        return s[0].toUpperCase() + s.slice(1)
    }
}

export const beautifyDate = (date) => {
    const year = date.slice(0, 4)
    const month = date.slice(5, 7)
    const day = date.slice(8)
    let newMonth = ""

    switch (month) {
        case "01":
            newMonth = "January"
            break
        case "02":
            newMonth = "February"
            break
        case "03":
            newMonth = "March"
            break
        case "04":
            newMonth = "April"
            break
        case "05":
            newMonth = "May"
            break
        case "06":
            newMonth = "June"
            break
        case "07":
            newMonth = "July"
            break
        case "08":
            newMonth = "August"
            break
        case "09":
            newMonth = "September"
            break
        case "10":
            newMonth = "October"
            break
        case "11":
            newMonth = "November"
            break
        case "12":
            newMonth = "December"
            break
        default:
            break
    }

    return `${newMonth} ${day}, ${year}`
}