/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';

const MessageList = ({ messages, currentChannel, newMessage }) => {
  const messagesBoxRef = useRef(null);
  const isUserScrollingMessages = useRef(false);

  const handleScrollMessages = () => {
    const { scrollTop, scrollHeight, clientHeight } = messagesBoxRef.current;
    if (scrollTop + clientHeight !== scrollHeight) {
      isUserScrollingMessages.current = true;
    } else {
      isUserScrollingMessages.current = false;
    }
  };

  useEffect(() => {
    if (!isUserScrollingMessages.current && messagesBoxRef.current) {
      const { scrollHeight, clientHeight } = messagesBoxRef.current;
      messagesBoxRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (messagesBoxRef.current && messages.length > 0) {
      const { scrollHeight, clientHeight } = messagesBoxRef.current;
      messagesBoxRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [currentChannel, messages]);

  useEffect(() => {
    if (messagesBoxRef.current && newMessage) {
      const { scrollHeight, clientHeight } = messagesBoxRef.current;
      messagesBoxRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [newMessage]);

  return (
    <div id="messages-box" className="chat-messages overflow-auto px-4 py-3" style={{ flex: 1, overflowY: 'auto' }} ref={messagesBoxRef} onScroll={handleScrollMessages}>
      {messages
        .filter((msg) => msg.channelId === currentChannel)
        .map((message) => (
          <div key={message.id} className="text-break mb-2">
            <strong>{message.username}:</strong>
            {` ${message.body}`}
          </div>
        ))}
    </div>
  );
};

export default MessageList;
