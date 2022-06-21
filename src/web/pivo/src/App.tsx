import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { NavbarC } from "./componnents/Navbar";
import { Route, Routes } from "react-router-dom";
import { RealTime } from "./views/RealTime";

function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <NavbarC></NavbarC>
      <Routes>
        <Route path="/" element={<RealTime />} />
        <Route path="/realtime" element={<RealTime />} />
      </Routes>
    </>
  );
}

export default App;
