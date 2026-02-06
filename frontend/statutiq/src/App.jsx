import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Simulator from "./pages/Simulator";
import Result from "./pages/Result";
import Header from "./components/Header";

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulateur" element={<Simulator />} />
        <Route path="/resultat" element={<Result />} />
        <Route path="*" element={<div>Page introuvable</div>} />
      </Routes>
    </BrowserRouter>
  );
}
