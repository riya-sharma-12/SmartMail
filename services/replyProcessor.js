// services/replyProcessor.js
const { Op, where } = require('sequelize');
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
      order: [['received_at', 'DESC']],

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
      const checkResp = await Reply.findOne({ where: { resp_id: email.resp_id } });
      if(checkResp) return 1;
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