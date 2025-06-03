import CryptoJS from 'crypto-js';
const secretKey = "znicz2023caraz7elon200378172023"//process.env.SECRET_KEY;

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




// Function to encrypt password
export const encryptValue = (value) => {
    const encryptedValue = CryptoJS.AES.encrypt(value, secretKey).toString();
    return encryptedValue;
};


