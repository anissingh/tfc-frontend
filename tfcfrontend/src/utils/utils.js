
export const capitalizeFirstLetter = s => {
    if(!s) {
        return ''
    } else {
        console.log(s)
        return s[0].toUpperCase() + s.slice(1)
    }
}