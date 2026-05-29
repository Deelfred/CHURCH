import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Admin() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("All");

  const API_URL = "http://192.168.100.5:5000/api/attendance";

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(API_URL);
      setAttendance(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
    const interval = setInterval(fetchAttendance, 5000);
    return () => clearInterval(interval);
  }, []);

  // FILTER
  const filteredData = attendance.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.phone?.includes(search);

    const matchesService =
      serviceFilter === "All" || item.service === serviceFilter;

    return matchesSearch && matchesService;
  });

  // STATS
  const total = attendance.length;

  const today = attendance.filter((item) => {
    const todayDate = new Date().toDateString();
    return (
      new Date(item.createdAt).toDateString() === todayDate
    );
  }).length;

  // 📊 BAR CHART DATA
  const chartData = [
    {
      name: "Sunday",
      value: attendance.filter((a) => a.service === "Sunday Service").length,
    },
    {
      name: "Bible Study",
      value: attendance.filter((a) => a.service === "Bible Study").length,
    },
    {
      name: "Prayer",
      value: attendance.filter((a) => a.service === "Prayer Meeting").length,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-blue-950 to-purple-950 text-white p-6">

      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-6">
        📊 Church Attendance Dashboard
      </h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white/10 backdrop-blur-lg p-5 rounded-2xl border border-white/10">
          <h2 className="text-gray-300">Total Attendance</h2>
          <p className="text-3xl font-bold">{total}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-5 rounded-2xl border border-white/10">
          <h2 className="text-gray-300">Today</h2>
          <p className="text-3xl font-bold">{today}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-5 rounded-2xl border border-white/10">
          <h2 className="text-gray-300">Live Status</h2>
          <p className="text-green-400 font-bold">Active 🔥</p>
        </div>

      </div>

      {/* BAR CHART */}
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl mb-6 border border-white/10">
        <h2 className="text-xl font-semibold mb-4">Attendance by Service</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Bar dataKey="value" fill="#60a5fa" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">

        <input
          type="text"
          placeholder="Search by name or phone..."
          className="p-3 rounded-xl text-black w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-3 rounded-xl text-black"
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
        >
          <option value="All">All Services</option>
          <option value="Sunday Service">Sunday Service</option>
          <option value="Bible Study">Bible Study</option>
          <option value="Prayer Meeting">Prayer Meeting</option>
        </select>

      </div>

      {/* TABLE */}
      {loading ? (
        <p className="text-gray-300">Loading...</p>
      ) : (
        <div className="overflow-auto bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10">

          <table className="w-full">

            <thead className="bg-white/10">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Service</th>
                <th className="p-3 text-left">Time</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item._id} className="border-t border-white/10">
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.phone}</td>
                    <td className="p-3">{item.service}</td>
                    <td className="p-3">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : "No date"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-300">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default Admin;