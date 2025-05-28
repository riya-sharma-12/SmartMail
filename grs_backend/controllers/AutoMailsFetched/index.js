const { env } = process;
const Sequelize = require('sequelize');
const fs = require('fs');
const { Op, literal, fn } = require('sequelize');
const logger = require("../../config/app_logger");
const { getTokenNumber } = require('../../utils/generateGrievanceToken');
const { grievanceEntryModel } = require("../../models/index"); //Models





// Controller function to create a new row in the table
async function createGrievanceEntry(req) {
    try {
        const fetchedMailData = req;
        const grievance_token = await getTokenNumber();

        // Create a new row in the table using Sequelize's create method
        const newGrievanceEntry = await grievanceEntryModel.create({
            grievance_token: grievance_token,
            grievance_category: 1,
            grievance_type: 1,
            applicant_email_id: fetchedMailData.senderEmail,
            mail_message_id: fetchedMailData.mail_message_id,
            grievance_mail_subject: fetchedMailData.subject,
            grievance_mail_body: fetchedMailData.body,
            attached_docx: fetchedMailData.attachments,
            applicant_name: fetchedMailData.senderName,
            applicant_gender: null,
            applicant_regno: null,
            applicant_district_code: null,
            applicant_state_code: null,
            applicant_country_code: null,
            grievance_subject_id: null,
            grievance_dept_code: null,
            internal_remark: 'NA',
            grievance_entry_date: new Date(fetchedMailData.date),
            ip: '::1',
            creater_id: 'tester1@gmail.com',
            grievance_from: null,
            mail_ref_id: fetchedMailData.mailrefId,
            attached_docs: fetchedMailData.attached_docs
        });
        // Send a success response with the newly created row
        //res.status(201).json({ message: 'Grievance entry created successfully', data: newGrievanceEntry });
        //console.log("in -- newGrievanceEntry", newGrievanceEntry)
        return newGrievanceEntry;
    } catch (error) {
        //console.log("in error-- newGrievanceEntry", error)
        // If an error occurs, send an error response
        //console.error('Error creating grievance entry:', error);
        return error;
    }
}

module.exports =
{
    createGrievanceEntry
};


