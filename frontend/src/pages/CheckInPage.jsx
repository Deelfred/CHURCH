import { useState } from "react";
import axios from "axios";

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
      console.log(err);
      alert("Failed to submit check-in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-blue-950 to-purple-950 p-4">

      {/* CARD */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl p-6">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-center text-white mb-2">
           Church Check-In
        </h1>

        <p className="text-center text-zinc-300 mb-6 text-sm">
          Please fill in your details to record attendance
        </p>

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="bg-green-500/20 border border-green-400 text-green-300 text-sm p-3 rounded-lg mb-4 text-center">
            ✅ Check-in successful! God bless you 🙏
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-zinc-300 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-zinc-300 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-zinc-300 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Sunday Service</option>
            <option>Bible Study</option>
            <option>Prayer Meeting</option>
          </select>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Check-In"}
          </button>

        </form>

        {/* FOOTER NOTE */}
        <p className="text-center text-xs text-zinc-400 mt-4">
          Powered by Church Attendance System
        </p>

      </div>
    </div>
  );
}

export default CheckInPage;