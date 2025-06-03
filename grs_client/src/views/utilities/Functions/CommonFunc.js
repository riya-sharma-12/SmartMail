export function calculateGrievancePercentageChange(currentYearGrievances, prevYearGrievances) {
    if (prevYearGrievances == 0) {
        // Handle the case where there were no grievances in the previous year to avoid division by zero
        return currentYearGrievances > 0 ? 100 : 0;
    }
    if (!prevYearGrievances || !currentYearGrievances) {
        // Handle the case where there were no grievances in the previous year to avoid division by zero
        return 0;
    }
    const currentYearGrievancesInt = parseInt(currentYearGrievances);
    const prevYearGrievancesInt = parseInt(prevYearGrievances);
    const diff = currentYearGrievancesInt - prevYearGrievancesInt;
    const diffDivide = diff / prevYearGrievancesInt;
    const percentageChange = diffDivide * 100;
    return percentageChange.toFixed(2); // Round to 2 decimal places
}

export const handleChangeUploadDoc = (event, setFormData, setUploadDocerror) => {
    const file = event.target.files[0];
    // Validate file format and size
    if (!file.type.match('application/pdf')) {
        setUploadDocerror('Please select a PDF file.');
        return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5 MB limit
        setUploadDocerror('File size cannot exceed 5MB.');
        return;
    }
    setFormData({ ...formData, uploadFileValue: event.target.value, uploadFile: file });
    setUploadDocerror(null); // Clear any previous errors
};
