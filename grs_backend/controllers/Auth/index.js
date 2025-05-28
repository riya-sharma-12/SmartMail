const { env } = process;
const bcrypt = require("bcryptjs");
const fs = require('fs');
const path = require('path');
const jwt = require("jsonwebtoken");
const logger = require("../../config/app_logger");
const SecretKey = env.SECRET_KEY
const { decryptValue } = require("../../utils/commonFunc");
// import models
const { userDetailsModel } = require('../../models/index');


const login = async (req, res) => {
    try {
        const { user_id, password } = req.body;
        const decryptUserId = decryptValue(user_id);
        const decryptPassword = decryptValue(password);
        const user_login = await userDetailsModel.findByPk(decryptUserId);
        if (!user_login || user_login?.user_status !== 1 || !user_login.user_hashpassword) { return res.status(404).send({ status: env.s404, msg: "User not found" }) };
        const matchPass = await bcrypt.compare(decryptPassword, user_login.user_hashpassword);
        if (!matchPass) { return res.status(422).json({ status: env.s422, msg: "Incorrect Password" }); };
        const token = jwt.sign({ id: decryptUserId }, SecretKey, { expiresIn: '2y' });
        const sevenDay = 1000 * 60 * 60 * 24 * 7;
        res.cookie("token", token, {
            expires: new Date(Date.now() + sevenDay),
            //httpsOnly: true,
            httpOnly: true,
        });
        const userDetails = {
            name: user_login.user_name,
            level: user_login.user_level,
            dept: user_login.user_dept
        }
        return res.status(200).send({ status: env.s200, msg: "You Logged In Successfully!", data: { authToken: token, user: userDetails } });
    } catch (error) {
        logger.error(`server error inside login model with a error message --${error?.message}, error -- ${error} `);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

const forgetPassword = async (req, res) => {
    try {
        const { decryptUserId } = req.body;
        const user = await userDetailsModel.findByPk(decryptUserId);
        if (!user) { return res.status(404).send({ status: env.s404, msg: "User not found" }) };
        const newPassword = generateNewPassword();
        const hash_password = await hashPassword(newPassword); // convert plain password into hashpassword
        // Update the user's hashed password in the database
        const sendOtpResponce = await sendNewPassword(decryptUserId, newPassword);
        if (!sendOtpResponce || sendOtpResponce.status !== "successfull") { res.status(417).json({ status: env.s417, msg: "Failed to Send New Password Over Mail Contact your Admin!" }); };
        user.hash_password = hash_password;
        await user.save();
        // sending final responce;
        res.status(200).json({ status: env.s200, msg: "New Passord Send into Your Registered Mail ID." });
    } catch (error) {
        res.status(500).json({ status: env.s500, msg: "Internal Server Error", error: error });
    }
};



//temp
const getgrievanceUploadedPdf = async (req, res) => {
    try {
        //console.log(req.params, req.body);
        const { filename } = req.params;
        //console.log(__dirname)
        // const currPath = __dirname.split('/');
        // let uploadDir = currPath.slice(1, currPath.length - 2);
        // uploadDir = "/" + uploadDir.join('/') + '/assets/uploaded_files/';
        const filePath = path.join(__dirname, `../../utils/assets/mail_attachments/${filename}`);
        console.log("filePath-->", filePath);
        //console.log(filePath);

        // Validate filename to prevent unauthorized access
        // if (!filename.match(/^[a-zA-Z0-9\-._]+$/)) {
        //     return res.status(400).send('Invalid filename');
        // }

        // Check if file exists
        fs.exists(filePath, (exists) => {
            if (!exists) {
                return res.status(404).send('File not found');
            }

            // Set appropriate headers for PDF streaming
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
            const pdfFileata = fs.readFileSync(filePath);
            res.send(pdfFileata);
        });
    } catch (error) {
        console.log("err", error)
        logger.error(`server error inside getgrievanceUploadedPdf funtion with a error message --${error?.message}, error -- ${error} `);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};
//temp


module.exports = {
    login,
    forgetPassword,
    getgrievanceUploadedPdf
}