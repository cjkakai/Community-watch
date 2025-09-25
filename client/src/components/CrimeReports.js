import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

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
    Promise.all([fetch("/reports"), fetch("/categories"), fetch("/assignments")])
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
    filteredReports = filteredReports.filter((r) => r.status === selectedStatus);
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
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-100">Crime Reports</h1>
        {user && (
          <button className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium shadow-md transition">
            + New Report
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 mb-6 flex gap-6 items-center flex-wrap">
        <div className="flex-1 min-w-64">
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 rounded-md text-sm border border-slate-600 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-slate-600 rounded-md text-sm bg-slate-900 text-slate-200 focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-slate-600 rounded-md text-sm bg-slate-900 text-slate-200 focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Count */}
      <div className="mb-6 text-slate-400 text-sm">
        Showing {filteredReports.length} of {reports.length} reports
      </div>

      {/* Report Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredReports.map((report) => {
          const reportAssignments = getReportAssignments(report.id);
          return (
            <div
              key={report.id}
              onClick={() => handleReportClick(report)}
              className={`bg-slate-800 rounded-xl shadow-md border border-slate-700 p-6 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all border-l-4 ${
                report.status === "open"
                  ? "border-l-red-500"
                  : report.status === "pending"
                  ? "border-l-amber-500"
                  : "border-l-green-500"
              }`}
            >
              <div className="flex justify-between items-start mb-4 gap-4">
                <h3 className="text-lg font-semibold text-slate-100 leading-tight flex-1">
                  {report.title}
                </h3>
                <span
                  className={`px-2 py-1 rounded-md text-xs font-bold ${
                    report.status === "open"
                      ? "bg-red-500/20 text-red-400"
                      : report.status === "pending"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {report.status.toUpperCase()}
                </span>
              </div>

              <div className="mb-4 text-slate-400 text-sm space-y-1">
                <p>📍 {report.location}</p>
                <p>🏷️ {report.crime_category.name}</p>
                <p>📅 {new Date(report.created_at).toLocaleDateString()}</p>
                <p>👮 {reportAssignments.length} officer(s) assigned</p>
              </div>

              <div className="text-slate-300 text-sm leading-relaxed">
                <p>{report.description.substring(0, 100)}...</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredReports.length === 0 && (
        <div className="text-center p-12 bg-slate-800 rounded-xl shadow-md border border-slate-700">
          <h3 className="text-xl font-semibold text-slate-100 mb-2">
            No reports found
          </h3>
          <p className="text-slate-400">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}

      {/* Report Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-6"
          onClick={closeModal}
        >
          <div
            className="bg-slate-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h2 className="text-2xl font-semibold text-slate-100">
                {selectedReport.title}
              </h2>
              <button
                onClick={closeModal}
                className="text-2xl text-slate-400 hover:text-slate-100 transition"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 text-sm">
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {selectedReport.status.toUpperCase()}
                </p>
                <p>
                  <span className="font-semibold">Category:</span>{" "}
                  {selectedReport.crime_category.name}
                </p>
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {selectedReport.location}
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(selectedReport.created_at).toLocaleString()}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-200 mb-2">
                  Description
                </h3>
                <p className="text-slate-300">{selectedReport.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-200 mb-2">
                  Assigned Officers
                </h3>
                <div className="flex flex-col gap-2">
                  {getReportAssignments(selectedReport.id).map((a) => (
                    <div
                      key={a.id}
                      className="flex justify-between items-center p-3 bg-slate-800 rounded-md border border-slate-700"
                    >
                      <span className="text-slate-200 font-medium">
                        {a.officer.name}
                      </span>
                      <span className="text-slate-400 text-sm">
                        ({a.role_in_case})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 p-6 border-t border-slate-700 bg-slate-800">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition"
              >
                Close
              </button>
              {user?.role === "admin" && (
                <>
                  <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition">
                    Edit Report
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition">
                    Assign Officer
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CrimeReports;
