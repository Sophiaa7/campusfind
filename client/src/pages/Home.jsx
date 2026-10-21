import { useEffect, useState } from "react";
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
      <h1>Lost something?<br /><span>Let's help you find it.</span></h1>
      <p className="muted">
        CampusFind is the smart lost-and-found platform for Ahmadu Bello University.
      </p>
      {stats && (
        <div className="snapshot">
          <h3>Platform Snapshot</h3>
          <p>Lost: {stats.lostReports}</p>
          <p>Found: {stats.foundReports}</p>
          <p>Matches: {stats.possibleMatches}</p>
          <p>Recovered: {stats.recovered}</p>
          <button onClick={demo}>Load sample demo data</button>
          {msg && <p>{msg}</p>}
        </div>
      )}
    </section>
  );
}