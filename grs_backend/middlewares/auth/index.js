const jwt = require("jsonwebtoken");
const keysecret = process.env.SECRET_KEY
const { userDetailsModel } = require("../../models/index"); // Model
const logger = require('../../config/app_logger');
const { env } = process;

const verifycaraUser = async (req, res, next) => {
    try {
        const token = req.headers?.authorization || req.headers?.Authorization || req.cookies?.token;
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (!token || !ipAddress) { return res.status(401).json({ status: env.s401, msg: 'Token not provided or unable to fetch Ip-Address' }) };
        req.userIp = ipAddress;
        const decodetoken = jwt.verify(token, keysecret);
        if (!decodetoken?.id) { return res.status(401).json({ status: env.s401, msg: 'Decoding Token Failed!' }) };
        const user = await userDetailsModel.findByPk(decodetoken?.id);
        if (!user || user?.user_status != 1 || user?.user_level > 4) { return res.status(401).json({ status: env.s401, msg: 'You are not authorized user to access this!' }); };
        req.user = user;
        next();
    } catch (error) {
        ////console.log("error", error)
        if (error.name === 'TokenExpiredError') { return res.status(401).json({ status: env.s401, msg: 'Token expired' }); };
        logger.error('Getting Error inside auth middleware', error)
        res.status(500).send({ statu: env.s500, msg: "Server Error!" })
    }
}

const verifycaraEmployee = async (req, res, next) => {
    try {
        const token = req.headers?.authorization || req.headers?.Authorization || req.cookies?.token;
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (!token || !ipAddress) { return res.status(401).json({ status: env.s401, msg: 'Token not provided or unable to fetch Ip-Address' }) };
        req.userIp = ipAddress;
        const decodetoken = jwt.verify(token, keysecret);
        if (!decodetoken?.id) { return res.status(401).json({ status: env.s401, msg: 'Decoding Token Failed!' }) };
        const user = await userDetailsModel.findByPk(decodetoken?.id);
        if (!user || user?.user_status != 1 || user?.user_level > 3) { return res.status(401).json({ status: env.s401, msg: 'You are not authorized user to access this!' }); };
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') { return res.status(401).json({ status: env.s401, msg: 'Token expired' }); };
        logger.error('Getting Error inside auth middleware', error)
        res.status(500).send({ statu: env.s500, msg: "Server Error!" })
    }
}

const verifycaraAdmin = async (req, res, next) => {
    try {
        const token = req.headers?.authorization || req.headers?.Authorization || req.cookies?.token;
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (!token || !ipAddress) { return res.status(401).json({ status: env.s401, msg: 'Token not provided or unable to fetch Ip-Address' }) };
        req.userIp = ipAddress;
        const decodetoken = jwt.verify(token, keysecret);
        if (!decodetoken?.id) { return res.status(401).json({ status: env.s401, msg: 'Decoding Token Failed!' }) };
        const user = await userDetailsModel.findByPk(decodetoken?.id);
        if (!user || user?.user_status != 1 || user?.user_level > 2) { return res.status(401).json({ status: env.s401, msg: 'You are not authorized user to access this!' }); };
        req.user = user;
        next();
    } catch (error) {
        ////console.log("error", error)
        if (error.name === 'TokenExpiredError') { return res.status(401).json({ status: env.s401, msg: 'Token expired' }); };
        logger.error('Getting Error inside auth middleware', error)
        res.status(500).send({ statu: env.s500, msg: "Server Error!" })
    }
}

const verifycaraSuperAdmin = async (req, res, next) => {
    try {
        const token = req.headers?.authorization || req.headers?.Authorization || req.cookies?.token;
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (!token || !ipAddress) { return res.status(401).json({ status: env.s401, msg: 'Token not provided or unable to fetch Ip-Address' }) };
        req.userIp = ipAddress;
        const decodetoken = jwt.verify(token, keysecret);
        if (!decodetoken?.id) { return res.status(401).json({ status: env.s401, msg: 'Decoding Token Failed!' }) };
        const user = await userDetailsModel.findByPk(decodetoken?.id);
        if (!user || user?.user_status != 1 || user?.user_level > 1) { return res.status(401).json({ status: env.s401, msg: 'You are not authorized user to access this!' }); };
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') { return res.status(401).json({ status: env.s401, msg: 'Token expired' }); };
        logger.error('Getting Error inside auth middleware', error)
        res.status(500).send({ statu: env.s500, msg: "Server Error!" })
    }
}


module.exports = {
    verifycaraUser,
    verifycaraEmployee,
    verifycaraAdmin,
    verifycaraSuperAdmin
}
