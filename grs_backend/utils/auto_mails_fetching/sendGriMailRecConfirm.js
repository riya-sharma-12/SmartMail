const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '', // email-id
        pass: '', // email-password
    }
});

// Email content with a professional template
const sendConfirmationMail = async (to, caseLink) => {
    const mailOptions = {
        from: '', // Sender email address
        to: to, // Recipient email address
        //cc: 'cc1@example.com, cc2@example.com', // CC email addresses
        subject: `Acknowledgement of Grievance Receipt`, // Email subject
        html: `
        <h1>Dear User,</h1>
        <p>We have received your grievance and appreciate you taking the time to reach out to us.</p>
        <p>Our team is actively working on resolving your issue with the utmost priority.</p>
        <p>Your Case ID number is: <strong>123456</strong>.</p>
        <p>Please keep this Case ID for your reference in any future communication regarding this matter.</p>
        <p>If you have any further questions or concerns, please feel free to contact us.</p>
        <h4>here is an access link: <a href='${caseLink}' target='_blank'>click here</a></h4>
        <br>
        <p>Thank you for choosing our services.</p>
        <br>
        <p>Best Regards,</p><p>Your Name</p><p>Your Position</p><p>Your Company Name</p>
    `
    };

    // Send email
    try {
        const info = await transporter.sendMail(mailOptions);
        //console.log('Email sent:', info.response);
        return 1; // Email sent successfully
    } catch (error) {
        //console.log('Error sending email:', error);
        return 0; // Failed to send email
    }

}

const sendGrievanceReplyMail = async (to, cc_ids, subject, grievance_token, mail_body, mail_message_id) => {
    let refID = '';
    if (mail_message_id) { refID = mail_message_id }
    const mailOptions = {
        from: '', // Sender email address
        to: to, // Recipient email address
        cc: cc_ids || '', // CC email addresses
        subject: subject, // Email subject
        text: mail_body,
        inReplyTo: refID, // Message ID of the original email
        references: refID, // Message ID of the original email
    };

    // Send email
    try {
        const info = await transporter.sendMail(mailOptions);
        //console.log('Email sent:', info.response);
        return 1; // Email sent successfully
    } catch (error) {
        //console.log('Error sending email:', error);
        return 0; // Failed to send email
    }

}

module.exports = {
    sendConfirmationMail,
    sendGrievanceReplyMail
}
