const { Email, Reply, Organization } = require('../models');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

// Save or update reply
async function saveReply(req, res) {
  const { reply_id, resp_id, final_reply } = req.body;

  if (!resp_id?.trim() || !final_reply?.trim()) {
    return res.status(400).json({ success: false, msg: 'Missing required fields' });
  }

  try {
    let existingReply = reply_id ? await Reply.findOne({ where: { reply_id } }) : null;

    if (existingReply) {
      // Update
      existingReply.final_reply = final_reply;
      await existingReply.save();
      return res.status(200).json({ success: true, msg: 'Reply updated successfully', reply_id });
    } else {
      // Insert
      const email = await Email.findOne({ where: { resp_id } });
      if (!email) {
        return res.status(404).json({ success: false, msg: 'Email not found for given resp_id' });
      }

      const newReply = await Reply.create({
        reply_id: uuidv4(),
        llm_reply: 'NA',
        final_reply,
        replied_at: new Date(),
        resp_id: email.resp_id,
        org_id: '11111111-1111-1111-1111-111111111111' // Replace with actual org_id if dynamic
      });

      return res.status(201).json({ success: true, msg: 'Reply created successfully', reply_id: newReply.reply_id });
    }
  } catch (err) {
    console.error('Error in saveReply:', err.message);
    return res.status(500).json({ success: false, msg: 'Error saving reply', error: err.message });
  }
}

// Extract email from "Name <email@example.com>" format
const extractEmailAddress = (fullFromField) => {
  const match = fullFromField.match(/<([^>]+)>/);
  return match ? match[1] : fullFromField;
};

// Decrypt app password
const decrypt = (encrypted) => {
  return crypto.createDecipher('aes-256-ctr', process.env.JWT_SECRET).update(encrypted, 'hex', 'utf8');
};

// Send reply via email
const sendReplyEmail = async (req, res) => {
  try {
    const { reply_id, resp_id } = req.body;

    const reply = await Reply.findOne({ where: { reply_id } });
    const email = await Email.findOne({ where: { resp_id } });

    if (!reply || !email) {
      return res.status(404).json({ message: 'Reply or Email not found' });
    }

    const fromEmail = extractEmailAddress(email.from_email);
    const org = await Organization.findOne({ where: { org_id: reply.org_id } });

    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const userEmail = org.email;
    const decryptedAppPassword = decrypt(org.gmail_app_password);

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: userEmail,
        pass: decryptedAppPassword
      }
    });

    const mailOptions = {
      from: userEmail,
      to: fromEmail,
      subject: email.subject,
      text: reply.final_reply,
      inReplyTo: email.email_message_id,
      references: email.email_message_id
    };

    const info = await transporter.sendMail(mailOptions);

    email.status = 1;
    if (info?.messageId) email.email_message_id = info.messageId;
    await email.save();

    return res.status(200).json({
      message: 'Reply sent successfully.',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error replying to email:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { saveReply, sendReplyEmail };


// const { Reply, Email } = require('../models');
// const { sendMail } = require('../utils/emailSender');
// const nodemailer = require('nodemailer');

// const { v4: uuidv4 } = require('uuid'); 

// async function saveReply(req, res) {
//   let { reply_id, resp_id, final_reply } = req.body;

//   if (!resp_id?.trim() || !final_reply?.trim()) {
//   return res.status(400).json({ success: false, msg: 'Missing required fields' });
// }

//   try {
//     let existingReply = null;

//     if (reply_id) {
//       existingReply = await Reply.findOne({ where: { reply_id } });
//     }

//     if (existingReply) {
//       // Update case
//       existingReply.final_reply = final_reply;
//       await existingReply.save();
//       return res.status(200).json({ success: true, msg: 'Reply updated successfully', reply_id });
//     } else {
//       // Insert case — generate reply_id now
//       reply_id = uuidv4();
//       const llm_reply = 'NA';

//       const email = await Email.findOne({ where: { resp_id } });

//       if (!email) {
//         return res.status(404).json({ success: false, msg: 'Email not found for given resp_id' });
//       }

//       const newReply = await Reply.create({
//         llm_reply,
//         final_reply,
//         replied_at: new Date(),
//         resp_id: email.resp_id,
//         org_id: '11111111-1111-1111-1111-111111111111' ?? null,
//         reply_id
//       });

//       return res.status(201).json({ success: true, msg: 'Reply created successfully', reply_id });
//     }
//   } catch (err) {
//     console.error('Error in saveReply:', err.message);
//     return res.status(500).json({ success: false, msg: 'Error saving reply', error: err.message });
//   }
// }



// const extractEmailAddress = (fullFromField) => {
//   const match = fullFromField.match(/<([^>]+)>/);
//   return match ? match[1] : fullFromField; // fallback if no <>
// };


// const sendReplyEmail = async (req, res) => {
//   try {
//     const { reply_id, resp_id } = req.body;
//     const reply = await Reply.findOne({ where: { reply_id: reply_id } });
//      const email = await Email.findOne({ where: { resp_id: resp_id } });
//      const fromEmailRaw = email.from_email; // e.g. "Amazon.in" <store-news@amazon.in>
//      const fromEmail = extractEmailAddress(fromEmailRaw);
//     // Setup Nodemailer transporter
//     const transporter = nodemailer.createTransport({
//       service: 'Gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       }
//     });
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: fromEmail,//originalEmail.from_email,
//       subject: email.subject,//`Re: ${originalEmail.subject}`,
//       text: reply.final_reply, //replyBody,
//       inReplyTo: email.email_message_id, // optional, if stored
//       references: email.email_message_id  // optional, for threading
//     };

//     const info = await transporter.sendMail(mailOptions);
//     email.status = 1;
//     if(info?.messageId) email.email_message_id=info?.messageId;
//     await email.save();
//     return res.status(200).json({
//       message: 'Reply sent successfully.',
//       messageId: info.messageId,
//     });
//   } catch (error) {
//     console.error('Error replying to email:', error);
//     return res.status(500).json({ message: 'Internal server error.' });
//   }
// };

// module.exports = { saveReply, sendReplyEmail };
