const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto')
const fs = require('fs');
const CryptoJS = require('crypto-js');
const bcrypt = require("bcryptjs");
const secretKey = process.env.SECRET_KEY;
const { check } = require('express-validator');


function generateUUID() {
    return uuidv4();
}

// Common function to generate a unique filename
function generateUniqueFilename(req, file, cb) {
    const uniqueSuffix = crypto.randomBytes(10).toString('hex');
    const filename = `${Date.now()}-${uniqueSuffix}-${file.originalname}`;
    cb(null, filename);
}

// delete file
function deleteFile(filePath, fileName) {
    try {
        const fullPath = path.join(filePath, fileName);

        // Check if the file exists before attempting deletion
        if (!fs.existsSync(fullPath)) {
            return false; // Indicate file not found
        }

        fs.unlinkSync(fullPath);
        return true; // Indicate successful deletion
    } catch (error) {
        return false; // Indicate failure
    }
}



// Function to decrypt encrypted value
const decryptValue = (encryptedValue) => {
    const bytes = CryptoJS.AES.decrypt(encryptedValue, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};



function createHashPassword(plainPassword, secretKey) {
    // Combine the plain password with the secret key
    const combinedString = `${plainPassword}${secretKey}`;

    // Generate a SHA256 hash of the combined string
    const hash = crypto.createHash('sha256').update(combinedString).digest('hex');

    return hash;
};


// Function to hash a plain password
async function createHashPasswordViaBcrypt(plainPassword) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
}


// Define custom middleware to check for null values
const checkNotNull = (fields) => {
    return fields.map(field => check(field).exists().withMessage(`Invalid ${field}`));
};




module.exports = {
    generateUUID,
    generateUniqueFilename,
    deleteFile,
    decryptValue,
    createHashPassword,
    createHashPasswordViaBcrypt,
    checkNotNull
}
