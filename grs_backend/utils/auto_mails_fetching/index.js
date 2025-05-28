const fs = require('fs');
const path = require('path');
const Imap = require('node-imap');
const { simpleParser } = require('mailparser');
const moment = require('moment');
const { user_mail } = process.env;
const { sendConfirmationMail } = require('./sendGriMailRecConfirm');
const { date } = require('yup');
const { generateUUID } = require('../commonFunc');

// import Controller
const { createGrievanceEntry } = require('../../controllers/AutoMailsFetched/index');

////console.log("user_mail",user_mail)

// Function to fetch emails received in the last 2 minutes
function fetchEmails() {
    try {

        const connection = new Imap({
            user: '', // email-id
            password: '', // email-password
            host: 'imap.gmail.com',
            port: 993,
            tls: true
        });

        // Connect to the IMAP server
        connection.connect();


        function openInbox(cb) {
            connection.openBox('INBOX', true, cb);
        }

        connection.once('ready', () => {
            openInbox((err, box) => {
                if (err) {
                    //console.error('Error opening mailbox:', err);
                    return;
                }
                const currentTime = moment(); // Current date and time
                const sinceDate = currentTime.format('MMM DD, YYYY');
                const searchCriteria = [['SINCE', sinceDate]];
                console.log("searchCriteria", searchCriteria);

                // Search for emails based on the criteria
                connection.search(searchCriteria, (err, results) => {
                    if (err) {
                        //console.error('Error searching for emails:', err);
                        // Handle the error here, for example:
                        if (err.message === 'Nothing to fetch') {
                            //console.log('No new emails to fetch.');
                            connection.end(); // End the connection gracefully
                        } else {
                            // Handle other types of errors as needed
                        }
                        return;
                    }

                    // Proceed with fetching emails if there are results
                    if (results.length === 0) {
                        //console.log('No new emails to fetch.');
                        connection.end(); // End the connection gracefully
                        return;
                    }

                    // Array to store email data
                    const emails = [];
                    let currentDate = new Date();

                    // Subtract one minute
                    currentDate.setMinutes(currentDate.getMinutes() - 2);

                    const oneMinuteAgo = currentDate.toLocaleTimeString();
                    console.log("oneMinuteAgo", oneMinuteAgo)

                    // Process each message
                    const fetch = connection.fetch(results, { bodies: '' });
                    fetch.on('message', async (msg, seqno) => {
                        ////console.log('Message #%d', seqno);
                        const prefix = '(#' + seqno + ') ';

                        // Initialize an empty string to store the message body
                        let body = '';

                        // Initialize a variable to store the message ID
                        let messageId;
                        let mailDateTime;
                        let mailrefId;
                        let attachments;

                        // Process the message body
                        msg.on('body', (stream, info) => {
                            // Collect the body chunks
                            stream.on('data', (chunk) => {
                                body += chunk.toString('utf8');
                            });

                            // When the body stream ends, parse the email
                            stream.on('end', async () => {
                                // Pass the collected body to simpleParser
                                const parsed = await simpleParser(body);
                                //console.log("parsed mail -->", parsed);
                                // Accessing the 'date' property
                                const mailDate = parsed.headers.get('date');
                                //console.log("mailDate", mailDate);
                                mailDateTime = new Date(mailDate).toLocaleTimeString();
                                console.log("mailDate", mailDateTime);
                                // Get the Message-ID from the email headers
                                messageId = parsed.messageId;
                                mailrefId = parsed.references;
                                attachments = parsed.attachments;
                                // Extract sender's name and email from the "From" field
                                const fromField = parsed.from.text;
                                let senderName = fromField;
                                ////console.log("fromField", fromField)
                                const match = fromField.match(/"([^"]+)"\s*</); // Extracts text within double quotes
                                ////console.log("match", match)
                                if (match) {
                                    senderName = match[1]; // Extracted sender's name
                                    senderEmail = parsed.from.value[0].address; // Extracted sender's email
                                } else {
                                    // If no name found within double quotes, use the entire "From" field
                                    senderEmail = parsed.from.value[0].address; // Extracted sender's email
                                }

                                if (mailDateTime >= oneMinuteAgo) {
                                    console.log("parsed mail -->", "parsed", "--------mailrefId----------", mailrefId);
                                    const attached_docs = []
                                    if (mailrefId) {
                                        if (Array.isArray(mailrefId)) { mailrefId = mailrefId[0] }
                                    }
                                    if (Array.isArray(attachments)) {
                                        // Assuming 'attachments' is an array containing attachment objects
                                        console.log("inside attachments")
                                        try {
                                            attachments.forEach((attachment) => {
                                                //const filename = attachment.filename; // Get the filename
                                                const extension = path.extname(attachment.filename);
                                                const filename = generateUUID() + extension;
                                                const content = attachment.content; // Get the content of the attachment

                                                // Specify the directory where you want to save the attachments
                                                const directory = path.join(__dirname, '..', 'assets/mail_attachments/');

                                                // Create a file path for the attachment

                                                const filePath = directory + filename;
                                                attached_docs.push(filename);
                                                // Write the content to the file
                                                fs.writeFile(filePath, content, (err) => {
                                                    if (err) {
                                                        console.error('Error saving attachment:', err);
                                                    } else {
                                                        console.log('Attachment saved successfully:', filename);
                                                    }
                                                });

                                            });
                                        }
                                        catch (err) {
                                            console.log("Error inside File Upload", err)
                                        }
                                    }
                                    // Extract relevant information
                                    console.log("mail-ref-id", mailrefId, attached_docs);
                                    const emailData = {
                                        mail_message_id: messageId,
                                        mailrefId, mailrefId,
                                        senderName: senderName,
                                        senderEmail: parsed.from.value[0].address,
                                        subject: parsed.subject,
                                        body: parsed.text.replace(/[\n\r]/g, ' '), // Replace newline characters with space
                                        attachments: parsed.attachments.length,
                                        date: parsed.date,
                                        attached_docs: attached_docs,
                                        link: `https://mail.google.com/mail/u/0/#inbox/${messageId}`

                                    };
                                    // Push email data to the array
                                    ////console.log("e", emails, emailData);
                                    //console.log("count")

                                    // save into db...
                                    createGrievanceEntry(emailData);

                                    // Sending confirmation email...
                                    sendConfirmationMail(emailData.senderEmail, emailData.link);

                                    // Push email data to the array
                                    emails.push({ ...emailData });
                                }

                            });

                        });

                        // Once the attributes are available, generate the link using Message-ID
                        msg.once('attributes', (attrs) => {
                            if (messageId) {
                                // Generate the link to the email using the Message-ID
                                const link = `https://mail.google.com/mail/u/0/#inbox/${messageId}`;
                                ////console.log(prefix + 'Link:', link);
                            }
                        });
                    });



                    fetch.once('error', (err) => {
                        //console.log('Fetch error:', err);
                    });

                    fetch.once('end', async () => {
                        // Wait for all promises to resolve
                        await Promise.all(emails.map(async (emailData) => {
                            // Sending confirmation email...
                            //const sendConfirmation = await sendConfirmationMail(emailData.senderEmail, emailData.caseId, emailData.link);
                            //console.log("Confirmation email sent:");
                        }));

                        // Save emails as JSON file
                        fs.writeFileSync('emails.json', JSON.stringify(emails, null, 2));

                        // End connection
                        connection.end();
                    });
                });
            });
        });

        connection.once('error', (err) => {
            //console.error('IMAP connection error:', err);
            connection.end();
        });

        connection.once('end', () => {
            //console.log('IMAP connection ended');
        });
    }
    catch (err) {
        console.log("error inside fetch mail", err);
    }

}

module.exports = {
    fetchEmails
}