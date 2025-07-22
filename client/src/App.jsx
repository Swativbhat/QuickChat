import Joinroom from "./components/joinroom";
import Chat from "./components/chat";
import { BrowserRouter as  Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Joinroom />}></Route>
         <Route path="/chat" element={<Chat/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
