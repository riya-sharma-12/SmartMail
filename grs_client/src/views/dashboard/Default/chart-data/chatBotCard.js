// import { useState, useRef, useEffect } from 'react';
// import {
//   Box,
//   Button,
//   Card,
//   TextField,
//   Typography,
//   CircularProgress,
//   Paper
// } from '@mui/material';
// import axios from 'axios';

// const ChatBotCard = () => {
//   const [userInput, setUserInput] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   const handleSend = async () => {
//     if (!userInput.trim()) return;

//     const userMessage = { sender: 'user', text: userInput };
//     setMessages((prev) => [...prev, userMessage]);
//     setUserInput('');
//     setLoading(true);

//     try {
//       const response = await axios.post('http://localhost:5000/api/admin/botChat', {
//         userPrompt: userInput
//       });

//       const botText = response.data?.success
//         ? response.data.response
//         : 'Something went wrong with the bot.';

//       const botMessage = { sender: 'bot', text: botText };
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       setMessages((prev) => [...prev, { sender: 'bot', text: 'Error connecting to chatbot API.' }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Scroll to bottom on new message
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   return (
//     <Card
//       variant="outlined"
//       sx={{
//         position: 'fixed',
//         bottom: 20,
//         right: 20,
//         width: 360,
//         height: 500,
//         display: 'flex',
//         flexDirection: 'column',
//         boxShadow: 3,
//         zIndex: 1300
//       }}
//     >
//       <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
//         <Typography variant="h6">ChatBot Assistant</Typography>
//       </Box>

//       {/* Chat Area */}
//       <Box
//         sx={{
//           flexGrow: 1,
//           overflowY: 'auto',
//           p: 2,
//           bgcolor: '#fafafa'
//         }}
//       >
//         {messages.map((msg, idx) => (
//           <Paper
//             key={idx}
//             elevation={1}
//             sx={{
//               mb: 1,
//               p: 1.5,
//               maxWidth: '80%',
//               alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
//               bgcolor: msg.sender === 'user' ? '#1976d2' : '#e0e0e0',
//               color: msg.sender === 'user' ? 'white' : 'black',
//               borderRadius: msg.sender === 'user'
//                 ? '16px 16px 0 16px'
//                 : '16px 16px 16px 0'
//             }}
//           >
//             <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
//               {msg.text}
//             </Typography>
//           </Paper>
//         ))}
//         <div ref={messagesEndRef} />
//       </Box>

//       {/* Input Area */}
//       <Box sx={{ p: 2, borderTop: '1px solid #eee' }}>
//         <TextField
//           fullWidth
//           variant="outlined"
//           placeholder="Ask something..."
//           multiline
//           rows={2}
//           value={userInput}
//           onChange={(e) => setUserInput(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === 'Enter' && !e.shiftKey) {
//               e.preventDefault();
//               handleSend();
//             }
//           }}
//           disabled={loading}
//         />
//         <Box sx={{ mt: 1, textAlign: 'right' }}>
//           <Button variant="contained" onClick={handleSend} disabled={loading || !userInput.trim()}>
//             {loading ? <CircularProgress size={20} color="inherit" /> : 'Send'}
//           </Button>
//         </Box>
//       </Box>
//     </Card>
//   );
// };

// export default ChatBotCard;
import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  CircularProgress,
  Paper
} from '@mui/material';
import axios from 'axios';

const ChatBotCard = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!userInput.trim()) return;
    setMessages((prev) => [...prev, { sender: 'user', text: userInput }]);
    setUserInput('');
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/admin/botChat', { userPrompt: userInput });
      const botText = data.success ? data.response : 'Something went wrong with the bot.';
      setMessages((prev) => [...prev, { sender: 'bot', text: botText }]);
    } catch {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Error connecting to chatbot API.' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Card
      variant="outlined"
      sx={{
        maxHeight: '60vh',           // <— fill the grid cell
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
        <Typography variant="h6">ChatBot Assistant</Typography>
      </Box>

      {/* Message List */}
      <Box
         sx={{
            minHeight:'30vh',
    flex: 1,                   // take up remaining space
    overflowY: 'auto',         // enable vertical scroll
    p: 2,
    bgcolor: '#fafafa',
    display: 'flex',
    flexDirection: 'column'
  }}
      >
        {messages.map((msg, i) => (
          <Paper
            key={i}
            elevation={1}
            sx={{
              mb: 1,
              p: 1.5,
              maxWidth: '80%',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              bgcolor: msg.sender === 'user' ? '#1976d2' : '#e0e0e0',
              color: msg.sender === 'user' ? 'white' : 'black',
              borderRadius:
                msg.sender === 'user'
                  ? '16px 16px 0 16px'
                  : '16px 16px 16px 0'
            }}
          >
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {msg.text}
            </Typography>
          </Paper>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box sx={{ p: 2, borderTop: '1px solid #eee' }}>
        <TextField
          fullWidth
          multiline
          rows={2}
          placeholder="Ask something..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={loading}
        />
        <Box sx={{ mt: 1, textAlign: 'right' }}>
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={loading || !userInput.trim()}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Send'}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default ChatBotCard;
