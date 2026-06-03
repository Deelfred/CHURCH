import { useEffect, useState } from "react";
import axios from "axios";

function AdminMembers() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    gender: "Male",
  });

  const API_URL = "http://192.168.100.5:5000/api/members";

  // GET MEMBERS
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const res = await axios.get(API_URL);
    setMembers(res.data.data);
  };

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD MEMBER
  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(API_URL, form);

    setForm({
      name: "",
      phone: "",
      email: "",
      address: "",
      gender: "Male",
    });

    fetchMembers();
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <h1 className="text-3xl font-bold mb-6">
        👥 Church Members
      </h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid gap-3 mb-8 max-w-md">

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="p-3 bg-zinc-900 rounded"
          required
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="p-3 bg-zinc-900 rounded"
          required
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="p-3 bg-zinc-900 rounded"
        />

        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="p-3 bg-zinc-900 rounded"
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="p-3 bg-zinc-900 rounded"
        >
          <option>Male</option>
          <option>Female</option>
        </select>

        <button
          className="bg-blue-600 py-2 rounded font-bold"
        >
          Add Member
        </button>
      </form>

      {/* LIST */}
      <div className="grid gap-3">
        {members.map((m) => (
          <div
            key={m._id}
            className="bg-zinc-900 p-4 rounded-xl"
          >
            <h2 className="font-bold text-lg">{m.name}</h2>
            <p>{m.phone}</p>
            <p className="text-zinc-400 text-sm">{m.email}</p>
            <p className="text-zinc-400 text-sm">{m.address}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default AdminMembers;