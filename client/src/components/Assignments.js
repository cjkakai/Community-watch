import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  assignments,
  policeOfficers,
  crimeReports,
  getOfficerAssignments,
  getReportAssignments
} from "../data/mockData";

function Assignments() {
  const { user } = useContext(AuthContext);
  const [viewMode, setViewMode] = useState("all"); // all, by-officer, by-case
  const [selectedOfficer, setSelectedOfficer] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  if (!user) {
    return (
      <div className="text-center p-12 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-600 text-lg">
        Please log in to view assignments.
      </div>
    );
  }

  // Filter assignments based on selected filters
  let filteredAssignments = assignments;

  if (selectedOfficer !== "all") {
    filteredAssignments = filteredAssignments.filter(assignment => 
      assignment.officer_id === parseInt(selectedOfficer)
    );
  }

  if (selectedStatus !== "all") {
    filteredAssignments = filteredAssignments.filter(assignment => 
      assignment.crime_report.status === selectedStatus
    );
  }

  if (searchTerm) {
    filteredAssignments = filteredAssignments.filter(assignment =>
      assignment.crime_report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.role_in_case.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const groupedByOfficer = policeOfficers.map(officer => ({
    officer,
    assignments: getOfficerAssignments(officer.id)
  }));

  const groupedByCase = crimeReports.map(report => ({
    report,
    assignments: getReportAssignments(report.id)
  }));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Case Assignments</h1>
        {user.role === 'admin' && (
          <button className="btn btn-primary">+ New Assignment</button>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-6">
        <div className="flex gap-4 mb-6 border-b border-slate-200">
          <button
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              viewMode === 'all'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => setViewMode('all')}
          >
            All Assignments
          </button>
          <button
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              viewMode === 'by-officer'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => setViewMode('by-officer')}
          >
            By Officer
          </button>
          <button
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              viewMode === 'by-case'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => setViewMode('by-case')}
          >
            By Case
          </button>
        </div>

        {viewMode === 'all' && (
          <>
            <div className="flex gap-6 items-center flex-wrap mt-6">
              <div className="flex-1 min-w-64">
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                />
              </div>

              <div className="flex gap-4">
                <select
                  value={selectedOfficer}
                  onChange={(e) => setSelectedOfficer(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white min-w-32"
                >
                  <option value="all">All Officers</option>
                  {policeOfficers.map(officer => (
                    <option key={officer.id} value={officer.id}>
                      {officer.name}
                    </option>
                  ))}
                </select>

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
              </div>
            </div>
          </>
        )}
      </div>

      {viewMode === 'all' && (
        <>
          <div className="mb-6 text-slate-600 text-sm">
            Showing {filteredAssignments.length} of {assignments.length} assignments
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {filteredAssignments.map(assignment => (
              <div key={assignment.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:-translate-y-1 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4 gap-4">
                  <h3 className="text-lg font-semibold text-slate-900 leading-tight flex-1">{assignment.crime_report.title}</h3>
                  <span className={`status-badge status-${assignment.crime_report.status}`}>
                    {assignment.crime_report.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex gap-6 mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 mb-1 flex items-center gap-1">
                      📍 {assignment.crime_report.location}
                    </p>
                    <p className="text-sm text-slate-600 mb-1 flex items-center gap-1">
                      🏷️ {assignment.crime_report.crime_category.name}
                    </p>
                    <p className="text-sm text-slate-600 flex items-center gap-1">
                      📅 Reported: {new Date(assignment.crime_report.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {assignment.officer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{assignment.officer.name}</h4>
                      <p className="text-xs text-slate-600">{assignment.officer.rank}</p>
                      <span className="text-xs text-primary-600 font-medium">{assignment.role_in_case}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <span className="text-xs text-slate-500">
                    Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {viewMode === 'by-officer' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {groupedByOfficer.map(({ officer, assignments }) => (
            <div key={officer.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-bold text-sm">
                    {officer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{officer.name}</h3>
                    <p className="text-sm text-slate-600">{officer.rank} - {officer.role}</p>
                  </div>
                </div>
                <span className="text-sm text-slate-600 font-medium">
                  {assignments.length} assignment(s)
                </span>
              </div>

              <div className="p-6">
                {assignments.map(assignment => (
                  <div key={assignment.id} className="p-4 mb-3 last:mb-0 bg-slate-50 rounded-md border border-slate-200">
                    <h4 className="text-base font-semibold text-slate-900 mb-1">{assignment.crime_report.title}</h4>
                    <p className="text-sm text-slate-600 mb-3">{assignment.crime_report.location}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-primary-600 font-medium">{assignment.role_in_case}</span>
                      <span className={`status-badge status-${assignment.crime_report.status}`}>
                        {assignment.crime_report.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
                {assignments.length === 0 && (
                  <p className="text-slate-600 text-center py-4">No current assignments</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'by-case' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {groupedByCase.filter(({ assignments }) => assignments.length > 0).map(({ report, assignments }) => (
            <div key={report.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-slate-50">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{report.title}</h3>
                    <p className="text-sm text-slate-600">{report.location}</p>
                  </div>
                  <span className={`status-badge status-${report.status}`}>
                    {report.status.toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-slate-600 font-medium">
                  {assignments.length} officer(s) assigned
                </span>
              </div>

              <div className="p-6">
                {assignments.map(assignment => (
                  <div key={assignment.id} className="flex items-center gap-3 p-3 mb-3 last:mb-0 bg-slate-50 rounded-md border border-slate-200">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {assignment.officer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-slate-900">{assignment.officer.name}</h4>
                      <p className="text-xs text-slate-600">{assignment.officer.rank}</p>
                      <span className="text-xs text-primary-600 font-medium">{assignment.role_in_case}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {((viewMode === 'all' && filteredAssignments.length === 0) ||
        (viewMode === 'by-officer' && groupedByOfficer.every(g => g.assignments.length === 0)) ||
        (viewMode === 'by-case' && groupedByCase.every(g => g.assignments.length === 0))) && (
        <div className="text-center p-12 bg-white rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No assignments found</h3>
          <p className="text-slate-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  );
}

export default Assignments;
