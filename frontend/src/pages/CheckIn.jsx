import { useState } from "react";
import axios from "axios";

function CheckIn() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "Sunday Service",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://192.168.100.5:5000/api/check-in", form);

      alert("Attendance Submitted");

      setForm({
        name: "",
        phone: "",
        email: "",
        service: "Sunday Service",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-6 rounded-2xl w-full max-w-md"
      >
        <h1 className="text-white text-2xl mb-6 text-center">
          Church Attendance
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 rounded-lg mb-4"
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-3 rounded-lg mb-4"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 rounded-lg mb-4"
        />

        <select
          name="service"
          value={form.service}
          onChange={handleChange}
          className="w-full p-3 rounded-lg mb-6"
        >
          <option>Sunday Service</option>
          <option>Bible Study</option>
          <option>Prayer Meeting</option>
        </select>

        <button className="bg-blue-600 hover:bg-blue-700 text-white w-full p-3 rounded-lg">
          Submit Attendance
        </button>
      </form>
    </div>
  );
}

export default CheckIn;