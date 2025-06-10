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