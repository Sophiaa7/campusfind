import { useEffect, useState } from "react";
import { api } from "../api";

export default function Matches() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getMatches().then(setRows).catch((err) => setError(err.message));
  }, []);

  async function recover(id) {
    await api.recover(id);
    setRows(rows.filter((r) => r.match_id !== id));
  }

  return (
    <section className="wrap">
      <h1>Possible Matches</h1>
      <p className="muted">Matched by category, location, and description.</p>
      {error && <p className="error">{error}</p>}
      {rows.length === 0 && <p>No matches yet. Load demo data on the home page.</p>}
      {rows.map((m) => (
        <article className="snapshot" key={m.match_id}>
          <b>{Math.round(m.score)}% match</b>
          {(m.lost_image || m.found_image) && (
            <div className="photos">
              {m.lost_image && <img src={m.lost_image} alt="Lost item" />}
              {m.found_image && <img src={m.found_image} alt="Found item" />}
            </div>
          )}
          <p>
            <strong>Lost:</strong> {m.lost_description}
          </p>
          <p className="muted">
            {m.lost_category} · {m.lost_location} · {m.date_lost}
          </p>
          <p>
            <strong>Found:</strong> {m.found_description}
          </p>
          <p className="muted">
            {m.found_category} · {m.found_location} · {m.date_found}
          </p>
          <p>Kept at: {m.kept_at}</p>
          <p>
            Contact the finder: <a href={"tel:" + m.found_contact}>{m.found_contact}</a>
          </p>
          <button onClick={() => recover(m.match_id)}>Mark as recovered</button>
        </article>
      ))}
    </section>
  );
}

