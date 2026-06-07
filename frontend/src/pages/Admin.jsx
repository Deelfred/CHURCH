import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
import NotificationCenter from "../components/NotificationCenter";

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
  Trash2,
  Pencil,
  UserCheck,
  History,
} from "lucide-react";

const BASE_URL = "http://192.168.100.5:5000";

function Admin() {
  /* =========================================
     SOCKET STATE
  ========================================= */
  const [socket, setSocket] = useState(null);

  /* =========================================
     ATTENDANCE STATE
  ========================================= */
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [activeService, setActiveService] =
    useState("All");

  const [view, setView] = useState("all");

  /* =========================================
     MEMBER STATE
  ========================================= */
  const [members, setMembers] = useState([]);
  const [memberView, setMemberView] =
    useState(false);

  const [memberLoading, setMemberLoading] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [memberForm, setMemberForm] =
    useState({
      name: "",
      phone: "",
      email: "",
      address: "",
      gender: "Male",
      department: "",
      status: "Active",
    });

  /* =========================================
     FETCH ATTENDANCE
  ========================================= */
  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${BASE_URL}/api/attendance`
      );

      let data = [];

      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (
        Array.isArray(response.data.data)
      ) {
        data = response.data.data;
      }

      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );

      setAttendance(sorted);
    } catch (error) {
      console.log(
        "FETCH ATTENDANCE ERROR:",
        error
      );

      setAttendance([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* =========================================
     FETCH MEMBERS
  ========================================= */
  const fetchMembers = useCallback(async () => {
    try {
      setMemberLoading(true);

      const response = await axios.get(
        `${BASE_URL}/api/members`
      );

      let data = [];

      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (
        Array.isArray(response.data.data)
      ) {
        data = response.data.data;
      }

      setMembers(data);
    } catch (error) {
      console.log(
        "FETCH MEMBERS ERROR:",
        error
      );

      setMembers([]);
    } finally {
      setMemberLoading(false);
    }
  }, []);

  /* =========================================
     INITIAL LOAD + SOCKET
  ========================================= */
  useEffect(() => {
    fetchAttendance();
    fetchMembers();

    const newSocket = io(BASE_URL, {
      transports: [
        "websocket",
        "polling",
      ],
      reconnection: true,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log(
        "SOCKET CONNECTED:",
        newSocket.id
      );
    });

    newSocket.on(
      "new-attendance",
      (newAttendance) => {
        if (!newAttendance?._id) return;

        setAttendance((prev) => {
          const exists = prev.some(
            (item) =>
              item._id ===
              newAttendance._id
          );

          if (exists) return prev;

          return [
            newAttendance,
            ...prev,
          ];
        });
      }
    );

    newSocket.on("disconnect", () => {
      console.log(
        "SOCKET DISCONNECTED"
      );
    });

    const refreshInterval =
      setInterval(() => {
        fetchAttendance();
      }, 10000);

    return () => {
      newSocket.disconnect();
      clearInterval(refreshInterval);
    };
  }, [fetchAttendance, fetchMembers]);

  /* =========================================
     MEMBER INPUT CHANGE
  ========================================= */
  const handleMemberChange = (e) => {
    const { name, value } = e.target;

    setMemberForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================
     RESET FORM
  ========================================= */
  const resetMemberForm = () => {
    setMemberForm({
      name: "",
      phone: "",
      email: "",
      address: "",
      gender: "Male",
      department: "",
      status: "Active",
    });

    setEditingId(null);
  };

  /* =========================================
     ADD OR UPDATE MEMBER
  ========================================= */
  const handleMemberSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (
      !memberForm.name ||
      !memberForm.phone
    ) {
      alert(
        "Name and phone are required"
      );
      return;
    }

    try {
      if (editingId) {
        await axios.put(
          `${BASE_URL}/api/members/${editingId}`,
          memberForm
        );

        alert(
          "Member updated successfully"
        );
      } else {
        await axios.post(
          `${BASE_URL}/api/members`,
          memberForm
        );

        alert(
          "Member added successfully"
        );
      }

      await fetchMembers();

      resetMemberForm();
    } catch (error) {
      console.log(
        "SAVE MEMBER ERROR:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to save member"
      );
    }
  };

  /* =========================================
     DELETE MEMBER
  ========================================= */
  const deleteMember = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this member?"
      );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${BASE_URL}/api/members/${id}`
      );

      setMembers((prev) =>
        prev.filter(
          (member) =>
            member._id !== id
        )
      );

      alert(
        "Member deleted successfully"
      );
    } catch (error) {
      console.log(
        "DELETE MEMBER ERROR:",
        error
      );

      alert(
        "Failed to delete member"
      );
    }
  };

  /* =========================================
     EDIT MEMBER
  ========================================= */
  const editMember = (member) => {
    setEditingId(member._id);

    setMemberForm({
      name: member.name || "",
      phone: member.phone || "",
      email: member.email || "",
      address: member.address || "",
      gender:
        member.gender || "Male",
      department:
        member.department || "",
      status:
        member.status || "Active",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================
     FILTER ATTENDANCE
  ========================================= */
  const filteredAttendance =
    useMemo(() => {
      return attendance.filter(
        (item) => {
          const searchText =
            search.toLowerCase();

          const matchesSearch =
            item?.name
              ?.toLowerCase()
              .includes(searchText) ||
            item?.phone?.includes(
              search
            ) ||
            item?.service
              ?.toLowerCase()
              .includes(searchText);

          const matchesService =
            activeService ===
              "All" ||
            item?.service ===
              activeService;

          return (
            matchesSearch &&
            matchesService
          );
        }
      );
    }, [
      attendance,
      search,
      activeService,
    ]);

  /* =========================================
     FILTER BY DATE VIEW
  ========================================= */
  const analyticsData = useMemo(() => {
    const now = new Date();

    return filteredAttendance.filter(
      (item) => {
        const itemDate =
          new Date(item.createdAt);

        if (view === "daily") {
          return (
            itemDate.toDateString() ===
            now.toDateString()
          );
        }

        if (view === "weekly") {
          const diff =
            (now - itemDate) /
            (1000 *
              60 *
              60 *
              24);

          return diff <= 7;
        }

        if (view === "monthly") {
          return (
            itemDate.getMonth() ===
              now.getMonth() &&
            itemDate.getFullYear() ===
              now.getFullYear()
          );
        }

        return true;
      }
    );
  }, [
    filteredAttendance,
    view,
  ]);

  /* =========================================
     STATISTICS
  ========================================= */
  const totalAttendance =
    attendance.length;

  const todayAttendance =
    attendance.filter((item) => {
      return (
        new Date(
          item.createdAt
        ).toDateString() ===
        new Date().toDateString()
      );
    }).length;

  const totalMembers =
    members.length;

  const activeMembers =
    members.filter(
      (member) =>
        member.status === "Active"
    ).length;

  /* =========================================
     CHART DATA
  ========================================= */
  const chartData =
    analyticsData.map(
      (item, index) => ({
        index: index + 1,
        attendance: 1,
        name: item.name,
        service: item.service,
      })
    );

  /* =========================================
     SERVICES
  ========================================= */
  const services = [
    "All",
    "Sunday Service",
    "Bible Study",
    "Prayer Meeting",
    "Youth Service",
    "Communion Service",
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      {/* NOTIFICATION CENTER */}
      <NotificationCenter socket={socket} />

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold flex items-center gap-3">
            <Church
              size={40}
              className="text-blue-500"
            />
            Admin Dashboard
          </h1>

          <p className="text-zinc-400 mt-2">
            Church Management System
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() =>
              setMemberView(false)
            }
            className={`px-5 py-3 rounded-xl font-semibold transition ${
              !memberView
                ? "bg-blue-600"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            📊 Attendance
          </button>

          <button
            onClick={() =>
              setMemberView(true)
            }
            className={`px-5 py-3 rounded-xl font-semibold transition ${
              memberView
                ? "bg-purple-600"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            👥 Members

          <Link
            to="/admin/activity-log"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold bg-zinc-800 hover:bg-zinc-700 transition"
          >
            <History size={18} />
            Activity Log
          </Link>
          </button>
        </div>
      </div>

      {/* MEMBERS SECTION */}
      {memberView && (
        <div className="space-y-6">
          {/* MEMBER STATS */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <Users className="text-purple-400 mb-3" />

              <h2 className="text-4xl font-bold">
                {totalMembers}
              </h2>

              <p className="text-zinc-400">
                Total Members
              </p>
            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <UserCheck className="text-green-400 mb-3" />

              <h2 className="text-4xl font-bold">
                {activeMembers}
              </h2>

              <p className="text-zinc-400">
                Active Members
              </p>
            </div>
          </div>

          {/* MEMBER FORM */}
          <form
            onSubmit={
              handleMemberSubmit
            }
            className="grid md:grid-cols-2 gap-4 bg-zinc-900 p-5 rounded-2xl border border-zinc-800"
          >
            <input
              type="text"
              name="name"
              value={memberForm.name}
              onChange={
                handleMemberChange
              }
              placeholder="Full Name"
              className="p-3 bg-zinc-800 rounded-xl outline-none"
              required
            />

            <input
              type="text"
              name="phone"
              value={memberForm.phone}
              onChange={
                handleMemberChange
              }
              placeholder="Phone Number"
              className="p-3 bg-zinc-800 rounded-xl outline-none"
              required
            />

            <input
              type="email"
              name="email"
              value={memberForm.email}
              onChange={
                handleMemberChange
              }
              placeholder="Email"
              className="p-3 bg-zinc-800 rounded-xl outline-none"
            />

            <input
              type="text"
              name="address"
              value={memberForm.address}
              onChange={
                handleMemberChange
              }
              placeholder="Address"
              className="p-3 bg-zinc-800 rounded-xl outline-none"
            />

            <input
              type="text"
              name="department"
              value={
                memberForm.department
              }
              onChange={
                handleMemberChange
              }
              placeholder="Department"
              className="p-3 bg-zinc-800 rounded-xl outline-none"
            />

            <select
              name="gender"
              value={memberForm.gender}
              onChange={
                handleMemberChange
              }
              className="p-3 bg-zinc-800 rounded-xl outline-none"
            >
              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>
            </select>

            <select
              name="status"
              value={memberForm.status}
              onChange={
                handleMemberChange
              }
              className="p-3 bg-zinc-800 rounded-xl outline-none"
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>

            <div className="flex gap-3">
              <button
                type="submit"
                className={`flex-1 p-3 rounded-xl font-bold transition ${
                  editingId
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {editingId
                  ? "Update Member"
                  : "Add Member"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={
                    resetMemberForm
                  }
                  className="px-5 bg-zinc-700 hover:bg-zinc-600 rounded-xl"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* MEMBERS GRID */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {memberLoading && (
              <div className="col-span-full text-center p-10">
                Loading members...
              </div>
            )}

            {!memberLoading &&
              members.length ===
                0 && (
                <div className="col-span-full text-center p-10 text-zinc-500">
                  No members found
                </div>
              )}

            {members.map((member) => (
              <div
                key={member._id}
                className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="font-bold text-xl">
                      {member.name}
                    </h2>

                    <p className="text-zinc-400">
                      {member.department ||
                        "No Department"}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      member.status ===
                      "Active"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {member.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-zinc-300">
                  <p>
                    📞{" "}
                    {member.phone}
                  </p>

                  <p>
                    📧{" "}
                    {member.email ||
                      "No Email"}
                  </p>

                  <p>
                    🏠{" "}
                    {member.address ||
                      "No Address"}
                  </p>

                  <p>
                    👤{" "}
                    {member.gender}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  <button
                    onClick={() =>
                      editMember(
                        member
                      )
                    }
                    className="bg-yellow-600 hover:bg-yellow-700 p-2 rounded-xl flex items-center justify-center gap-2"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteMember(
                        member._id
                      )
                    }
                    className="bg-red-600 hover:bg-red-700 p-2 rounded-xl flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ATTENDANCE SECTION */}
      {!memberView && (
        <>
          {/* STATS */}
          <div className="grid md:grid-cols-3 gap-5 mb-6">
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <Users className="text-blue-500 mb-2" />

              <h2 className="text-3xl font-bold">
                {totalAttendance}
              </h2>

              <p className="text-zinc-400">
                Total Attendance
              </p>
            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <CalendarDays className="text-purple-500 mb-2" />

              <h2 className="text-3xl font-bold">
                {todayAttendance}
              </h2>

              <p className="text-zinc-400">
                Today Attendance
              </p>
            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <Activity className="text-green-500 mb-2" />

              <h2 className="text-green-400 font-bold text-2xl">
                ACTIVE
              </h2>

              <p className="text-zinc-400">
                System Status
              </p>
            </div>
          </div>

          {/* FILTERS */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex items-center bg-zinc-900 rounded-2xl px-4 flex-1 border border-zinc-800">
              <Search
                size={18}
                className="text-zinc-400"
              />

              <input
                type="text"
                placeholder="Search by name, phone or service..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="w-full p-4 bg-transparent outline-none"
              />
            </div>

            <select
              value={activeService}
              onChange={(e) =>
                setActiveService(
                  e.target.value
                )
              }
              className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 outline-none"
            >
              {services.map(
                (service) => (
                  <option
                    key={service}
                    value={service}
                  >
                    {service}
                  </option>
                )
              )}
            </select>

            <select
              value={view}
              onChange={(e) =>
                setView(
                  e.target.value
                )
              }
              className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 outline-none"
            >
              <option value="all">
                All Time
              </option>

              <option value="daily">
                Today
              </option>

              <option value="weekly">
                This Week
              </option>

              <option value="monthly">
                This Month
              </option>
            </select>
          </div>

          {/* CHART */}
          <div className="bg-zinc-900 p-5 rounded-2xl mb-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                Attendance Analytics
              </h2>

              <span className="text-sm text-zinc-400">
                {analyticsData.length} Records
              </span>
            </div>

            <div className="h-[220px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="index" />

                  <YAxis
                    dataKey="attendance"
                    hide
                  />

                  <Tooltip
                    cursor={{
                      strokeDasharray:
                        "3 3",
                    }}
                    formatter={(
                      value,
                      name,
                      props
                    ) => [
                      props.payload.name,
                    ]}
                  />

                  <Scatter
                    data={chartData}
                    fill="#3b82f6"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-950">
                  <tr>
                    <th className="p-4 text-left">
                      Name
                    </th>

                    <th className="p-4 text-left">
                      Phone
                    </th>

                    <th className="p-4 text-left">
                      Service
                    </th>

                    <th className="p-4 text-left">
                      Date & Time
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading && (
                    <tr>
                      <td
                        colSpan="4"
                        className="p-10 text-center"
                      >
                        Loading attendance...
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    analyticsData.length ===
                      0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="p-10 text-center text-zinc-500"
                        >
                          No attendance found
                        </td>
                      </tr>
                    )}

                  {!loading &&
                    analyticsData.map(
                      (item) => (
                        <tr
                          key={item._id}
                          className="border-t border-zinc-800 hover:bg-zinc-800/40 transition"
                        >
                          <td className="p-4">
                            {item.name}
                          </td>

                          <td className="p-4">
                            {item.phone}
                          </td>

                          <td className="p-4">
                            {item.service}
                          </td>

                          <td className="p-4 text-zinc-400">
                            {new Date(
                              item.createdAt
                            ).toLocaleString()}
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Admin;