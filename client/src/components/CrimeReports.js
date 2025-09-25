import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CrimeReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch("/reports")
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => console.error("Error fetching reports:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-slate-900 bg-opacity-80 backdrop-blur-md shadow-md sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-red-500">🚨 Crime Reports</h1>
        <div className="flex gap-6 text-sm">
          <Link to="/" className="hover:text-red-400">Home</Link>
          <Link to="/reports" className="text-red-400 font-semibold">Reports</Link>
          <Link to="/officers" className="hover:text-red-400">Officers</Link>
          <Link to="/assignments" className="hover:text-red-400">Assignments</Link>
          <Link to="/login" className="hover:text-red-400">Login</Link>
        </div>
      </nav>

      {/* Reports Section */}
      <div className="px-8 py-10">
        <h2 className="text-3xl font-extrabold mb-6 text-red-400">All Crime Reports</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="p-6 rounded-xl bg-slate-900 bg-opacity-60 backdrop-blur-lg shadow-lg hover:scale-[1.02] transition-transform border-l-4
                border-red-500/40"
            >
              <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
              <p className="text-sm text-slate-400 mb-1">📍 {report.location}</p>
              <p className="text-sm text-slate-500 mb-3">
                🕒 {new Date(report.created_at).toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 mb-2">
                Category: {report.crime_category?.name || "Uncategorized"}
              </p>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold
                  ${
                    report.status === "open"
                      ? "bg-red-600 text-white"
                      : report.status === "pending"
                      ? "bg-amber-400 text-black"
                      : "bg-green-500 text-white"
                  }`}
              >
                {report.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        {reports.length === 0 && (
          <p className="text-center text-slate-400 mt-10">
            No reports available 🚔
          </p>
        )}
      </div>
    </div>
  );
}

export default CrimeReports;
