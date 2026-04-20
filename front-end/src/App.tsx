import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import List from "./components/wizard/List";
import Succession from "./components/wizard/Succession";
import "./styles/styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
 return (
  <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/succession" element={<Succession />} />
        <Route path="/dashboard" element={<List />} />
      </Routes>
    </BrowserRouter>
 );
}

export default App;