import { FaCommentDots } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ChatbotButton = () => {
  const navigate = useNavigate();
  return (
     <div
    className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-[#5D5FEF] to-[#7577F5] rounded-full flex items-center justify-center text-2xl shadow-xl hover:scale-110 hover:rotate-[15deg] hover:shadow-2xl transition-all z-20"
    id="chatbotButton"
    title="Chat with our fitness Chat Bot"
    onClick={()=>{navigate('/chat');}}
  >
    <FaCommentDots className="text-white animate-[pulse_2s_infinite]" />
  </div>
  );
};

export default ChatbotButton;