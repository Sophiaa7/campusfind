import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const CATS = ["Electronics", "ID Cards", "Keys", "Books", "Bags & Wallets", "Other"];
const LOCS = ["Faculty of Engineering", "Main Library", "Student Centre", "Hostel Area", "Other"];

export default function ReportLost() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    category: "",
    dateLost: "",
    location: "",
    description: "",
    privateDetail: "",
    contact: "",
  });

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.reportLost(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="wrap form" onSubmit={submit}>
      <h1>Report a Lost Item</h1>
      <label>
        Category
        <select name="category" required value={form.category} onChange={set}>
          <option value="">Select</option>
          {CATS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label>
        Date lost
        <input type="date" name="dateLost" required value={form.dateLost} onChange={set} />
      </label>
      <label>
        Location
        <select name="location" required value={form.location} onChange={set}>
          <option value="">Select</option>
          {LOCS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label>
        Description
        <textarea
          name="description"
          required
          value={form.description}
          onChange={set}
          placeholder="Colour, brand, marks"
        />
      </label>
      <label>
        Private detail (never shown publicly)
        <input
          name="privateDetail"
          value={form.privateDetail}
          onChange={set}
          placeholder="Last 4 digits, sticker, serial"
        />
      </label>
      <label>
        Your contact
        <input name="contact" required value={form.contact} onChange={set} placeholder="Phone or email" />
      </label>
      {error && <p className="error">{error}</p>}
      <button>Submit Lost Report</button>
    </form>
  );
}