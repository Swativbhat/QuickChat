import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { socket } from "./socket";
import { useNavigate } from "react-router-dom";
import "../styles/chat.css";

export default function Chat() {
  const { state } = useLocation();
  const { name, room } = state || {};
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!name || !room) {
      navigate("/");
      return;
    }
    if (name && room) {
      socket.emit("join-room", { name, room });
    }

    socket.on("room-users", (roomUsers) => {
      setUsers(roomUsers);
    });

    const handleReceivedMsg = (data) => {
      setMessageList((prev) => [...prev, data]);
    };

    socket.on("receive-message", handleReceivedMsg);

    const handleUnload = () => {
      socket.emit("leave-room", { name, room });
      navigate("/");
    };
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      socket.emit("leave-room", { name, room });
      socket.off("receive-message", handleReceivedMsg);
    };
  }, [name, room, navigate]);

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("send-message", {
      name: state.name,
      room: state.room,
      message,
    });
    setMessage("");
  };
  const handleLeave = () => {
    socket.emit("leave-room", { name, room });
    navigate("/");
  };

  return (
    <div className="containers">
      <div className="heading">
        <div>
          <h1>QuickChat</h1>
        </div>

        {/* <div className="title">
          <input type="text" placeholder="  title of disscussion"></input>
        </div> */}

        <div className="leave-button">
          <button onClick={handleLeave}>Leave</button>
        </div>
      </div>

      <div className="chat-body">
        <div className="active-users">
          <h2>Active users</h2>
          {users.map((user, index) => {
            return (
              <p key={index} className="user-name">
                {user}
              </p>
            );
          })}
        </div>

        <div className="message-area">
          <div className="messages">
            {messageList.map((msg, index) => {
              return (
                <p key={index} className="msg">
                  <strong>{msg.name}:</strong> {msg.message}
                </p>
              );
            })}
          </div>
          <div className="send-message">
            <input
              type="text"
              value={message}
              placeholder="  enter message"
              onChange={(e) => setMessage(e.target.value)}
            ></input>
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
