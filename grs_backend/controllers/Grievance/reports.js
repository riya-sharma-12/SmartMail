const { env } = process;
const { Op } = require('sequelize');
const sequelizedbConnection = require("../../config/db_connection");
const logger = require("../../config/app_logger");
const { grievanceSubjectsModel, grievanceModel, grievanceStakeholdersModel, grievanceInternalRemarkModel, grievanceResponseModel } = require("../../models/index"); //Models



const grievanceDetailedReport = async (req, res) => {
    try {
        const { grievance_token, user_type } = req.body;
        if (!grievance_token || !user_type) { return res.status(404).send({ status: env.s404, msg: "Grievance Token Or User Type Not Found!" }); };
        const grievance = await grievanceModel.findByPk(grievance_token);
        if (!grievance) { return res.status(404).send({ status: env.s404, msg: "Grievance Not Found!" }); };
        const grievance_resp = await grievanceResponseModel.findAll({ where: { grievance_token: grievance_token } });
        let grievanceInternalRemark = null;
        if (parseInt(user_type) < 4) {
            grievanceInternalRemark = await grievanceInternalRemarkModel.findAll({
                where: {
                    grievance_token: grievance_token
                }
            });
        }
        return res.status(200).send({ status: env.s200, msg: "Grievance Details Fetched Successfully.", data: { grievanceDetails: grievance, grievanceResponceDetails: grievance_resp, grievanceInternalRemark: grievanceInternalRemark } });
    } catch (error) {
        //console.log(error);
        logger.error(`server error inside getAllGrievanceSubj funtion${error}`);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

module.exports = {
    grievanceDetailedReport,
}