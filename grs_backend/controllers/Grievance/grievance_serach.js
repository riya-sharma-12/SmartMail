const { env } = process;
const { Op } = require('sequelize');
const logger = require("../../config/app_logger");
const { grievanceSubjectsModel, grievanceModel, grievanceResponseModel, grievanceInternalRemarkModel, grievancesModel, grievanceEntryModel } = require("../../models/index"); //Models

const getAllComplainsQuery = async (req, res) => {
    try {
        const { grievance_type } = req.body;
        const grievances = await grievanceEntryModel.findAll({
            where: {
                grievance_type: grievance_type
            },
            attributes: ['grievance_token', 'applicant_name', 'applicant_phone_no', 'grievance_status', 'grievance_entry_date'],
        });
        if (!grievances) { return res.status(404).send({ status: env.s404, msg: "Grievance Details Not Found!" }); };
        return res.status(200).send({ status: env.s200, msg: "Grievance Details Fetched Successfully.", data: { grievances: grievances } });
    } catch (error) {
        logger.error(`server error inside getAllComplainsQuery funtion${error}`);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

const getGrievanceDetailViaTokenNo = async (token, grievance_type) => {
    try {
        const grievances = await grievanceEntryModel.findAll({
            where: {
                grievance_type: grievance_type,
                grievance_token: {
                    [Op.like]: `${token}%`
                }
            },
            attributes: ['grievance_token', 'applicant_name', 'applicant_phone_no', 'grievance_status', 'grievance_entry_date'],
        });
        return grievances;
    } catch (error) {
        logger.error(`server error inside getGrievanceDetailViaTokenNo funtion${error}`);
    }
};

const getGrievanceDetailViaName = async (name, grievance_type) => {
    try {
        const grievances = await grievanceEntryModel.findAll({
            where: {
                grievance_type: grievance_type,
                applicant_name: {
                    [Op.like]: `%${name}%`
                }
            },
            attributes: ['grievance_token', 'applicant_name', 'applicant_phone_no', 'grievance_status', 'grievance_entry_date'],
        });
        return grievances;
    } catch (error) {
        logger.error(`server error inside getGrievanceDetailViaName funtion${error}`);
    }
};

const getGrievanceDetailViaPhoneNo = async (phoneno, grievance_type) => {
    try {
        const grievances = await grievanceEntryModel.findAll({
            where: {
                grievance_type: grievance_type,
                applicant_phone_no: {
                    [Op.like]: `${phoneno}%`
                }
            },
            attributes: ['grievance_token', 'applicant_name', 'applicant_phone_no', 'grievance_status', 'grievance_entry_date'],
        }
        );
        return grievances;
    } catch (error) {
        logger.error(`server error inside getGrievanceDetailViaPhoneNo funtion${error}`);
    }
};

const getGrievanceDetailViaEmailId = async (emailId, grievance_type) => {
    try {
        const grievances = await grievanceEntryModel.findAll({
            where: {
                grievance_type: grievance_type,
                applicant_email_id: {
                    [Op.like]: `${emailId}%`
                }
            },
            attributes: ['grievance_token', 'applicant_name', 'applicant_phone_no', 'grievance_status', 'grievance_entry_date'],
        });
        return grievances;
    } catch (error) {
        logger.error(`server error inside getGrievanceDetailViaEmailId funtion${error}`);
    }
};


const searchGrievance = async (req, res) => {
    try {
        const { token, name, phone_no, email_id, grievance_type } = req.body;
        let { search_by } = req.body;
        search_by = search_by ? parseInt(search_by) : null;
        let grievances = null;
        if (search_by === 0) {
            if (!token) { return res.status(404).send({ status: env.s404, msg: "Token Not Found!" }); };
            grievances = await getGrievanceDetailViaTokenNo(token, grievance_type);
        }
        else if (search_by === 1) {
            if (!name) { return res.status(404).send({ status: env.s404, msg: "Name Not Found!" }); };
            grievances = await getGrievanceDetailViaName(name, grievance_type);
        }
        else if (search_by === 2) {
            if (!phone_no) { return res.status(404).send({ status: env.s404, msg: "Phone No Not Found!" }); };
            grievances = await getGrievanceDetailViaPhoneNo(phone_no, grievance_type);
        } else if (search_by === 3) {
            if (!email_id) { return res.status(404).send({ status: env.s404, msg: "Email ID Not Found!" }); };
            grievances = await getGrievanceDetailViaEmailId(email_id, grievance_type);
        }
        else { return res.status(422).send({ status: env.s422, msg: "Invalid Search Parameter!" }); };
        if (!grievances) { return res.status(404).send({ status: env.s404, msg: "Grievance Not Found!" }); };
        return res.status(200).send({ status: env.s200, msg: "Grievances Details Fetched Successfully.", data: { searchedGrievances: grievances } });
    } catch (error) {
        logger.error(`server error inside getAllGrievanceSubj funtion${error}`);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

const getGrievanceDetails = async (req, res) => {
    try {
        const { grievance_token } = req.body;
        if (!grievance_token) { return res.status(404).send({ status: env.s404, msg: "Grievance Token Not Found!" }); };
        const grievancerDetail = await grievanceModel.findByPk(grievance_token);
        if (!grievancerDetail) { return res.status(404).send({ status: env.s404, msg: "Grievance Not Found!" }); };
        const grievanceRespDetail = await grievancesModel.findAll({
            attributes: [
                ['tbl_grievances.grievance_token', 'grievance_token'],
                ['tbl_grievances.grievance_sub_token_no', 'grievance_sub_token_no'],
                ['tbl_grievances.grievance', 'grievance_token'],
                ['tbl_grievances.grievance_uploaded_doc_path', 'grievance_sub_token_no'],
                ['tbl_grievances.grievance_date', 'grievance_sub_token_no'],
            ],
            where: { grievance_token: grievance_token },
            include: [
                {
                    model: grievanceResponseModel,
                    attributes: [
                        ['tbl_grievance_responses.grievance_sub_token_no', 'grievance_response_sub_token_no'],
                        ['tbl_grievance_responses.responser_type', 'grievance_responser_type'],
                        //['tbl_grievance_responses.responser_id', 'grievance_responser_id'],
                        ['tbl_grievance_responses.response_type', 'grievance_response_type'],
                        ['tbl_grievance_responses.response', 'grievance_response'],
                        ['tbl_grievance_responses.response_date', 'grievance_response_date'],
                    ],
                    on: {
                        grievance_token: Sequelize.where(
                            Sequelize.col('tbl_grievances.grievance_token'),
                            '=',
                            Sequelize.col('tbl_grievance_responses.grievance_token')
                        ),
                        grievance_sub_token_no: Sequelize.where(
                            Sequelize.col('tbl_grievances.grievance_sub_token_no'),
                            '=',
                            Sequelize.col('tbl_grievance_responses.grievance_sub_token_no')
                        ),
                    },
                    required: false, // Use false for LEFT JOIN
                },
            ],
            order: [['tbl_grievances.grievance_sub_token_no', 'ASC']],
        });
        return res.status(200).send({ status: env.s200, msg: "Grievance Details Fetched Successfully.", data: { grievancerDetails: grievancerDetail, grievanceResponceDetails: grievanceRespDetail } });
    } catch (error) {
        logger.error(`server error inside getAllGrievanceSubj funtion${error}`);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

module.exports = {
    searchGrievance,
    getGrievanceDetails,
    getAllComplainsQuery,
};
