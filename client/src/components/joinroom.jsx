import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/joinroom.css";

export default function Joinroom() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  const handleJoinroom = () => {
    if (name && room) {
      navigate("/chat", { state: { name, room } });
    }
    setName("");
    setRoom("");
  };

  return (
    <div className="container">
      <div className="input-area">
        <h2>Welcom to QuickChat</h2>
        <input
          type="text"
          placeholder="your name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></input>

        <input
          type="text"
          placeholder="room number"
          onChange={(e) => setRoom(e.target.value)}
        ></input>

        <button type="submit" onClick={handleJoinroom}>
          Join Room
        </button>
      </div>
    </div>
  );
}
