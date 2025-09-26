import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

function Home() {
  const [stats, setStats] = useState({
    totalReports: 0,
    openReports: 0,
    pendingReports: 0,
    closedReports: 0,
    totalOfficers: 0,
    totalAssignments: 0,
  });

  const [recentReports, setRecentReports] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("/reports"),
      fetch("/assignments"),
      fetch("/officers"),
    ])
      .then((responses) => Promise.all(responses.map((r) => r.json())))
      .then(([reports, assignments, officers]) => {
        const openReports = reports.filter((r) => r.status === "open").length;
        const pendingReports = reports.filter((r) => r.status === "pending").length;
        const closedReports = reports.filter((r) => r.status === "closed").length;

        setStats({
          totalReports: reports.length,
          openReports,
          pendingReports,
          closedReports,
          totalOfficers: officers.length,
          totalAssignments: assignments.length,
        });

        setRecentReports(reports.slice(0, 5));
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      {/* Hero Banner */}
      <div
        className="relative w-full h-80 flex items-center justify-center text-center"
        style={{
          backgroundImage: "url('/bgimage.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold text-red-500 drop-shadow-lg">
            Welcome back, Officer
          </h2>
          <p className="text-slate-300 mt-2">
            Stay updated with live reports and officer assignments
          </p>
        </div>
      </div>

      {/* Dashboard Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 w-full p-6">
        {[
          { label: "Total Reports", value: stats.totalReports, color: "text-slate-100" },
          { label: "Open Cases", value: stats.openReports, color: "text-red-500" },
          { label: "Pending Cases", value: stats.pendingReports, color: "text-amber-400" },
          { label: "Closed Cases", value: stats.closedReports, color: "text-green-400" },
          { label: "Total Officers", value: stats.totalOfficers, color: "text-blue-400" },
          { label: "Active Assignments", value: stats.totalAssignments, color: "text-purple-400" },
        ].map((card, i) => (
          <div
            key={i}
            className="p-6 rounded-xl bg-slate-900 bg-opacity-60 backdrop-blur-md shadow-lg text-center hover:scale-105 transition-transform"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-2 text-slate-400">
              {card.label}
            </h3>
            <div className={`text-3xl font-extrabold ${card.color}`}>
              {card.value}
            </div>
          </div>
        ))}
      </section>

      {/* Recent Reports */}
      <section className="w-full p-6 flex-1">
        <div className="bg-slate-900 bg-opacity-70 rounded-lg shadow-xl overflow-hidden h-full">
          <div className="flex justify-between items-center p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold">Recent Crime Reports</h2>
            <Link
              to="/reports"
              className="text-red-400 hover:text-red-500 text-sm font-medium transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="p-6 space-y-4">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className={`flex justify-between items-start p-4 rounded-md border-l-4 bg-slate-800 hover:bg-slate-700 transition-all ${
                  report.status === "open"
                    ? "border-l-red-500"
                    : report.status === "pending"
                    ? "border-l-amber-400"
                    : "border-l-green-400"
                }`}
              >
                <div className="flex-1">
                  <h4 className="text-sm font-semibold mb-1">{report.title}</h4>
                  <p className="text-xs text-slate-400">{report.location}</p>
                  <p className="text-xs text-slate-500">{report.crime_category.name}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      report.status === "open"
                        ? "bg-red-600 text-white"
                        : report.status === "pending"
                        ? "bg-amber-400 text-black"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {report.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(report.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
