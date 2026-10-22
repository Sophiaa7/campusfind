import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const CATS = ["Electronics", "ID Cards", "Keys", "Books", "Bags & Wallets", "Other"];
const LOCS = [
  "Wolfson Theatre",
  "Kainji Theatre",
  "New Engineering Lecture Theatre (NELT)",
  "MC13 (Mechanical Engineering Lecture Hall)",
  "B1 (Classroom B1)",
  "Faculty of Science Lecture Theaters (FSLT I)",
  "New Lecture Hall (NLH)",
  "Faculty of Science Lecture Theaters (FSLT II)",
  "Faculty of Biological Science Lecture Theatre (FBSLT)",
  "Class Rooms 2 (300 Level Lecture Room)",
  "Class Rooms 2 (400 Level Lecture Room)",
  "Faculty of Arts Lecture Theatre / Hall",
  "Drama Village (Theatre and Performing Arts)",
  "Faculty of Education Lecture Theatre (FENT) / Amphitheatre",
  "Postgraduate Conference Rooms / Lecture Spaces",
  "Long Hall",
  "Faculty of Social Sciences Lecture Theatre I (LTI)", 
  "Faculty of Social Sciences Lecture Theatre II (LTII)",
  "Tetfund Hall",
  "Theatre AB / Theatre BC",
  "Department of Building Lecture Rooms:",
  "300 Level Lecture Room",
  "400 Level Lecture Room",
  "Department of Architecture Lecture & Studio Spaces",
  "Multipurpose Hall, Vet (MPHV)",
  "300 Level Lecture Theatre",
  "500 Level Lecture Theatre",
  "Faculty Auditorium",
  "Veterinary Teaching Hospital (VTH) Lecture Facilities",
  "The Main Auditorium",
  "ICAN Lecture Theatre",
  "Participatory Lecture Hall",
  "Postgraduate Conference Room 1 (Major)",
  "Postgraduate Conference Room 2 (Mini)",
  "Ango Abdullahi Auditorium",
  "J.Y. Yayock Agricultural Library",
  "Pa. Ishaku Lecture Theater (P.A. Ishaku Theatre)",
  "GOLT I",
  "GOLT II",
  "Umar Shehu (Red Seat) Lecture Theater",
  "Umar Shehu (Blue Seat) Lecture Theater",
  "Distance Learning Centre (DLC) Auditoriums",
  "Red Seat Lecture Hall",
  "General/Clinical Lecture Theatres",
 "Kashim Ibrahim Library",
  "Engineering Mosque",
  "Love Garden",
  "Social Centre",
  "Pepsi Garden",
  "DLC Garden",
  "Sculpture Garden",
  "Pharmacy Garden",
  "Amina Hostel",
  "Suleiman Hostel",
  "Ribadu Hostel",
  "Alex Hostel",
  "Ramat Hostel",
  "ICSA Hostel",
  "Danfodiyo Hostel",
  "Dangote Hostel",
  "Phase II",
  "Gym",
  "CBT Centre",
  "Iyaa Abubakar",
  "DLC",
  "DLC Phase II",
  "Other",
];

function readImage(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, 800 / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.src = url;
  });
}

export default function ReportFound() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    category: "",
    dateFound: "",
    location: "",
    customLocation: "",
    description: "",
    keptAt: "",
    contact: "",
    image: "",
  });

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function onPhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, image: await readImage(file) });
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    const location = form.location === "Other" ? form.customLocation.trim() : form.location;
    if (!location) {
      setError("Please type the location");
      return;
    }
    try {
      await api.reportFound({ ...form, location });
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="wrap form" onSubmit={submit}>
      <h1>Report a Found Item</h1>
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
        Date found
        <input type="date" name="dateFound" required value={form.dateFound} onChange={set} />
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
      {form.location === "Other" && (
        <label>
          Type the location
          <input
            name="customLocation"
            required
            value={form.customLocation}
            onChange={set}
            placeholder="Where was it found?"
          />
        </label>
      )}
      <label>
        Description
        <textarea
          name="description"
          required
          value={form.description}
          onChange={set}
          placeholder="Colour, brand, visible marks"
        />
      </label>
      <label>
        Where is it kept?
        <input
          name="keptAt"
          required
          value={form.keptAt}
          onChange={set}
          placeholder="With me, security post, library..."
        />
      </label>
      <label>
        Your contact (shown to the owner)
        <input name="contact" required value={form.contact} onChange={set} placeholder="Phone or email" />
      </label>
      <label>
        Photo of the item
        <input type="file" accept="image/*" onChange={onPhoto} />
      </label>
      {form.image && <img src={form.image} alt="Selected item" className="preview" />}
      {error && <p className="error">{error}</p>}
      <button>Submit Found Report</button>
    </form>
  );
}