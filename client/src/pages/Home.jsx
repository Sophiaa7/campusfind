import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Home() {
  const [stats, setStats] = useState(null);
  const [msg, setMsg] = useState("");

  async function load() {
    setStats(await api.getStats());
  }

  useEffect(() => {
    load();
  }, []);

  async function demo() {
    await api.loadDemo();
    setMsg("Demo data loaded");
    load();
  }

  return (
    <section className="wrap">
      <div className="hero">
        <h1>
          Lost something?
          <br />
          <span>Let's help you find it.</span>
        </h1>
        <p className="muted">
          CampusFind is the smart lost-and-found platform for Ahmadu Bello University
          and university communities. Report, match, verify and recover items safely.
        </p>
      </div>

      <div className="actions">
        <Link className="action" to="/report-lost">
          <div className="tag lost">!</div>
          <h3>Report Lost Item</h3>
          <p>Lost your phone, ID card, keys or books? Submit a report so others can help you recover it.</p>
        </Link>
        <Link className="action" to="/report-found">
          <div className="tag found">+</div>
          <h3>Report Found Item</h3>
          <p>Found something on campus? Report it so the rightful owner can be matched safely.</p>
        </Link>
      </div>

      {stats && (
        <div className="snapshot">
          <h3>Platform Snapshot</h3>
          <div className="grid">
            <div><b>{stats.lostReports}</b><span>Lost Reports</span></div>
            <div><b>{stats.foundReports}</b><span>Found Reports</span></div>
            <div><b>{stats.possibleMatches}</b><span>Possible Matches</span></div>
            <div><b>{stats.recovered}</b><span>Recovered</span></div>
          </div>
          <button onClick={demo}>Load sample demo data</button>
          {msg && <p>{msg}</p>}
        </div>
      )}
    </section>
  );
}