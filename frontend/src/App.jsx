import {  Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import CheckInPage from "./pages/CheckInPage";

function App() {
  return (
    

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/check-in" element={<CheckInPage />} />

      </Routes>

    
  );
}

export default App;