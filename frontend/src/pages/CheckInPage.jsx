import { useState, useEffect } from "react";
import axios from "axios";
import { Church, User, Phone, Mail, ChevronDown } from "lucide-react";

function CheckInPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "Sunday Service",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const API_URL = "http://192.168.100.5:5000/api/check-in";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ AUTO LOGOUT TIMER
  useEffect(() => {
    let timer;

    if (success) {
      timer = setTimeout(() => {
        // 🔥 "logout action"
        setSuccess(false);
        setForm({
          name: "",
          phone: "",
          email: "",
          service: "Sunday Service",
        });

        // OPTION 1: reload page
        window.location.reload();

        // OPTION 2 (better if you use routing):
        // window.location.href = "/";

      }, 30000); // 30 seconds
    }

    return () => clearTimeout(timer);
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess(false);

    try {
      await axios.post(API_URL, form);

      setSuccess(true);

      setForm({
        name: "",
        phone: "",
        email: "",
        service: "Sunday Service",
      });
    } catch (err) {
      console.log("FULL ERROR:", err.response?.data || err.message);

      alert(err.response?.data?.message || "Failed to submit check-in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden px-4 py-10">

      {/* BACKGROUND EFFECTS */}
      <div className="absolute w-96 h-96 bg-blue-600/20 blur-3xl rounded-full top-0 left-0"></div>
      <div className="absolute w-96 h-96 bg-purple-600/20 blur-3xl rounded-full bottom-0 right-0"></div>

      <div className="relative z-10 w-full max-w-md bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.6)] p-8">

        <div className="flex justify-center mb-5">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg">
            <Church className="text-white" size={34} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Church Check-In
        </h1>

        <p className="text-center text-zinc-400 mb-8 text-sm">
          Fill in your details to record attendance
        </p>

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm p-4 rounded-2xl mb-5 text-center animate-pulse">
            Check-in successful! You will be logged out in 30 seconds     
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAME */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
          </div>

          {/* PHONE */}
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
          </div>

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />

            <input
              type="email"
              name="email"
              placeholder="Email (optional)"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
          </div>

          {/* SELECT */}
          <div className="relative">
            <select
              name="service"
              value={form.service}
              onChange={handleChange}
              className="w-full appearance-none bg-black text-white border border-zinc-800 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
            >
              <option>Sunday Service</option>
              <option>Bible Study</option>
              <option>Prayer Meeting</option>
            </select>

            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={18} />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-white font-semibold py-3 rounded-2xl shadow-lg disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Check-In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-zinc-500 text-xs">
            Powered by Church Attendance System
          </p>
        </div>
      </div>
    </div>
  );
}

export default CheckInPage;