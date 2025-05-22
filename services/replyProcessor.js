// services/replyProcessor.js
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');
const { startOfDay, endOfDay } = require('date-fns');
const {Email, Reply} = require('../models/index');
const db = require('../config/db');
const { generateReply } = require('./ollamaReply');

async function processReplies(batchSize = 5) {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  // Step 1: Get today's emails that don’t already have a reply
  // const emails = await Email.findAll({
  //   where: {
  //     received_at: {
  //       [Op.between]: [todayStart, todayEnd],
  //     },
  //     resp_id: {
  //       [Op.notIn]: db.literal(`(SELECT resp_id FROM replies)`),
  //     },
  //   },
  // });

  let emails = await Email.findAll({
  where: {
    received_at: {
      [Op.between]: [todayStart, todayEnd],
    },
  },
  include: [{
    model: Reply,
    required: false, // LEFT JOIN
    where: {
      resp_id: null,  // Only include where Reply doesn't exist
    },
  }],
});


  if (emails.length === 0) {
    console.log('No new emails to process for today.');
    return;
  }

  console.log(`Found ${emails.length} emails to draft replies for.`);
  // emails = [emails[0]];
  // Step 2: Generate and save replies
  const drafts = await Promise.allSettled(
    emails.map(async (email) => {
      const prompt = `
You are an assistant who drafts email replies for Riya (the recipient).
Read the incoming email between the <<EMAIL>> markers,
then write a short, polite reply **from Riya's perspective**.
Do NOT repeat the original text.
End your draft with "<END_REPLY>".

<<EMAIL>>
Subject: ${email.subject}

${email.body}
<<EMAIL>>

Draft reply:
`.trim();

      const llm = await generateReply(prompt);
   
      if (!llm) throw new Error('LLM returned null');
      // console.log(prompt);
      const replyText = llm.split('<END_REPLY>')[0].trim();
      const reply_id = uuidv4();

      await Reply.create({
  llm_reply: replyText,
  final_reply: replyText,
  resp_id: email.resp_id,
  org_id: email.org_id,
  reply_id: reply_id,
});


      console.log(`✅ Reply saved for subject: ${email.subject}`);
      return email.subject;
    })
  );

  // Step 3: Log results
  drafts.forEach((d) => {
    if (d.status === 'fulfilled') {
      console.log(`✔️ Drafted for: ${d.value}`);
    } else {
      console.error('❌ Failed:', d.reason.message);
    }
  });
}

module.exports = { processReplies };



// // services/replyProcessor.js
// const db = require('../config/db');
// const { generateReply } = require('./ollamaReply');   
// const { v4: uuidv4 } = require('uuid');
// const Email = require('../models/email');
// const { Op } = require('sequelize');
// //console.log("email", Email)

// async function processReplies(batchSize = 5) {
//   // 1. fetch only top-priority mails that don’t have a reply yet
//   // const { rows: emails } = await db.query(
//   //   `SELECT resp_id, org_id, subject, body
//   //      FROM emails
//   //     ORDER BY received_at
//   //     LIMIT $1`,
//   //   [batchSize]
//   // );
// // const { startOfDay, endOfDay } = require('date-fns');   // handy helper
// // const todayStart = startOfDay(new Date());              // 00:00 today
// // const todayEnd   = endOfDay(new Date());                // 23:59:59 today

// // const { rows: emails } = await db.query(
// //   `
// //   SELECT resp_id, org_id, subject, body
// //     FROM emails
// //    WHERE received_at >= $1
// //      AND received_at <= $2
// //      AND resp_id NOT IN (SELECT resp_id FROM replies)
// //    ORDER BY received_at
// //   `,
// //   [todayStart, todayEnd]
// // );

// //   const { rows: emails } = await db.query(
// //   `SELECT resp_id, org_id, subject, body
// //      FROM emails
// //     ORDER BY received_at
// //     LIMIT 1`
// // );

// const emails = await Email.findAll({
//   where: {
//     received_at: {
//       [Op.gte]: new Date() 
//     }
//   }
// });
//   console.log("started replies",emails);
//   // 2. draft replies in parallel (small pool to avoid CPU spikes)
//   const drafts = await Promise.allSettled(
//     emails?.map(async (email) => {
// const prompt = `
// You are an assistant who drafts email replies for Riya (the recipient).
// Read the incoming email between the <<EMAIL>> markers,
// then write a short, polite reply **from Riya's perspective**.
// Do NOT repeat the original text.
// End your draft with "<END_REPLY>".

// <<EMAIL>>
// Subject: ${email.subject}

// ${email.body}
// <<EMAIL>>

// Draft reply:
// `.trim();
//       console.log("llm started",prompt);

//       const llm = await generateReply(prompt);
//       const cleanedReply = llm.split("©")[0].trim();
//       console.log("LLM reply:", cleanedReply);
//       if (!llm) throw new Error('LLM returned null');
//       const replyText = llm.split('<END_REPLY>')[0].trim();

//       const reply_id = uuidv4();
//       // 3. insert – let reply_id default, let replied_at default
//       try {
//   await db.query(
//     `INSERT INTO replies (llm_reply, final_reply, resp_id, org_id, reply_id)
//      VALUES ($1, $1, $2, $3, $4)`,
//     [replyText, replyText, email.resp_id, email.org_id, reply_id]
//   );
//   console.log('Inserted reply_id', reply_id);
// } catch (e) {
//   console.error('DB insert error:', e.message);
// }
//       return email.subject;        // for logging
//     })
//   );

//   // 4. log results
//   drafts.forEach((d) => {
//     if (d.status === 'fulfilled') {
//       console.log(`saved reply for "${d.value}"`);
//     } else {
//       console.error('failed:', d.reason.message);
//     }
//   });
// }

// module.exports = { processReplies };

