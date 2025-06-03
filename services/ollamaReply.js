// services/ollamaReply.js
const { default: ollama } = require('ollama');
const modelName = 'llama3.2:3b';

async function generateReply(prompt) {
  console.log("streaming")
  const stream = await ollama.generate({ model: modelName, prompt:prompt, stream: true });
  let reply = '';
  // console.log("chucking")
  for await (const chunk of stream){ reply += chunk.response;
  }
  console.log("reply", reply)
  return reply;          // <-- important
}

module.exports = { generateReply };


// // services/ollamaReply.js
// const { spawn } = require('child_process');

// /**
//  * Ask the local Ollama model for a reply.
//  * @param {string} prompt - plain-text prompt (no manual escaping needed)
//  * @param {number} timeoutMs - kill the process if it exceeds this time
//  * @returns {Promise<string|null>} trimmed LLM text or null on error
//  */
// async function generateReply(prompt, timeoutMs = 60_000) {
//   console.log("started")
//   return new Promise((resolve) => {
//     const child = spawn('ollama', ['run', 'llama3.2', "white a mail for resignation."], {
//       stdio: ['ignore', 'pipe', 'pipe']
//     });

//     let stdout = '';
//     let stderr = '';

//     const timer = setTimeout(() => {
//       child.kill('SIGKILL');
//       console.error('Ollama timed out');
//       resolve(null);
//     }, timeoutMs);

//     child.stdout.on('data', (data) => (stdout += data));
//     child.stderr.on('data', (data) => (stderr += data));

//     child.on('close', (code) => {
//       clearTimeout(timer);
//       if (code !== 0) {
//         console.error('Ollama error:', stderr.trim() || `exit code ${code}`);
//         return resolve(null);
//       }
//       console.log(stdout.trim());
//       resolve(stdout.trim());
//     });
//   });
//   console.log("after promise")
// }
// const getResp = async () =>{
//   const rest = await generateReply();
//   console.log("rest", rest); 
// }
// console.log(getResp());
// module.exports = { generateReply };


// const { exec } = require('child_process');

// async function generateReply(prompt) {
//   return new Promise((resolve, reject) => {
//     exec(`ollama run llama3 "${prompt}"`, (error, stdout, stderr) => {
//       if (error) {
//         console.error('Ollama error:', stderr);
//         return resolve(null);
//       }
//       resolve(stdout.trim());
//     });
//   });
// }

// module.exports = { generateReply };
