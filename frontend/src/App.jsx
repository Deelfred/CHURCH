import {  Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import CheckInPage from "./pages/CheckInPage";
import AdminMembers from "./pages/AdminMembers";

function App() {
  return (
    

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/check-in" element={<CheckInPage />} />
        <Route path="/admin/members" element={<AdminMembers />} />

      </Routes>

    
  );
}

export default App;