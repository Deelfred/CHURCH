import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  ScatterChart,
  Scatter,
  CartesianGrid,
} from "recharts";

import {
  Search,
  Users,
  Activity,
  CalendarDays,
  Church,
} from "lucide-react";

function Admin() {
  /* =========================
     ATTENDANCE STATE
  ========================= */
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");
  const [activeService, setActiveService] = useState("All");
  const [view, setView] = useState("daily");
  const [loading, setLoading] = useState(true);

  /* =========================
     MEMBER STATE
  ========================= */
  const [members, setMembers] = useState([]);
  const [memberView, setMemberView] = useState(false);

  const [memberForm, setMemberForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    gender: "Male",
  });

  const API_URL = "http://192.168.100.5:5000/api/attendance";
  const MEMBER_API = "http://192.168.100.5:5000/api/members";

  /* =========================
     FETCH ATTENDANCE
  ========================= */
  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API_URL);

      const data = res.data.data || [];

      setAttendance([...data].reverse());
    } catch (err) {
      console.log("ATTENDANCE FETCH ERROR:", err.message);
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FETCH MEMBERS
  ========================= */
  const fetchMembers = async () => {
    try {
      const res = await axios.get(MEMBER_API);
      setMembers(res.data.data || []);
    } catch (err) {
      console.log("MEMBER FETCH ERROR:", err.message);
      setMembers([]);
    }
  };

  /* =========================
     SOCKET REALTIME
  ========================= */
  useEffect(() => {
    fetchAttendance();
    fetchMembers();

    const socket = io("http://192.168.100.5:5000", {
      transports: ["websocket"],
    });

    socket.on("new-attendance", (newData) => {
      setAttendance((prev) => [newData, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  /* =========================
     ADD MEMBER
  ========================= */
  const handleAddMember = async (e) => {
    e.preventDefault();

    try {
      await axios.post(MEMBER_API, memberForm);

      setMemberForm({
        name: "",
        phone: "",
        email: "",
        address: "",
        gender: "Male",
      });

      fetchMembers();
    } catch (err) {
      console.log("ADD MEMBER ERROR:", err.message);
    }
  };

  const handleMemberChange = (e) => {
    setMemberForm({
      ...memberForm,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     FILTER ATTENDANCE
  ========================= */
  const filteredData = useMemo(() => {
    return attendance.filter((item) => {
      const matchesSearch =
        item?.name?.toLowerCase().includes(search.toLowerCase()) ||
        item?.phone?.includes(search);

      const matchesService =
        activeService === "All" ||
        item?.service === activeService;

      return matchesSearch && matchesService;
    });
  }, [attendance, search, activeService]);

  /* =========================
     TIME FILTER
  ========================= */
  const analyticsData = useMemo(() => {
    const now = new Date();

    return filteredData.filter((item) => {
      const itemDate = new Date(item.createdAt);

      if (view === "daily") {
        return itemDate.toDateString() === now.toDateString();
      }

      if (view === "weekly") {
        const diff =
          (now.getTime() - itemDate.getTime()) /
          (1000 * 60 * 60 * 24);

        return diff <= 7;
      }

      if (view === "monthly") {
        return (
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear()
        );
      }

      return true;
    });
  }, [filteredData, view]);

  const totalAttendance = analyticsData.length;

  const todayAttendance = attendance.filter(
    (item) =>
      new Date(item.createdAt).toDateString() ===
      new Date().toDateString()
  ).length;

  const chartData = analyticsData.map((item, index) => ({
    index: index + 1,
    attendance: 1,
    name: item.name,
  }));

  const services = [
    "All",
    "Sunday Service",
    "Bible Study",
    "Prayer Meeting",
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">

        <div>
          <h1 className="text-3xl md:text-5xl font-bold flex items-center gap-3">
            <Church className="text-blue-500" size={40} />
            Admin Dashboard
          </h1>

          <p className="text-zinc-400 mt-2">
            Church Management System
          </p>
        </div>

        <div className="flex gap-3 mt-4 md:mt-0">

          <button
            onClick={() => setMemberView(false)}
            className={`px-4 py-2 rounded ${
              !memberView ? "bg-blue-600" : "bg-zinc-800"
            }`}
          >
            📊 Attendance
          </button>

          <button
            onClick={() => setMemberView(true)}
            className={`px-4 py-2 rounded ${
              memberView ? "bg-purple-600" : "bg-zinc-800"
            }`}
          >
            👥 Members
          </button>

        </div>
      </div>

      {/* =========================
          MEMBERS SECTION
      ========================= */}
      {memberView && (
        <div className="space-y-6">

          {/* FORM */}
          <form
            onSubmit={handleAddMember}
            className="grid md:grid-cols-2 gap-3 bg-zinc-900 p-4 rounded-2xl"
          >
            <input
              name="name"
              value={memberForm.name}
              onChange={handleMemberChange}
              placeholder="Full Name"
              className="p-3 bg-zinc-800 rounded"
              required
            />

            <input
              name="phone"
              value={memberForm.phone}
              onChange={handleMemberChange}
              placeholder="Phone"
              className="p-3 bg-zinc-800 rounded"
              required
            />

            <input
              name="email"
              value={memberForm.email}
              onChange={handleMemberChange}
              placeholder="Email"
              className="p-3 bg-zinc-800 rounded"
            />

            <input
              name="address"
              value={memberForm.address}
              onChange={handleMemberChange}
              placeholder="Address"
              className="p-3 bg-zinc-800 rounded"
            />

            <select
              name="gender"
              value={memberForm.gender}
              onChange={handleMemberChange}
              className="p-3 bg-zinc-800 rounded"
            >
              <option>Male</option>
              <option>Female</option>
            </select>

            <button className="bg-purple-600 p-3 rounded font-bold">
              Add Member
            </button>
          </form>

          {/* LIST */}
          <div className="grid gap-3">
            {members.map((m) => (
              <div
                key={m._id}
                className="bg-zinc-900 p-4 rounded-xl border border-zinc-800"
              >
                <h2 className="font-bold text-lg">{m.name}</h2>
                <p className="text-zinc-400">{m.phone}</p>
                <p className="text-zinc-500 text-sm">{m.email}</p>
                <p className="text-zinc-500 text-sm">{m.address}</p>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* =========================
          ATTENDANCE SECTION
      ========================= */}
      {!memberView && (
        <>
          {/* STATS */}
          <div className="grid md:grid-cols-3 gap-5 mb-6">

            <div className="bg-zinc-900 p-6 rounded-2xl">
              <Users className="text-blue-500" />
              <p className="text-3xl font-bold">{totalAttendance}</p>
              <p className="text-zinc-400">Total</p>
            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl">
              <CalendarDays className="text-purple-500" />
              <p className="text-3xl font-bold">{todayAttendance}</p>
              <p className="text-zinc-400">Today</p>
            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl">
              <Activity className="text-green-500" />
              <p className="text-green-400 font-bold">ACTIVE</p>
              <p className="text-zinc-400">System</p>
            </div>

          </div>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-6 p-4 bg-zinc-900 rounded-2xl"
          />

          {/* TABLE */}
          <div className="bg-zinc-900 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-950">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">Service</th>
                  <th className="p-4 text-left">Time</th>
                </tr>
              </thead>

              <tbody>
                {analyticsData.map((item) => (
                  <tr key={item._id} className="border-t border-zinc-800">
                    <td className="p-4">{item.name}</td>
                    <td className="p-4">{item.phone}</td>
                    <td className="p-4">{item.service}</td>
                    <td className="p-4 text-zinc-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </>
      )}

    </div>
  );
}

export default Admin;