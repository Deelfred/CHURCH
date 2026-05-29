import { Link } from "react-router-dom";
import QRDisplay from "../components/QRDisplay";

function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-white">

      {/* BACKGROUND GLOW EFFECTS */}
      <div className="absolute top-[-100px] left-[-100px] h-[300px] w-[300px] rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute bottom-[-100px] right-[-100px] h-[300px] w-[300px] rounded-full bg-purple-500/20 blur-3xl" />

      {/* HERO SECTION */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">

        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Church Attendance System
          </h1>

          <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-10">
            Quickly check in for church service using a secure QR code system.
            Attendance is recorded instantly with accurate time and date tracking.
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

            <Link
              to="/check-in"
              className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-300 px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-blue-500/20"
            >
              Go to Check-In
            </Link>

            <Link
              to="/admin"
              className="border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900 transition-all duration-300 px-8 py-4 rounded-2xl font-semibold"
            >
              Admin Dashboard
            </Link>

          </div>
        </div>
      </section>

      {/* QR SECTION */}
      <section className="relative z-10 px-6 pb-24">
        
        <div className="max-w-4xl mx-auto bg-zinc-900/70 border border-zinc-800 rounded-3xl p-8 md:p-12 backdrop-blur-sm shadow-2xl">

          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Scan QR Code
            </h2>

            <p className="text-zinc-400 max-w-xl mx-auto">
              Open your phone camera and scan the QR code below to access the
              attendance check-in page instantly.
            </p>
          </div>

          <div className="flex justify-center">
            <QRDisplay />
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="relative z-10 px-6 pb-24">
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-blue-500/40 transition">
            <h3 className="text-xl font-semibold mb-3">
              Fast Check-In
            </h3>

            <p className="text-zinc-400">
              Members can check in within seconds by scanning the QR code.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-purple-500/40 transition">
            <h3 className="text-xl font-semibold mb-3">
              Attendance Tracking
            </h3>

            <p className="text-zinc-400">
              Automatically record attendance date and time for every member.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-green-500/40 transition">
            <h3 className="text-xl font-semibold mb-3">
              Secure System
            </h3>

            <p className="text-zinc-400">
              Reliable and modern attendance management for your church.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-zinc-800 py-8 text-center">
        
        <p className="text-zinc-500 text-sm">
          © {new Date().getFullYear()} Church Attendance System. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default Home;