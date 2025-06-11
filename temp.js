// const { simpleParser } = require('mailparser');
// const { format } = require('date-fns');
// const Imap = require('imap');
// const { saveEmailToDB } = require('../services/emailService');

// const imapConfig = {
//   user: process.env.EMAIL_USER,
//   password: process.env.EMAIL_PASS,
//   host: 'imap.gmail.com',
//   port: 993,
//   tls: true,
//   tlsOptions: {
//     rejectUnauthorized: false
//   }
// };

// const imap = new Imap(imapConfig);

// function emailController() {
//   imap.once('ready', () => {
//     imap.openBox('INBOX', false, (err, box) => {
//       if (err) throw err;

//       const today = format(new Date(), 'dd-MMM-yyyy');

//       imap.search(['UNSEEN', ['ON', today]], (err, results) => {
//         if (err) throw err;

//         if (!results || results.length === 0) {
//           console.log('No new emails for today.');
//           imap.end();
//           return;
//         }

//         const fetch = imap.fetch(results, { bodies: '' });

//         fetch.on('message', (msg) => {
//           let rawData = '';

//           msg.on('body', (stream) => {
//             stream.on('data', (chunk) => {
//               rawData += chunk.toString('utf8');
//             });
//           });

//           msg.once('end', async () => {
//             const parsed = await simpleParser(rawData);
//             console.log('\n--- New Email ---');
//             console.log('From:', parsed.from.text);
//             console.log('Subject:', parsed.subject);
//             console.log('Date:', parsed.date);
//             console.log('Body:', parsed.text?.slice(0, 300) || '[No Text]');

//             const emailData = {
//               from_email: parsed.from.text,
//               subject: parsed.subject || '[No Subject]',
//               body: parsed.text || '[No Body]',
//               category: 'New', 
//               status: 0, 
//               created_at: new Date(),
//               received_at: parsed.date || new Date()
//             };

//             // Save to DB
//             await saveEmailToDB(emailData);
//           });
//         });

//         fetch.once('end', () => {
//           console.log('\nAll new emails fetched for today.');
//           imap.end();
//         });
//       });
//     });
//   });

//   imap.once('error', (err) => {
//     console.error('IMAP error:', err);
//   });

//   imap.once('end', () => {
//     console.log('IMAP connection closed.');
//   });

//   imap.connect();
// }

// module.exports = { emailController };