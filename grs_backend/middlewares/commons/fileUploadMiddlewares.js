const multer = require('multer');
const { generateUniqueFilename } = require('../../utils/commonFunc')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'assets/uploaded_files/'); // Change to your desired upload directory
    },
    filename: generateUniqueFilename
});


const uploadPdfFile = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Invalid file type. Only PDF files are allowed'));
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            return cb(new Error('File size exceeds 5MB limit'));
        }
        cb(null, true);
    }
});

module.exports = {
    uploadPdfFile
}