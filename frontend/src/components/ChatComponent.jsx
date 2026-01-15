import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';

let stompClient = null;

const ChatComponent = ({ currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [connected, setConnected] = useState(false);
    const scrollRef = useRef();

    const myUsername = currentUser || 'Guest';
    const storageKey = `chat_history_${myUsername}`;

    useEffect(() => {
        const savedMessages = localStorage.getItem(storageKey);
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }

        connect();
        return () => { if (stompClient) stompClient.disconnect(); };
    }, [storageKey]);

    const connect = () => {
        const socket = new SockJS('http://localhost:8086/ws-chat');
        stompClient = over(socket);
        stompClient.connect({}, onConnected, (err) => console.error("Eroare WS: ", err));
    };

    const onConnected = () => {
        setConnected(true);
        const userChannel = `/topic/chat.${myUsername}`;
        stompClient.subscribe(userChannel, onMessageReceived);
        
        stompClient.subscribe("/topic/public", onMessageReceived);
    };

    const onMessageReceived = (payload) => {
        const payloadData = JSON.parse(payload.body);

        setMessages(prev => {
            const updated = [...prev, payloadData];
            localStorage.setItem(storageKey, JSON.stringify(updated.slice(-50)));
            return updated;
        });

        setTimeout(() => {
            if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }, 100);
    };

    const sendMessage = () => {
        if (stompClient && messageInput.trim() !== "") {
            const chatMessage = {
                sender: myUsername,
                content: messageInput,
                type: 'CHAT'
            };
            stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
            setMessageInput("");
        }
    };

    return (
        <div style={styles.chatContainer}>
            <div style={styles.header}>
                Support Center {connected ? "🟢" : "🔴"} | Logged as: {myUsername}
            </div>

            <div style={styles.messageArea} ref={scrollRef}>
                {messages.map((msg, index) => {

                    const isNotification = msg.type === 'NOTIFICATION';
                    const isBot = msg.sender === 'ChatBot';
                    const isMe = msg.sender === myUsername;

                    return (
                        <div key={index} style={
                            isNotification ? styles.notificationBox :
                            isMe ? styles.myMessage : styles.otherMessage
                        }>
                            <small style={{ fontWeight: 'bold' }}>
                                {isMe ? "Eu" : msg.sender}
                            </small>
                            <div style={isBot ? { fontStyle: 'italic', color: '#0d47a1' } : {}}>
                                {msg.content}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={styles.inputArea}>
                <input
                    type="text"
                    placeholder="Scrie mesaj..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    style={styles.input}
                />
                <button onClick={sendMessage} style={styles.button}>Trimite</button>
            </div>
        </div>
    );
};

const styles = {
    chatContainer: { width: '380px', height: '500px', display: 'flex', flexDirection: 'column', position: 'fixed', bottom: '20px', right: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 9999, fontFamily: 'sans-serif' },
    header: { padding: '15px', backgroundColor: '#2c3e50', color: '#fff', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', fontWeight: 'bold' },
    messageArea: { flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#f9f9f9' },
    myMessage: { alignSelf: 'flex-end', backgroundColor: '#0084ff', color: '#fff', padding: '10px', borderRadius: '15px 15px 0 15px', maxWidth: '75%' },
    otherMessage: { alignSelf: 'flex-start', backgroundColor: '#e4e6eb', color: '#000', padding: '10px', borderRadius: '15px 15px 15px 0', maxWidth: '75%' },
    notificationBox: { alignSelf: 'center', backgroundColor: '#ffebee', color: '#c62828', padding: '8px', borderRadius: '20px', fontSize: '12px', border: '1px solid #ef9a9a', width: '90%', textAlign: 'center' },
    inputArea: { display: 'flex', padding: '15px', borderTop: '1px solid #eee' },
    input: { flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ddd', outline: 'none' },
    button: { marginLeft: '10px', padding: '10px 18px', backgroundColor: '#27ae60', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer' }
};

export default ChatComponent;