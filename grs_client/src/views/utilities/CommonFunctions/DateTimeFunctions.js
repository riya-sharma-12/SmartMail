export const validateDateTime = (dateTime) => {
    try {
        const formatedDateTime = dateTime.split(',')[0];
        return !isNaN(new Date(formatedDateTime).getDate());
    } catch {
        return false
    }
}

export const convertInLocalDateTimeStringFormat = (dateTime) => {
    if (!dateTime || !validateDateTime(dateTime)) {
        return null
    }
    const dateString = new Date(dateTime).toLocaleDateString();
    const timeString = new Date(dateTime).toLocaleTimeString();
    return dateString + " " + timeString;
}