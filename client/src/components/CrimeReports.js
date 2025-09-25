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
    // Fetch reports, categories, and assignments
    Promise.all([
      fetch('/reports'),
      fetch('/categories'),
      fetch('/assignments')
    ])
    .then(responses => Promise.all(responses.map(r => r.json())))
    .then(([reportsData, categoriesData, assignmentsData]) => {
      setReports(reportsData);
      setCategories(categoriesData);
      setAssignments(assignmentsData);
    })
    .catch(error => console.error('Error fetching data:', error));
  }, []);

  const getReportAssignments = (reportId) => {
    return assignments.filter(assignment => assignment.crime_report_id === reportId);
  };

  const handleReportClick = (report) => {
    setSelectedReport(report);
  };
  

  // Filter reports based on selected filters
  let filteredReports = reports;

  if (selectedStatus !== "all") {
    filteredReports = filteredReports.filter(report => report.status === selectedStatus);
  }

  if (selectedCategory !== "all") {
    filteredReports = filteredReports.filter(report =>
      report.crime_category_id === parseInt(selectedCategory)
    );
  }

  if (searchTerm) {
    filteredReports = filteredReports.filter(report =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const closeModal = () => {
    setSelectedReport(null);
  };

  if (!user) {
    return (
      // <div className="text-center p-12 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-600 text-lg">
      //   Please log in to view crime reports.
      // </div>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Crime Reports</h1>
          {/* <button className="btn btn-primary">+ New Report</button> */}
        </div>
        
        {/* Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-6 flex gap-6 items-center flex-wrap">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
            />
          </div>

          <div className="flex gap-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white min-w-32"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="closed">Closed</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white min-w-32"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
          </div>
        </div>
        
        <div className="mb-6 text-slate-600 text-sm">
          Showing {filteredReports.length} of {reports.length} reports
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredReports.map(report => {
            const reportAssignments = getReportAssignments(report.id);
            return (
              <div
                key={report.id}
                className={`bg-white rounded-lg shadow-sm border border-slate-200 p-6 cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all border-l-4 ${
                  report.status === 'open' ? 'border-l-red-500' :
                  report.status === 'pending' ? 'border-l-amber-500' :
                  'border-l-green-500'
                }`}
                onClick={() => handleReportClick(report)}
              >
                <div className="flex justify-between items-start mb-4 gap-4">
                  <h3 className="text-lg font-semibold text-slate-900 leading-tight flex-1">{report.title}</h3>
                  <span className={`status-badge status-${report.status}`}>
                    {report.status.toUpperCase()}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-slate-600 mb-1 flex items-center gap-1">
                    📍 {report.location}
                  </p>
                  <p className="text-sm text-slate-600 mb-1 flex items-center gap-1">
                    🏷️ {report.crime_category.name}
                  </p>
                  <p className="text-sm text-slate-600 mb-1 flex items-center gap-1">
                    📅 {new Date(report.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-slate-600 flex items-center gap-1">
                    👮 {reportAssignments.length} officer(s) assigned
                  </p>
                </div>

                <div className="text-slate-600 text-sm leading-relaxed">
                  <p>{report.description.substring(0, 100)}...</p>
                </div>
              </div>
            );
          })}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center p-12 bg-white rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No reports found</h3>
            <p className="text-slate-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}

        {/* Report Detail Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6" onClick={closeModal}>
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center p-6 border-b border-slate-200">
                <h2 className="text-2xl font-semibold text-slate-900 m-0">{selectedReport.title}</h2>
                <button
                  className="bg-none border-none text-2xl text-slate-600 cursor-pointer p-1 rounded-md hover:bg-slate-100 hover:text-slate-900 transition-all"
                  onClick={closeModal}
                >
                  ×
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex flex-col gap-1">
                    <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wide">Status:</label>
                    <span className={`status-badge status-${selectedReport.status}`}>
                      {selectedReport.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wide">Category:</label>
                    <span className="text-sm text-slate-900">{selectedReport.crime_category.name}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wide">Location:</label>
                    <span className="text-sm text-slate-900">{selectedReport.location}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wide">Date:</label>
                    <span className="text-sm text-slate-900">{new Date(selectedReport.created_at).toLocaleString()}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Description:</label>
                  <p className="text-slate-900 leading-relaxed">{selectedReport.description}</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Assigned Officers:</label>
                  <div className="flex flex-col gap-2">
                    {getReportAssignments(selectedReport.id).map(assignment => (
                      <div key={assignment.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-md border border-slate-200">
                        <span className="font-medium text-slate-900">{assignment.officer.name}</span>
                        <span className="text-sm text-slate-600">({assignment.role_in_case})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 p-6 border-t border-slate-200 bg-slate-50">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Crime Reports</h1>
        <button className="btn btn-primary">+ New Report</button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-6 flex gap-6 items-center flex-wrap">
        <div className="flex-1 min-w-64">
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
          />
        </div>

        <div className="flex gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white min-w-32"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white min-w-32"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6 text-slate-600 text-sm">
        Showing {filteredReports.length} of {reports.length} reports
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredReports.map(report => {
          const reportAssignments = getReportAssignments(report.id);
          return (
            <div
              key={report.id}
              className={`bg-white rounded-lg shadow-sm border border-slate-200 p-6 cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all border-l-4 ${
                report.status === 'open' ? 'border-l-red-500' :
                report.status === 'pending' ? 'border-l-amber-500' :
                'border-l-green-500'
              }`}
              onClick={() => handleReportClick(report)}
            >
              <div className="flex justify-between items-start mb-4 gap-4">
                <h3 className="text-lg font-semibold text-slate-900 leading-tight flex-1">{report.title}</h3>
                <span className={`status-badge status-${report.status}`}>
                  {report.status.toUpperCase()}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm text-slate-600 mb-1 flex items-center gap-1">
                  📍 {report.location}
                </p>
                <p className="text-sm text-slate-600 mb-1 flex items-center gap-1">
                  🏷️ {report.crime_category.name}
                </p>
                <p className="text-sm text-slate-600 mb-1 flex items-center gap-1">
                  📅 {new Date(report.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-slate-600 flex items-center gap-1">
                  👮 {reportAssignments.length} officer(s) assigned
                </p>
              </div>

              <div className="text-slate-600 text-sm leading-relaxed">
                <p>{report.description.substring(0, 100)}...</p>
              </div>
            </div>
          );
        })}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center p-12 bg-white rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No reports found</h3>
          <p className="text-slate-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6" onClick={closeModal}>
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 m-0">{selectedReport.title}</h2>
              <button
                className="bg-none border-none text-2xl text-slate-600 cursor-pointer p-1 rounded-md hover:bg-slate-100 hover:text-slate-900 transition-all"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wide">Status:</label>
                  <span className={`status-badge status-${selectedReport.status}`}>
                    {selectedReport.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wide">Category:</label>
                  <span className="text-sm text-slate-900">{selectedReport.crime_category.name}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wide">Location:</label>
                  <span className="text-sm text-slate-900">{selectedReport.location}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wide">Date:</label>
                  <span className="text-sm text-slate-900">{new Date(selectedReport.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Description:</label>
                <p className="text-slate-900 leading-relaxed">{selectedReport.description}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Assigned Officers:</label>
                <div className="flex flex-col gap-2">
                  {getReportAssignments(selectedReport.id).map(assignment => (
                    <div key={assignment.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-md border border-slate-200">
                      <span className="font-medium text-slate-900">{assignment.officer.name}</span>
                      <span className="text-sm text-slate-600">({assignment.role_in_case})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 p-6 border-t border-slate-200 bg-slate-50">
              <button className="btn btn-secondary" onClick={closeModal}>
                Close
              </button>
              {user.role === 'admin' && (
                <>
                  <button className="btn btn-primary">Edit Report</button>
                  <button className="btn btn-warning">Assign Officer</button>
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
