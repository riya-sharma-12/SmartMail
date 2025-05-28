const { env } = process;
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const sequelizedbConnection = require("../../config/db_connection");
const logger = require("../../config/app_logger");
const { grievanceSubjectsModel, grievanceEntryModel, grievanceStakeholdersModel, grievancesModel, grievanceresponsesModel } = require("../../models/index"); //Models
const { getTokenNumber } = require('../../utils/generateGrievanceToken');


const getAllGrievanceSubj = async (req, res) => {
    try {
        //const { subjCategory } = req.body;
        const subjCategory = "A";
        const allGrivSubj = await grievanceSubjectsModel.findAll({
            where: {
                subject_category: subjCategory
            }
        });
        return res.status(200).send({ status: env.s200, msg: "All Grievance Subjects Fetched Successfully", allGrivSubj: allGrivSubj });
    } catch (error) {
        logger.error(`server error inside getAllGrievanceSubj funtion${error}`);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

const getAllGrievanceStkh = async (req, res) => {
    try {
        ////console.log("inside",req.headers['x-forwarded-for'], req.connection.remoteAddress);
        const allGrivSubj = await grievanceSubjectsModel.findAll();
        return res.status(200).send({ status: env.s200, msg: "All Grievance Subjects Fetched Successfully", data: allGrivSubj });
    } catch (error) {
        logger.error(`server error inside getAllGrievanceSubj funtion${error}`);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

const registerGrievance = async (req, res) => {
    try {
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const { applicant_type, applicant_reg_on_carings, applicant_regno,
            applicant_name, applicant_gender, applicant_email_id, grievance_subject_code,
            applicant_phone_no, applicant_address, applicant_district_code,
            applicant_state_code, applicant_country_code, grievance_category, grievance_type,
            grievance_subject_id, grievance_against_type, grievance_against_code, grievance
        } = req.body;
        let uploadedDocPath = "NA";
        const uploadedFile = req.file;
        //console.log(grievance_type, "grievance_type");
        if (uploadedFile) {
            uploadedDocPath = uploadedFile?.filename;
        }
        if (applicant_reg_on_carings == 1 && !applicant_regno) { return res.status(404).send({ status: env.s404, msg: "Registraction No is Not Found" }); }
        let grievance_token = await getTokenNumber();
        if (!grievance_token) { return res.status(500).send({ status: env.s500, msg: "Failed to Generate New Grievance Token No" }); }
        if (grievance_type == 0) {
            grievance_token = 'Q' + grievance_token;
        } else if (grievance_type == 1) {
            grievance_token = 'C' + grievance_token;
        } else {
            return res.status(422).send({ status: env.s422, msg: "Grievance Category is Incorrect" });
        }
        //console.log("getTokenNumber", grievance_token);
        const grievancerData = {
            grievance_token: grievance_token,
            applicant_type: applicant_type,
            applicant_reg_on_carings: applicant_reg_on_carings,
            applicant_regno: applicant_regno || "NA",
            applicant_name: applicant_name,
            applicant_gender: applicant_gender,
            applicant_email_id: applicant_email_id,
            applicant_phone_no: applicant_phone_no,
            applicant_address: applicant_address,
            applicant_district_code: applicant_district_code,
            applicant_state_code: applicant_state_code,
            applicant_country_code: applicant_country_code,
            grievance_type: grievance_type,
            grievance_category: grievance_category,
            grievance_subject_id: parseInt(grievance_subject_id),
            grievance_status: 0,
            grievance_against_type: grievance_against_type,
            grievance_against_code: grievance_against_code,
            grievance_entry_date: new Date(),
        };
        const grievanceData = {
            grievance_token: grievance_token,
            grievance_sub_token_no: 1,
            grievance: grievance,
            grievance_uploaded_doc_path: uploadedDocPath,//grievance_uploaded_doc_path || "NA",
            user_ip: ipAddress,
            grievance_date: new Date(),
        }
        // Start a transaction
        const newGrievanceTransaction = async () => {
            return new Promise(async (resolve, reject) => {
                const transaction = await sequelizedbConnection().transaction(); // Start a new transaction

                try {
                    await grievanceEntryModel.create(grievancerData, { transaction });
                    await grievancesModel.create(grievanceData, { transaction });

                    await transaction.commit(); // Commit the transaction
                    resolve({ status: 'committed' }); // Resolve the Promise to indicate successful commit
                } catch (error) {
                    await transaction.rollback(); // Rollback the transaction in case of an error
                    reject({ status: 'failed', error }); // Reject the Promise with the error
                }
            });
        };
        const newGrievance = await newGrievanceTransaction();
        if (!newGrievance) { return res.status(417).send({ status: env.s417, msg: "Failed to Register New Grievance.", data: [] }); };
        return res.status(200).send({ status: env.s200, msg: "New Grievance Registered Successfully.", data: { grievanceTokenNo: grievance_token } });
    } catch (error) {
        //console.log("error", error);
        logger.error(`server error inside registerGrievance funtion${error}`);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
}

const grievanceResponse = async (req, res) => {
    try {
        const { grievance_token, responser_type, responser_id, response_type, response } = req.body;
        const grievanceDetail = await grievanceEntryModel.findByPk(grievance_token);
        if (!grievanceDetail) { return res.status(404).send({ status: env.s404, msg: "Grievance Not Found!" }); };
        const grievanceStatus = grievance.status;
        if (grievanceStatus == 2) { return res.status(422).send({ status: env.s422, msg: `Grievance -- ${grievance_token} Ticked is Already Closed, It can't modified futher.` }); };
        const grievance = await grievancesModel.findOne({
            where: {
                grievance_token: grievance_token,
                order: [['grievance_sub_token_no', 'DESC']],
                limit: 1,
            }
        });
        if (!grievance) { return res.status(404).send({ status: env.s404, msg: "Grievance Not Found!" }); };
        let subTokenNo = grievance.grievance_sub_token_no;
        const grievanceResponseData = {
            grievance_token: grievance_token,
            grievance_sub_token_no: subTokenNo,
            responser_type: responser_type,
            responser_id: responser_id,
            response_type: response_type,
            response: response,
            upload_doc_path: "NA", //upload_doc_path ,
            responser_ip: ipAddress || "NA",
            response_date: new Date(),
        }
        const grievanceFinalRespTransaction = async () => {
            return new Promise(async (resolve, reject) => {
                const transaction = await sequelizedbConnection().transaction();

                try {
                    grievanceDetail.status = 2;
                    await grievanceDetail.save({ transaction });
                    await grievanceresponsesModel.create(grievanceResponseData, { transaction });
                    await transaction.commit();
                    resolve({ status: 'committed' });
                } catch (error) {
                    await transaction.rollback();
                    reject({ status: 'failed', error });
                }
            });
        };
        if (responser_type == 2) {
            await grievanceFinalRespTransaction();
        } else {
            await grievanceresponsesModel.create(grievanceResponseData);
        }
        return res.status(200).send({ status: env.s200, msg: "Grievance Responce or Remark Added Successfully." });
    } catch (error) {
        logger.error(`server error inside grievanceResponse funtion${error}`);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};




const subGrievanceEntry = async (req, res) => {
    try {
        const { grievance_token, grievance, grievance_uploaded_doc_path, user_ip, grievance_date } = req.body;
        const grievanceDetail = await grievanceEntryModel.findByPk(grievance_token);
        if (!grievanceDetail) { return res.status(404).send({ status: env.s404, msg: "Grievance Not Found!" }); };
        const grievanceStatus = grievanceDetail.status;
        if (grievanceStatus == 2) { return res.status(422).send({ status: env.s422, msg: `Grievance -- ${grievance_token} Ticked is Already Closed, It can't modified futher.` }); };
        const lastSubGrievance = await grievancesModel.findOne({
            where: {
                grievance_token: grievance_token,
                order: [['grievance_sub_token_no', 'DESC']],
                limit: 1,
            }
        });
        let subTokenNo = 1;
        if (lastSubGrievance) {
            subTokenNo = lastSubGrievance.grievance_sub_token_no + 1;
        }
        const subGrievanceData = {
            grievance_token: grievance_token,
            grievance_sub_token_no: subTokenNo,
            grievance: grievance,
            grievance_uploaded_doc_path: "NA",//grievance_uploaded_doc_path || "NA",
            user_ip: ipAddress,
            grievance_date: new Date(),
        }
        await grievancesModel.create(subGrievanceData);
        return res.status(200).send({ status: env.s200, msg: "New Grievance Remark or Comment Added Successfully." });
    } catch (error) {
        logger.error(`server error inside subGrievanceEntry funtion${error}`);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};


const grievanceFinalResponce = async (req, res) => {
    try {
        const { } = req.body;
        return res.status(200).send({ status: env.s200, msg: "Grievance Internal Remark Successfully" });
    } catch (error) {
        logger.error(`server error inside grievanceFinalResponce funtion${error}`);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};



const grievanceDashboard = async (req, res) => {
    const { user } = req;
    const user_level = parseInt(user?.user_level);
    const user_dept = parseInt(user?.user_dept);
    if (user_level < 3) {
        try {
            const grievanceStats = await grievanceEntryModel.findAll({
                attributes: [
                    [Sequelize.fn('COUNT', Sequelize.col('grievance_token')), 'total_grievance'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 1 THEN 1 ELSE 0 END')), 'total_query'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 0 THEN 1 ELSE 0 END')), 'total_complains'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 1 AND grievance_category = 1 THEN 1 ELSE 0 END')), 'total_ap_query'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 0 AND grievance_category = 1 THEN 1 ELSE 0 END')), 'total_ap_complains'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 0 AND grievance_category = 0 THEN 1 ELSE 0 END')), 'total_it_complains'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_status = 0 THEN 1 ELSE 0 END')), 'grievance_pending'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_status = 1 THEN 1 ELSE 0 END')), 'grievance_resolved']
                ],
                raw: true,
            });

            // const grievanceYearlyStats = await grievanceEntryModel.findAll({
            //     attributes: [
            //         [Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "grievance_entry_date"')), 'year'],
            //         [Sequelize.fn('COUNT', Sequelize.col('grievance_token')), 'total_grievance'],
            //         [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 1 THEN 1 ELSE 0 END')), 'total_query'],
            //         [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 0 THEN 1 ELSE 0 END')), 'total_complains'],
            //         [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 1 AND grievance_category = 1 THEN 1 ELSE 0 END')), 'total_ap_query'],
            //         [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 0 AND grievance_category = 1 THEN 1 ELSE 0 END')), 'total_ap_complains'],
            //         [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 0 AND grievance_category = 0 THEN 1 ELSE 0 END')), 'total_it_complains'],
            //         [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_status = 0 THEN 1 ELSE 0 END')), 'grievance_pending'],
            //         [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_status = 1 AND grievance_type = 1 THEN 1 ELSE 0 END')), 'total_query_resolved'],
            //         [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_status = 1 AND grievance_type = 0 THEN 1 ELSE 0 END')), 'total_complains_resolved'],
            //         [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_status = 1 THEN 1 ELSE 0 END')), 'total_grievance_resolved']
            //     ],
            //     where: {
            //         [Op.or]: [
            //             Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "grievance_entry_date"')), Sequelize.literal('EXTRACT(YEAR FROM CURRENT_DATE)')),
            //             Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "grievance_entry_date"')), Sequelize.literal('EXTRACT(YEAR FROM CURRENT_DATE)-1')),
            //         ],
            //     },
            //     group: [Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "grievance_entry_date"'))],
            //     order: [Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "grievance_entry_date"'))],
            //     raw: true, // To get the raw result as an object
            // });

            const grievanceMonthlyStats = await grievanceEntryModel.findAll({
                attributes: [
                    [Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "grievance_entry_date"')), 'month'],
                    [Sequelize.fn('COUNT', Sequelize.col('grievance_token')), 'total_grievance'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 1 THEN 1 ELSE 0 END')), 'total_query'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 0 THEN 1 ELSE 0 END')), 'total_complains'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 1 AND grievance_category = 1 THEN 1 ELSE 0 END')), 'total_ap_query'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 0 AND grievance_category = 1 THEN 1 ELSE 0 END')), 'total_ap_complains'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 0 AND grievance_category = 0 THEN 1 ELSE 0 END')), 'total_it_complains'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_status = 0 THEN 1 ELSE 0 END')), 'grievance_pending'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_status = 1 AND grievance_type = 1 THEN 1 ELSE 0 END')), 'total_query_resolved'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_status = 1 AND grievance_type = 0 THEN 1 ELSE 0 END')), 'total_complains_resolved'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_status = 1 THEN 1 ELSE 0 END')), 'total_grievance_resolved']
                ],
                where: {
                    [Op.or]: [
                        Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "grievance_entry_date"')), Sequelize.literal('EXTRACT(MONTH FROM CURRENT_DATE)')),
                        Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "grievance_entry_date"')), Sequelize.literal('EXTRACT(MONTH FROM CURRENT_DATE) - 1')),
                    ]
                },
                group: [Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "grievance_entry_date"'))],
                order: [Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "grievance_entry_date"'))],
                raw: true // To get the raw result as an object
            });

            const grievanceCurrYearMonthlyStats = await grievanceEntryModel.findAll({
                attributes: [
                    [Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "grievance_entry_date"')), 'month'],
                    [Sequelize.fn('COUNT', Sequelize.col('grievance_token')), 'total_grievance'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 1 THEN 1 ELSE 0 END')), 'total_query'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 0 THEN 1 ELSE 0 END')), 'total_complains'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 1 AND grievance_category = 1 THEN 1 ELSE 0 END')), 'total_ap_query'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 0 AND grievance_category = 1 THEN 1 ELSE 0 END')), 'total_ap_complains'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 0 AND grievance_category = 0 THEN 1 ELSE 0 END')), 'total_it_complains'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_status = 0 THEN 1 ELSE 0 END')), 'grievance_pending'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_status = 1 THEN 1 ELSE 0 END')), 'grievance_resolved']
                ],
                where: {
                    grievance_entry_date: {
                        [Op.and]: [
                            Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "grievance_entry_date"')), Sequelize.literal('EXTRACT(YEAR FROM CURRENT_DATE)')),
                        ],
                    },
                },
                group: [Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "grievance_entry_date"'))],
                order: [Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "grievance_entry_date"'))],
                raw: true, // To get the raw result as an object
            });

            return res.status(200).send({
                status: env.s200, msg: "Grievance Stats Found Successfully", data:
                {
                    grievanceStats: grievanceStats,
                    grievanceYearlyStats: grievanceMonthlyStats,
                    grievanceCurrYearMonthlyStats: grievanceCurrYearMonthlyStats
                }
            });
        } catch (error) {
            logger.error(`server error inside grievanceDashboard funtion${error}`);
            return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
        }
    }else if(user_level===3){
        try {
            const grievanceStats = await grievanceEntryModel.findAll({
                attributes: [
                    [Sequelize.fn('COUNT', Sequelize.col('grievance_token')), 'total_grievance'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 1 THEN 1 ELSE 0 END')), 'total_query'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 0 THEN 1 ELSE 0 END')), 'total_complains'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 1 AND grievance_category = 1 THEN 1 ELSE 0 END')), 'total_ap_query'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 0 AND grievance_category = 1 THEN 1 ELSE 0 END')), 'total_ap_complains'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 0 AND grievance_category = 0 THEN 1 ELSE 0 END')), 'total_it_complains'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_status = 0 THEN 1 ELSE 0 END')), 'grievance_pending'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_status = 1 THEN 1 ELSE 0 END')), 'grievance_resolved']
                ],
                where:{
                    grievance_dept_code:user_dept
                },
                raw: true,
            });
    
            // const grievanceYearlyStats = await grievanceEntryModel.findAll({
            //     attributes: [
            //         [Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "grievance_entry_date"')), 'year'],
            //         [Sequelize.fn('COUNT', Sequelize.col('grievance_token')), 'total_grievance'],
            //         [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 1 THEN 1 ELSE 0 END')), 'total_query'],
            //         [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 0 THEN 1 ELSE 0 END')), 'total_complains'],
            //         [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 1 AND grievance_category = 1 THEN 1 ELSE 0 END')), 'total_ap_query'],
            //         [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 0 AND grievance_category = 1 THEN 1 ELSE 0 END')), 'total_ap_complains'],
            //         [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 0 AND grievance_category = 0 THEN 1 ELSE 0 END')), 'total_it_complains'],
            //         [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_status = 0 THEN 1 ELSE 0 END')), 'grievance_pending'],
            //         [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_status = 1 AND grievance_type = 1 THEN 1 ELSE 0 END')), 'total_query_resolved'],
            //         [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_status = 1 AND grievance_type = 0 THEN 1 ELSE 0 END')), 'total_complains_resolved'],
            //         [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_status = 1 THEN 1 ELSE 0 END')), 'total_grievance_resolved']
            //     ],
            //     where: {
            //         [Op.or]: [
            //             Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "grievance_entry_date"')), Sequelize.literal('EXTRACT(YEAR FROM CURRENT_DATE)')),
            //             Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "grievance_entry_date"')), Sequelize.literal('EXTRACT(YEAR FROM CURRENT_DATE)-1')),
            //         ],
            //         grievance_dept_code:user_dept
            //     },
            //     group: [Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "grievance_entry_date"'))],
            //     order: [Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "grievance_entry_date"'))],
            //     raw: true, // To get the raw result as an object
            // });
            const grievanceMonthlyStats = await grievanceEntryModel.findAll({
                attributes: [
                    [Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "grievance_entry_date"')), 'month'],
                    [Sequelize.fn('COUNT', Sequelize.col('grievance_token')), 'total_grievance'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 1 THEN 1 ELSE 0 END')), 'total_query'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 0 THEN 1 ELSE 0 END')), 'total_complains'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 1 AND grievance_category = 1 THEN 1 ELSE 0 END')), 'total_ap_query'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 0 AND grievance_category = 1 THEN 1 ELSE 0 END')), 'total_ap_complains'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 0 AND grievance_category = 0 THEN 1 ELSE 0 END')), 'total_it_complains'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_status = 0 THEN 1 ELSE 0 END')), 'grievance_pending'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_status = 1 AND grievance_type = 1 THEN 1 ELSE 0 END')), 'total_query_resolved'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_status = 1 AND grievance_type = 0 THEN 1 ELSE 0 END')), 'total_complains_resolved'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_status = 1 THEN 1 ELSE 0 END')), 'total_grievance_resolved']
                ],
                where: {
                    [Op.or]: [
                        Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "grievance_entry_date"')), Sequelize.literal('EXTRACT(MONTH FROM CURRENT_DATE)')),
                        Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "grievance_entry_date"')), Sequelize.literal('EXTRACT(MONTH FROM CURRENT_DATE) - 1')),
                    ],
                    grievance_dept_code:user_dept
                },
                group: [Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "grievance_entry_date"'))],
                order: [Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "grievance_entry_date"'))],
                raw: true // To get the raw result as an object
            });
            
    
            const grievanceCurrYearMonthlyStats = await grievanceEntryModel.findAll({
                attributes: [
                    [Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "grievance_entry_date"')), 'month'],
                    [Sequelize.fn('COUNT', Sequelize.col('grievance_token')), 'total_grievance'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 1 THEN 1 ELSE 0 END')), 'total_query'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 0 THEN 1 ELSE 0 END')), 'total_complains'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 1 AND grievance_category = 1 THEN 1 ELSE 0 END')), 'total_ap_query'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 0 AND grievance_category = 1 THEN 1 ELSE 0 END')), 'total_ap_complains'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_type = 0 AND grievance_category = 0 THEN 1 ELSE 0 END')), 'total_it_complains'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_status = 0 THEN 1 ELSE 0 END')), 'grievance_pending'],
                    [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN grievance_status = 1 THEN 1 ELSE 0 END')), 'grievance_resolved']
                ],
                where: {
                    grievance_entry_date: {
                        [Op.and]: [
                            Sequelize.where(Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "grievance_entry_date"')), Sequelize.literal('EXTRACT(YEAR FROM CURRENT_DATE)')),
                        ],
                    },
                    grievance_dept_code:user_dept
                },
                group: [Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "grievance_entry_date"'))],
                order: [Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "grievance_entry_date"'))],
                raw: true, // To get the raw result as an object
            });
    
            return res.status(200).send({
                status: env.s200, msg: "Grievance Stats Found Successfully", data:
                {
                    grievanceStats: grievanceStats,
                    grievanceYearlyStats: grievanceMonthlyStats,
                    grievanceCurrYearMonthlyStats: grievanceCurrYearMonthlyStats
                }
            });
        } catch (error) {
            logger.error(`server error inside grievanceDashboard funtion${error}`);
            return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
        }
    }else{
        return res.status(409).send({ status: env.s409, msg: "Unauthorized Access" });
    }

};



const grievanceViewReport = async (req, res) => {
    try {
        const { grievance_token } = req.body;
        //console.log(req.body)
        if (!grievance_token) { return res.status(404).send({ status: env.s404, msg: "Grievance Token Or User Type Not Found!" }); };
        const grievance = await grievanceEntryModel.findByPk(grievance_token);
        if (!grievance) { return res.status(404).send({ status: env.s404, msg: "Grievance Not Found!" }); };
        const grievanceAllQueys = await grievancesModel.findAll({
            where: {
                grievance_token: grievance_token
            }
        });
        const grievance_resp = await grievanceresponsesModel.findAll({ where: { grievance_token: grievance_token } });
        return res.status(200).send({ status: env.s200, msg: "Grievance Report Data Fetched Successfully.", grievanceViewReportData: { grievanceDetails: grievance, grievanceAllQueys: grievanceAllQueys, grievanceResponceDetails: grievance_resp } });
    } catch (error) {
        logger.error(`server error inside getAllGrievanceSubj funtion with a error message --${error?.message}, error -- ${error} `);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};


const grievanceResponseViaCaringStkh = async (req, res) => {
    try {
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        //console.log(req.body);
        let uploadedDocPath = "NA";
        const uploadedFile = req.file;
        if (uploadedFile) {
            uploadedDocPath = uploadedFile?.filename;
        }
        //console.log(req.body, uploadedFile);
        //return res.status(200).send({ status: env.s200, msg: "Success" });
        const { grievance_token, responser_type, responser_id, response_type, response } = req.body;
        const grievanceDetail = await grievanceEntryModel.findByPk(grievance_token);
        if (!grievanceDetail) { return res.status(404).send({ status: env.s404, msg: "Grievance Not Found!" }); };
        const grievanceStatus = grievanceDetail.grievance_status;
        if (grievanceStatus == 1) { return res.status(422).send({ status: env.s422, msg: `Grievance -- ${grievance_token} Ticked is Already Closed, It can't modified futher.` }); };
        const grievance = await grievancesModel.findOne({
            where: {
                grievance_token: grievance_token,
            },
            [Op.order]: [['grievance_sub_token_no', 'DESC']],
            limit: 1,
        });
        if (!grievance) { return res.status(404).send({ status: env.s404, msg: "Grievance Not Found!" }); };
        let subTokenNo = grievance.grievance_sub_token_no;
        const grievanceResponseData = {
            grievance_token: grievance_token,
            grievance_sub_token_no: subTokenNo,
            responser_type: responser_type,
            responser_id: responser_id,
            response_type: response_type,
            response: response,
            upload_doc_path: uploadedFile?.filename || "NA", //upload_doc_path ,
            responser_ip: ipAddress || "NA",
            response_date: new Date(),
        }
        const grievanceFinalRespTransaction = async () => {
            return new Promise(async (resolve, reject) => {
                const transaction = await sequelizedbConnection().transaction();

                try {
                    grievanceDetail.grievance_status = 1;
                    await grievanceDetail.save({ transaction });
                    await grievanceresponsesModel.create(grievanceResponseData, { transaction });
                    await transaction.commit();
                    resolve({ status: 'committed' });
                } catch (error) {
                    await transaction.rollback();
                    reject({ status: 'failed', error });
                }
            });
        };
        if (response_type == 1) {
            await grievanceFinalRespTransaction();

        } else {
            await grievanceresponsesModel.create(grievanceResponseData);
        }
        return res.status(200).send({ status: env.s200, msg: "Grievance Responce or Remark Added Successfully." });
    } catch (error) {
        //console.log(error);
        logger.error(`server error inside grievanceResponse funtionwith a error message --${error?.message}, error -- ${error} `);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};
module.exports = {
    registerGrievance,
    subGrievanceEntry,
    grievanceResponse,
    getAllGrievanceSubj,
    grievanceDashboard,
    grievanceViewReport,
    grievanceResponseViaCaringStkh
}
