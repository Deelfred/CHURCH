import { useEffect, useMemo, useState } from "react";
import axios from "axios";

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

  // EDIT MODE
  const [editingId, setEditingId] = useState(null);

  /* ========================================
      FETCH MEMBERS
  ======================================== */
  const fetchMembers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API_URL);

      // FIXED RESPONSE HANDLING
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
  };

  /* ========================================
      INITIAL LOAD
  ======================================== */
  useEffect(() => {
    fetchMembers();
  }, []);

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
        // UPDATE
        await axios.put(
          `${API_URL}/${editingId}`,
          form
        );

        alert("Member updated successfully");

        // UPDATE UI IMMEDIATELY
        setMembers((prev) =>
          prev.map((member) =>
            member._id === editingId
              ? {
                  ...member,
                  ...form,
                }
              : member
          )
        );
      } else {
        // CREATE
        const res = await axios.post(
          API_URL,
          form
        );

        alert("Member saved successfully");

        // ADD TO UI IMMEDIATELY
        const newMember =
          res.data.data || res.data;

        setMembers((prev) => [
          newMember,
          ...prev,
        ]);
      }

      resetForm();

      // REFRESH DATA
      fetchMembers();
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
    if (!id) {
      alert("Member ID missing");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this member?"
    );

    if (!confirmDelete) return;

    try {
      // DELETE FROM SERVER
      await axios.delete(`${API_URL}/${id}`);

      // REMOVE FROM UI
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
    if (!member?._id) {
      alert("Invalid member data");
      return;
    }

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

    // SCROLL TO TOP
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ========================================
      SEARCH FILTER
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
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      {/* ========================================
          PAGE TITLE
      ======================================== */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black">
          👥 Church Members Database
        </h1>

        <p className="text-zinc-400 mt-2">
          Manage church members and monitor records.
        </p>
      </div>

      {/* ========================================
          STATS
      ======================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <p className="text-zinc-400 text-sm">
            Total Members
          </p>

          <h2 className="text-3xl font-black text-blue-400 mt-2">
            {totalMembers}
          </h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <p className="text-zinc-400 text-sm">
            Active Members
          </p>

          <h2 className="text-3xl font-black text-green-400 mt-2">
            {activeMembers}
          </h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <p className="text-zinc-400 text-sm">
            Inactive Members
          </p>

          <h2 className="text-3xl font-black text-red-400 mt-2">
            {inactiveMembers}
          </h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <p className="text-zinc-400 text-sm">
            Male Members
          </p>

          <h2 className="text-3xl font-black text-cyan-400 mt-2">
            {maleMembers}
          </h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <p className="text-zinc-400 text-sm">
            Female Members
          </p>

          <h2 className="text-3xl font-black text-pink-400 mt-2">
            {femaleMembers}
          </h2>
        </div>
      </div>

      {/* ========================================
          FORM
      ======================================== */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {editingId
              ? "✏️ Edit Member"
              : "➕ Add New Member"}
          </h2>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl transition-all"
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
            className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 outline-none"
          />

          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 outline-none"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 outline-none"
          />

          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 outline-none"
          />

          <input
            type="text"
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder="Department"
            className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 outline-none"
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 outline-none"
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
            className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 outline-none"
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
            className={`py-3 rounded-xl font-bold transition-all ${
              editingId
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {editingId
              ? "Update Member"
              : "Save Member"}
          </button>
        </form>
      </div>

      {/* ========================================
          SEARCH
      ======================================== */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search member..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full md:w-[400px] p-3 bg-zinc-900 border border-zinc-800 rounded-xl outline-none"
        />
      </div>

      {/* ========================================
          MEMBERS GRID
      ======================================== */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            📁 Saved Members
          </h2>

          <span className="text-zinc-400 text-sm">
            {filteredMembers.length} Member(s)
          </span>
        </div>

        {loading ? (
          <div className="text-center py-10 text-zinc-400">
            Loading members...
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-10 text-zinc-500">
            No members found
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredMembers.map((m) => (
              <div
                key={m._id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-blue-500 transition-all"
              >
                {/* HEADER */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="font-bold text-xl">
                      {m.name}
                    </h2>

                    <p className="text-zinc-400 text-sm mt-1">
                      {m.department ||
                        "No Department"}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      m.status === "Active"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                {/* DETAILS */}
                <div className="space-y-3 text-sm">
                  <p>
                    📞{" "}
                    <span className="text-zinc-300">
                      {m.phone}
                    </span>
                  </p>

                  <p>
                    📧{" "}
                    <span className="text-zinc-400">
                      {m.email ||
                        "No Email"}
                    </span>
                  </p>

                  <p>
                    🏠{" "}
                    <span className="text-zinc-400">
                      {m.address ||
                        "No Address"}
                    </span>
                  </p>

                  <p>
                    👤{" "}
                    <span className="text-zinc-400">
                      {m.gender}
                    </span>
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() =>
                      editMember(m)
                    }
                    className="bg-yellow-600 hover:bg-yellow-700 py-2 rounded-xl font-bold transition-all"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteMember(m._id)
                    }
                    className="bg-red-600 hover:bg-red-700 py-2 rounded-xl font-bold transition-all"
                  >
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