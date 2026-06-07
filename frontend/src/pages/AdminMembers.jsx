import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  History,
  Search,
  Users,
  UserCheck,
  UserX,
  User,
  Pencil,
  Trash2,
} from "lucide-react";

function AdminMembers() {
  const API_URL = "http://192.168.100.5:5000/api/members";

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    gender: "Male",
    department: "",
    status: "Active",
  });

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  /* ========================================
      FETCH MEMBERS
  ======================================== */
  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(API_URL);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setMembers(data);
    } catch (error) {
      console.log("FETCH ERROR:", error);
      alert("Failed to fetch members");
    } finally {
      setLoading(false);
    }
  }, []);

  /* ========================================
      INITIAL LOAD
  ======================================== */
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  /* ========================================
      HANDLE INPUT CHANGE
  ======================================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ========================================
      RESET FORM
  ======================================== */
  const resetForm = () => {
    setForm({
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

  /* ========================================
      CREATE OR UPDATE MEMBER
  ======================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(
          `${API_URL}/${editingId}`,
          form
        );

        setMembers((prev) =>
          prev.map((member) =>
            member._id === editingId
              ? { ...member, ...form }
              : member
          )
        );

        alert("Member updated successfully");
      } else {
        const res = await axios.post(
          API_URL,
          form
        );

        const newMember =
          res.data.data || res.data;

        setMembers((prev) => [
          newMember,
          ...prev,
        ]);

        alert("Member added successfully");
      }

      resetForm();
    } catch (error) {
      console.log("SAVE ERROR:", error);

      alert(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  /* ========================================
      DELETE MEMBER
  ======================================== */
  const deleteMember = async (id) => {
    if (!id) return;

    const confirmDelete = window.confirm(
      "Delete this member?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/${id}`);

      setMembers((prev) =>
        prev.filter(
          (member) => member._id !== id
        )
      );

      alert("Member deleted successfully");
    } catch (error) {
      console.log("DELETE ERROR:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to delete member"
      );
    }
  };

  /* ========================================
      EDIT MEMBER
  ======================================== */
  const editMember = (member) => {
    setEditingId(member._id);

    setForm({
      name: member.name || "",
      phone: member.phone || "",
      email: member.email || "",
      address: member.address || "",
      gender: member.gender || "Male",
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

  /* ========================================
      FILTER MEMBERS
  ======================================== */
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const searchText =
        search.toLowerCase();

      return (
        member?.name
          ?.toLowerCase()
          .includes(searchText) ||
        member?.phone
          ?.toLowerCase()
          .includes(searchText) ||
        member?.department
          ?.toLowerCase()
          .includes(searchText)
      );
    });
  }, [members, search]);

  /* ========================================
      STATISTICS
  ======================================== */
  const totalMembers = members.length;

  const activeMembers = members.filter(
    (m) => m.status === "Active"
  ).length;

  const inactiveMembers = members.filter(
    (m) => m.status === "Inactive"
  ).length;

  const maleMembers = members.filter(
    (m) => m.gender === "Male"
  ).length;

  const femaleMembers = members.filter(
    (m) => m.gender === "Female"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-4 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Church Members
          </h1>

          <p className="text-gray-500 mt-2">
            Manage and monitor all church members.
          </p>
        </div>

        <Link
          to="/admin/activity-log"
          className="inline-flex items-center gap-2 bg-black text-white px-5 py-3 rounded-2xl hover:bg-gray-800 transition"
        >
          <History size={18} />
          Activity Log
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm">
              Total Members
            </p>

            <Users
              className="text-blue-500"
              size={20}
            />
          </div>

          <h2 className="text-3xl font-bold mt-3">
            {totalMembers}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm">
              Active
            </p>

            <UserCheck
              className="text-green-500"
              size={20}
            />
          </div>

          <h2 className="text-3xl font-bold mt-3">
            {activeMembers}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm">
              Inactive
            </p>

            <UserX
              className="text-red-500"
              size={20}
            />
          </div>

          <h2 className="text-3xl font-bold mt-3">
            {inactiveMembers}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm">
              Male
            </p>

            <User
              className="text-cyan-500"
              size={20}
            />
          </div>

          <h2 className="text-3xl font-bold mt-3">
            {maleMembers}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm">
              Female
            </p>

            <User
              className="text-pink-500"
              size={20}
            />
          </div>

          <h2 className="text-3xl font-bold mt-3">
            {femaleMembers}
          </h2>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            {editingId
              ? "Edit Member"
              : "Add New Member"}
          </h2>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="p-4 rounded-2xl border border-gray-300 bg-gray-50 outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            className="p-4 rounded-2xl border border-gray-300 bg-gray-50 outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="p-4 rounded-2xl border border-gray-300 bg-gray-50 outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="p-4 rounded-2xl border border-gray-300 bg-gray-50 outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="text"
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder="Department"
            className="p-4 rounded-2xl border border-gray-300 bg-gray-50 outline-none focus:ring-2 focus:ring-black"
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="p-4 rounded-2xl border border-gray-300 bg-gray-50 outline-none focus:ring-2 focus:ring-black"
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
            value={form.status}
            onChange={handleChange}
            className="p-4 rounded-2xl border border-gray-300 bg-gray-50 outline-none focus:ring-2 focus:ring-black"
          >
            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>

          <button
            type="submit"
            className={`py-4 rounded-2xl font-semibold transition ${
              editingId
                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                : "bg-black hover:bg-gray-800 text-white"
            }`}
          >
            {editingId
              ? "Update Member"
              : "Save Member"}
          </button>
        </form>
      </div>

      {/* SEARCH */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* MEMBERS */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            Members List
          </h2>

          <span className="text-gray-500 text-sm">
            {filteredMembers.length} Member(s)
          </span>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Loading members...
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            No members found
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredMembers.map((m) => (
              <div
                key={m._id}
                className="border border-gray-200 rounded-3xl p-5 bg-gray-50 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      {m.name}
                    </h3>

                    <p className="text-gray-500 text-sm mt-1">
                      {m.department ||
                        "No Department"}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      m.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>📞 {m.phone}</p>

                  <p>
                    📧{" "}
                    {m.email || "No Email"}
                  </p>

                  <p>
                    🏠{" "}
                    {m.address ||
                      "No Address"}
                  </p>

                  <p>👤 {m.gender}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() =>
                      editMember(m)
                    }
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteMember(m._id)
                    }
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminMembers;