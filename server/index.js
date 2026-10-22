const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, "data.json");

app.use(cors());
app.use(express.json({ limit: "8mb" }));

function loadDB() {
  if (!fs.existsSync(DB_PATH)) return { lost: [], found: [], matches: [] };
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}
function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}
let db = loadDB();

function score(lost, found) {
  let s = 0;
  if ((lost.category || "").toLowerCase() === (found.category || "").toLowerCase()) s += 40;
  const a = (lost.location || "").toLowerCase();
  const b = (found.location || "").toLowerCase();
  if (a && b && a === b) s += 25;
  else if (a && b && (a.includes(b) || b.includes(a))) s += 15;
  const words = (lost.description || "").toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  const other = (found.description || "").toLowerCase();
  words.forEach((w) => {
    if (other.includes(w)) s += 8;
  });
  return Math.min(s, 100);
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api/stats", (_req, res) => {
  res.json({
    lostReports: db.lost.filter((i) => i.status === "active").length,
    foundReports: db.found.filter((i) => i.status === "active").length,
    possibleMatches: db.matches.filter((m) => m.status === "pending").length,
    recovered: db.matches.filter((m) => m.status === "recovered").length,
  });
});

app.post("/api/lost", (req, res) => {
  const { category, dateLost, location, description, privateDetail, contact, image } = req.body;
  if (!category || !dateLost || !location || !description || !contact) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const item = {
    id: uuidv4(),
    category,
    date_lost: dateLost,
    location,
    description,
    private_detail: privateDetail || "",
    contact,
    image: image || "",
    status: "active",
    created_at: new Date().toISOString(),
  };
  db.lost.push(item);
  db.found
    .filter((f) => f.status === "active")
    .forEach((found) => {
      const s = score(item, found);
      if (s >= 40) {
        db.matches.push({
          id: uuidv4(),
          lost_id: item.id,
          found_id: found.id,
          score: s,
          status: "pending",
        });
      }
    });
  saveDB(db);
  res.status(201).json({ success: true, id: item.id });
});

app.post("/api/found", (req, res) => {
  const { category, dateFound, location, description, keptAt, contact, image } = req.body;
  if (!category || !dateFound || !location || !description || !keptAt || !contact) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const item = {
    id: uuidv4(),
    category,
    date_found: dateFound,
    location,
    description,
    kept_at: keptAt,
    contact,
    image: image || "",
    status: "active",
    created_at: new Date().toISOString(),
  };
  db.found.push(item);
  db.lost
    .filter((l) => l.status === "active")
    .forEach((lost) => {
      const s = score(lost, item);
      if (s >= 40) {
        db.matches.push({
          id: uuidv4(),
          lost_id: lost.id,
          found_id: item.id,
          score: s,
          status: "pending",
        });
      }
    });
  saveDB(db);
  res.status(201).json({ success: true, id: item.id });
});

app.get("/api/matches", (_req, res) => {
  const rows = db.matches
    .filter((m) => m.status === "pending")
    .map((m) => {
      const lost = db.lost.find((l) => l.id === m.lost_id);
      const found = db.found.find((f) => f.id === m.found_id);
      if (!lost || !found) return null;
      return {
        match_id: m.id,
        score: m.score,
        lost_description: lost.description,
        lost_category: lost.category,
        lost_location: lost.location,
        date_lost: lost.date_lost,
        lost_image: lost.image || "",
        found_description: found.description,
        found_category: found.category,
        found_location: found.location,
        date_found: found.date_found,
        kept_at: found.kept_at,
        found_image: found.image || "",
        found_contact: found.contact,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);
  res.json(rows);
});

app.post("/api/recover", (req, res) => {
  const match = db.matches.find((m) => m.id === req.body.matchId);
  if (!match) return res.status(404).json({ error: "Match not found" });
  match.status = "recovered";
  const lost = db.lost.find((l) => l.id === match.lost_id);
  const found = db.found.find((f) => f.id === match.found_id);
  if (lost) lost.status = "recovered";
  if (found) found.status = "recovered";
  saveDB(db);
  res.json({ success: true });
});

app.post("/api/demo", (_req, res) => {
  const lost1 = uuidv4();
  const lost2 = uuidv4();
  const found1 = uuidv4();
  const found3 = uuidv4();
  db = {
    lost: [
      {
        id: lost1,
        category: "Electronics",
        date_lost: "2026-07-05",
        location: "Faculty of Engineering",
        description: "Black Samsung Galaxy A54 with blue case",
        private_detail: "4821",
        contact: "0803xxx1234",
        image: "",
        status: "active",
      },
      {
        id: lost2,
        category: "ID Cards",
        date_lost: "2026-07-08",
        location: "Main Library",
        description: "ABU student ID card, Computer Science",
        private_detail: "2021/CS/045",
        contact: "aisha@student.abu.edu.ng",
        image: "",
        status: "active",
      },
    ],
    found: [
      {
        id: found1,
        category: "Electronics",
        date_found: "2026-07-06",
        location: "Faculty of Engineering",
        description: "Black phone with blue protective case",
        kept_at: "Security Post, Engineering",
        contact: "0705xxx9876",
        image: "",
        status: "active",
      },
      {
        id: uuidv4(),
        category: "Keys",
        date_found: "2026-07-07",
        location: "Student Centre",
        description: "Keys with a red keychain",
        kept_at: "With me",
        contact: "0812xxx4567",
        image: "",
        status: "active",
      },
      {
        id: found3,
        category: "Books",
        date_found: "2026-07-09",
        location: "Main Library",
        description: "Calculus textbook with handwritten notes",
        kept_at: "Library desk",
        contact: "library@abu.edu.ng",
        image: "",
        status: "active",
      },
    ],
    matches: [
      { id: uuidv4(), lost_id: lost1, found_id: found1, score: 78, status: "pending" },
      { id: uuidv4(), lost_id: lost2, found_id: found3, score: 45, status: "pending" },
    ],
  };
  saveDB(db);
  res.json({ success: true });
});

const dist = path.join(__dirname, "../client/dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.listen(PORT, () => console.log("API on http://localhost:" + PORT));