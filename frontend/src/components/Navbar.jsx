import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-zinc-900 text-white px-6 py-4 flex justify-between items-center">
      
      {/* LOGO */}
      <h1 className="text-xl font-bold">
        Church Attendance
      </h1>

      {/* LINKS */}
      <div className="flex gap-6">
        <Link to="/" className="hover:text-blue-400">
          Home
        </Link>

        <Link to="/check-in" className="hover:text-blue-400">
          Check-In
        </Link>

        <Link to="/admin" className="hover:text-blue-400">
          Admin
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;