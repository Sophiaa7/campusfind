import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import ReportLost from "./pages/ReportLost";
import ReportFound from "./pages/ReportFound";
import Matches from "./pages/Matches";
import HowItWorks from "./pages/HowItWorks";

export default function App() {
  return (
    <div className="app">
      <header className="header">
       <Link to="/" className="logo">
          <img src="/logo.jpg.png" alt="" className="logo-mark" />
           CampusFind
        </Link>
        <nav>
          <Link to="/report-lost">Lost</Link>
          <Link to="/report-found">Found</Link>
          <Link to="/matches">Matches</Link>
          <Link to="/how-it-works">How it works</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report-lost" element={<ReportLost />} />
          <Route path="/report-found" element={<ReportFound />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
        </Routes>
      </main>
    </div>
  );
}