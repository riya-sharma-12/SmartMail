const { simpleParser } = require("mailparser");
const { format } = require("date-fns");
const Imap = require("imap");
const { Email, Organization } = require("../models/index");
const { saveEmailToDB } = require("../services/emailService");
const { categorizeEmail } = require("../services/categorizeEmails");
const { processReplies } = require("../services/replyProcessor");

function emailController(org_id, imap) {
  imap.once("ready", () => {
    imap.openBox("INBOX", false, (err, box) => {
      if (err) throw err;

      const today = format(new Date(), "dd-MMM-yyyy");

      imap.search(["UNSEEN", ["ON", today]], (err, results) => {
        if (err) throw err;

        if (!results || results.length === 0) {
          console.log("No new emails for today.");
          imap.end();
          return;
        }

        const fetch = imap.fetch(results, { bodies: "" });

        fetch.on("message", (msg) => {
          let rawData = "";

          msg.on("body", (stream) => {
            stream.on("data", (chunk) => {
              rawData += chunk.toString("utf8");
            });
          });

          msg.once("end", async () => {
            const parsed = await simpleParser(rawData);
            console.log("--------parsed----------", parsed?.messageId, parsed);
            console.log("\n--- New Email ---");
            console.log("From:", parsed.from.text);
            console.log("Subject:", parsed.subject);
            console.log("Date:", parsed.date);
            console.log("Body:", parsed.text?.slice(0, 300) || "[No Text]");

            const exists = await Email.findOne({
              where: { email_message_id: parsed?.messageId },
            });
            if (exists) {
              console.log(`Skipping duplicate email: ${parsed?.messageId}`);
              return;
            }

            const category = categorizeEmail({
              subject: parsed.subject || "",
              body: parsed.text || "",
            });
const parsedDate = new Date(parsed.date);
const receivedAt = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
            const emailData = {
              from_email: parsed.from.text,
              subject: parsed.subject || "[No Subject]",
              body: parsed.text || "[No Body]",
              category: category,
              status: 0,
              created_at: new Date(),
received_at: receivedAt,
              email_message_id: parsed?.messageId,
              org_id,
            };
            await saveEmailToDB(emailData, org_id);
          });
        });

        fetch.once("end", () => {
          console.log("\nAll new emails fetched for today.");
          imap.end();
        });
      });
    });
  });

  imap.once("error", (err) => {
    console.error("IMAP error:", err);
  });

  imap.once("end", () => {
    console.log("IMAP connection closed.");
  });

  imap.connect();
}

const fetchAllMails = async () => {
  const getALLOrgs = await Organization.findAll();
  if (!getALLOrgs) {
    console.error("getting error in fetchAllMails");
  }
  getALLOrgs.forEach((org) => {
    const userEmail = org?.email;
    const userPassword = org?.gmail_app_password;
    const imapConfig = {
      user: userEmail,
      password: userPassword,
      host: "imap.gmail.com",
      port: 993,
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false,
      },
    };
    const imap = new Imap(imapConfig);
    const org_id = org?.org_id;
    console.log('-------FetchAllMails: started at-------', new Date().toLocaleString());
    emailController(org_id, imap);
  });

  await processReplies(); 
};

// fetchAllMails();

module.exports = { fetchAllMails };
