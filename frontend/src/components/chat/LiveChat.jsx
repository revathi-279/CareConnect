import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send } from 'lucide-react';
import api from '../../services/api';

// Point to your backend URL
// const socket = io('http://localhost:5000'); 

const socket = io('https://your-backend-app-name.onrender.com');

const LiveChat = ({ bookingId, currentUser, initialChatHistory = [] }) => {
  const [messages, setMessages] = useState(initialChatHistory);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Join the private socket room for this specific booking
    socket.emit('join_job_room', bookingId);

    // Listen for incoming messages
    socket.on('receive_message', (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [bookingId]);

  useEffect(() => {
    // Auto-scroll to bottom on new message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const messageData = {
      bookingId,
      senderId: currentUser._id,
      senderName: currentUser.name,
      text: input,
      timestamp: new Date().toISOString()
    };

    // 1. Instantly show it on our screen (Optimistic UI)
    // 2. Emit via socket to the other user
    // 3. Save to database for permanence
    socket.emit('send_message', messageData);
    
    try {
      await api.post(`/bookings/${bookingId}/chat`, messageData);
    } catch (err) {
      console.error('Failed to save message to DB', err);
    }

    setInput('');
  };

  return (
    <div className="flex flex-col h-[400px] bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="bg-primary px-4 py-3 text-white font-bold text-sm flex items-center justify-between">
        Live Job Chat
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-xs text-gray-400 mt-10">No messages yet. Say hello!</div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderId === currentUser._id;
            return (
              <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-gray-500 mb-0.5 px-1">{msg.senderName}</span>
                <div className={`px-3.5 py-2 rounded-2xl max-w-[85%] text-sm ${isMe ? 'bg-primary text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-200 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message provider..."
          className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button type="submit" disabled={!input.trim()} className="bg-primary hover:bg-primary-hover disabled:opacity-50 text-white p-2 rounded-lg transition-colors">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default LiveChat;