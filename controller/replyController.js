const { Reply, Email } = require('../models');
const { sendMail } = require('../utils/emailSender');
const nodemailer = require('nodemailer');



async function saveReply(req, res) {
  const { reply_id, final_reply } = req.body;

  if (!reply_id || !final_reply) {
    return res.status(400).json({ success: false, msg: 'Missing required fields' });
  }

  try {
    const updated = await Reply.update(
      { final_reply: final_reply },
      { where: { reply_id } }
    );

    if (updated[0] === 0) {
      return res.status(404).json({ success: false, msg: 'Reply not found' });
    }

    return res.status(200).json({ success: true, msg: 'Reply updated successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, msg: 'Error updating reply', error: err.message });
  }
}


const extractEmailAddress = (fullFromField) => {
  const match = fullFromField.match(/<([^>]+)>/);
  return match ? match[1] : fullFromField; // fallback if no <>
};


const sendReplyEmail = async (req, res) => {
  try {
    const { reply_id, resp_id } = req.body;
    const reply = await Reply.findOne({ where: { reply_id: reply_id } });
     const email = await Email.findOne({ where: { resp_id: resp_id } });
     const fromEmailRaw = email.from_email; // e.g. "Amazon.in" <store-news@amazon.in>
     const fromEmail = extractEmailAddress(fromEmailRaw);
    // Setup Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: fromEmail,//originalEmail.from_email,
      subject: email.subject,//`Re: ${originalEmail.subject}`,
      text: reply.final_reply, //replyBody,
      inReplyTo: email.email_message_id, // optional, if stored
      references: email.email_message_id  // optional, for threading
    };

    const info = await transporter.sendMail(mailOptions);
    email.status = 1;
    if(info?.messageId) email.email_message_id=info?.messageId;
    await email.save();
    return res.status(200).json({
      message: 'Reply sent successfully.',
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('Error replying to email:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { saveReply, sendReplyEmail };
