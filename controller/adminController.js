const { Email, Reply } = require('../models/index');
const { Op } = require('sequelize');
const { default: ollama } = require('ollama');
const { response } = require('express');
const { tr } = require('date-fns/locale');
const modelName = 'llama3.2';
const getAllEmails = async (req, res) => {
  try {
    const emails = await Email.findAll({
  include: [{
    model: Reply
  }],
      order: [['received_at', 'DESC']]
    });

    const formatted = emails.map(email => {
  const firstReply = email.Reply || {}; 
      return {
        email_token: email.resp_id,  
        from_email: email.from_email,
        'email-subject': email.subject,
        'email-body': email.body,
        'email-category': email.category,
        email_status: email.status,
        email_created_at: email.created_at,
        email_received_at: email.received_at,
        reply_id: firstReply.reply_id, 
        llm_reply: firstReply.llm_reply || '',
        final_reply: firstReply.final_reply || '',
        email_replied_at: firstReply.replied_at || ''
      };
    });

    res.status(200).json({ msg: 'Emails fetched successfully!', allGrievances: formatted });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Failed to fetch emails.' });
  }
};

const getAllEmailsBySubjs = async (req, res) => {
  try {
    const {emailSubject} = req.body;
    if(!emailSubject) res.status(400).json({ msg: 'Email Subject Not Found!', success: false });
    const emails = await Email.findAll({
  include: [{
    model: Reply
  }],
  where: {
    subject: {
      [Op.iLike]: `%${emailSubject}%`
    }
  },
      order: [['received_at', 'DESC']]
    });

    const formatted = emails.map(email => {
  const firstReply = email.Reply || {}; 
      return {
        id:email.resp_id,
        email_token: email.resp_id,  
        from_email: email.from_email,
        'email-subject': email.subject,
        'email-body': email.body,
        'email-category': email.category,
        email_status: email.status,
        email_created_at: email.created_at,
        email_received_at: email.received_at,
        llm_reply: firstReply.llm_reply || '',
        final_reply: firstReply.final_reply || '',
        email_replied_at: firstReply.replied_at || ''
      };
    });

    res.status(200).json({ msg: 'Emails fetched successfully!', allGrievances: formatted });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Failed to fetch emails.' });
  }
};



// const getAllEmailsBySubjs = async (req, res) => {
//   try {
//     const { emailSubject } = req.body;

//     if (!emailSubject) {
//       return res.status(400).json({ msg: 'Search term is missing!', success: false });
//     }

//     const searchPattern = `%${emailSubject}%`;

//     const emails = await Email.findAll({
//       include: [{
//         model: Reply,
//         required: false,
//         where: {
//           [Op.or]: [
//             { llm_reply: { [Op.iLike]: searchPattern } },
//             { final_reply: { [Op.iLike]: searchPattern } }
//           ]
//         }
//       }],
//       where: {
//         [Op.or]: [
//           { subject: { [Op.iLike]: searchPattern } },
//           { body: { [Op.iLike]: searchPattern } },
//           { category: { [Op.iLike]: searchPattern } },
//           { from_email: { [Op.iLike]: searchPattern } }
//         ]
//       },
//       order: [['received_at', 'DESC']]
//     });

//     const formatted = emails.map(email => {
//       const reply = email.Reply || {};
//       return {
//         id: email.resp_id,
//         email_token: email.resp_id,
//         from_email: email.from_email,
//         'email-subject': email.subject,
//         'email-body': email.body,
//         'email-category': email.category,
//         email_status: email.status,
//         email_created_at: email.created_at,
//         email_received_at: email.received_at,
//         llm_reply: reply.llm_reply || '',
//         final_reply: reply.final_reply || '',
//         email_replied_at: reply.replied_at || ''
//       };
//     });

//     return res.status(200).json({
//       success: true,
//       msg: 'Search successful!',
//       emails: formatted
//     });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ msg: 'Server error', success: false });
//   }
// };
const botChat = async (req, res) => {
  try{
  const {userPrompt} = req.body;
  const stream = await ollama.generate({ model: modelName, prompt:userPrompt, stream: true });
  let reply = '';
  // console.log("chucking")
  for await (const chunk of stream){ 
    //res.write(chunk.response)
    reply += chunk.response;
  }
  return res.status(200).json({ msg: 'Bot Responce', success:true, response: reply });
  }catch (error) {
    console.error('Error in botChat:', error);
    res.status(500).json({ error: 'Failed to Generate Response.' });
  }
}

module.exports = { getAllEmails, getAllEmailsBySubjs, botChat };