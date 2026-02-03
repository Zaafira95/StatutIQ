

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Simulator from "./pages/Simulator";
import Header from "./components/Header";

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulateur" element={<Simulator />} />
      </Routes>
    </BrowserRouter>
  );
}



