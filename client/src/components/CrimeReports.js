import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "./Navbar";

function CrimeReports() {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("/reports"),
      fetch("/categories"),
      fetch("/assignments"),
    ])
      .then((res) => Promise.all(res.map((r) => r.json())))
      .then(([reportsData, categoriesData, assignmentsData]) => {
        setReports(reportsData);
        setCategories(categoriesData);
        setAssignments(assignmentsData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const getReportAssignments = (reportId) =>
    assignments.filter((a) => a.crime_report_id === reportId);

  const handleReportClick = (report) => setSelectedReport(report);
  const closeModal = () => setSelectedReport(null);

  // Filtering
  let filteredReports = reports;
  if (selectedStatus !== "all") {
    filteredReports = filteredReports.filter(
      (r) => r.status === selectedStatus
    );
  }
  if (selectedCategory !== "all") {
    filteredReports = filteredReports.filter(
      (r) => r.crime_category_id === parseInt(selectedCategory)
    );
  }
  if (searchTerm) {
    filteredReports = filteredReports.filter(
      (r) =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-red-500 tracking-tight">
            Crime Reports
          </h1>
          {user && (
            <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 transition">
              + New Report
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-slate-900 bg-opacity-70 p-4 sm:p-6 rounded-xl shadow-md border border-slate-800 mb-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:flex-1 px-3 py-2 border border-slate-700 rounded-md text-sm bg-slate-800 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500"
          />

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-slate-700 rounded-md text-sm bg-slate-800 text-slate-100 w-full sm:w-40 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-slate-700 rounded-md text-sm bg-slate-800 text-slate-100 w-full sm:w-48 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Count */}
        <div className="mb-6 text-slate-400 text-sm">
          Showing {filteredReports.length} of {reports.length} reports
        </div>

        {/* Reports Grid */}
        {filteredReports.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredReports.map((report) => {
              const reportAssignments = getReportAssignments(report.id);
              return (
                <div
                  key={report.id}
                  className={`bg-slate-900 bg-opacity-60 rounded-xl shadow-sm border border-slate-800 p-6 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200 border-l-4 ${
                    report.status === "open"
                      ? "border-l-red-500"
                      : report.status === "pending"
                      ? "border-l-amber-400"
                      : "border-l-green-400"
                  }`}
                  onClick={() => handleReportClick(report)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-slate-100">
                      {report.title}
                    </h3>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
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

                  <p className="text-sm text-slate-300 mb-1">
                    📍 {report.location}
                  </p>
                  <p className="text-sm text-slate-300 mb-1">
                    🏷️ {report.crime_category.name}
                  </p>
                  <p className="text-sm text-slate-400 mb-1">
                    📅 {new Date(report.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-slate-400 mb-3">
                    👮 {reportAssignments.length} officer(s)
                  </p>

                  <p className="text-slate-300 text-sm line-clamp-3">
                    {report.description}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-12 bg-slate-900 bg-opacity-70 rounded-xl shadow-md border border-slate-800">
            <h3 className="text-lg font-semibold text-slate-100 mb-2">
              No reports found
            </h3>
            <p className="text-slate-400">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CrimeReports;
