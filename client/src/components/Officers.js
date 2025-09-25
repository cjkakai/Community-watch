import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
// import {
//   policeOfficers,
//   getOfficerAssignments
// } from "../data/mockData";

function Officers() {
  const { user } = useContext(AuthContext);
  const [officers, setOfficers] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [selectedRole, setSelectedRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOfficer, setSelectedOfficer] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/officers'),
      fetch('/assignments'),

    ])
    .then(responses => Promise.all(responses.map(r => r.json())))
    .then(([officersData, assignmentsData]) => {
      setOfficers(officersData);
      setAssignments(assignmentsData)
    })
    .catch(error=>console.error('Error Fetching data:',error));
  },[]);

  const getOfficerAssignments = (officerId) => {
    return assignments.filter(assignment => assignment.officer_id === officerId);
  };

  if (!user) {
    return (
      <div className="text-center p-12 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-600 text-lg">
        Please log in to view officers.
      </div>
    );
  }

  // Filter officers based on selected filters
  let filteredOfficers = officers;

  if (selectedRole !== "all") {
    filteredOfficers = filteredOfficers.filter(officer => officer.role === selectedRole);
  }

  if (searchTerm) {
    filteredOfficers = filteredOfficers.filter(officer =>
      officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.badge_number.includes(searchTerm) ||
      officer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.rank.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const handleOfficerClick = (officer) => {
    setSelectedOfficer(officer);
  };

  const closeModal = () => {
    setSelectedOfficer(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Police Officers</h1>
        {user.role === 'admin' && (
          <button className="btn btn-primary">+ Add Officer</button>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-6 flex gap-6 items-center flex-wrap">
        <div className="flex-1 min-w-64">
          <input
            type="text"
            placeholder="Search officers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
          />
        </div>

        <div className="flex gap-4">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white min-w-32"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="officer">Officer</option>
          </select>
        </div>
      </div>

      <div className="mb-6 text-slate-600 text-sm">
        Showing {filteredOfficers.length} of {officers.length} officers
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredOfficers.map(officer => {
          const officerAssignments = getOfficerAssignments(officer.id);
          return (
            <div
              key={officer.id}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all"
              onClick={() => handleOfficerClick(officer)}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-15 h-15 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {officer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{officer.name}</h3>
                  <p className="text-slate-600 text-sm mb-2">{officer.rank}</p>
                  <span className={`role-badge role-${officer.role}`}>
                    {officer.role.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-slate-600 mb-1 flex items-center gap-1">
                  🆔 Badge: {officer.badge_number}
                </p>
                <p className="text-sm text-slate-600 mb-1 flex items-center gap-1">
                  📧 {officer.email}
                </p>
                <p className="text-sm text-slate-600 mb-1 flex items-center gap-1">
                  📞 {officer.phone}
                </p>
                <p className="text-sm text-slate-600 flex items-center gap-1">
                  📋 {officerAssignments.length} active assignment(s)
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500">
                  Joined: {new Date(officer.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOfficers.length === 0 && (
        <div className="text-center p-12 bg-white rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No officers found</h3>
          <p className="text-slate-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}

      {/* Officer Detail Modal */}
      {selectedOfficer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6" onClick={closeModal}>
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
              <h2 className="text-2xl font-semibold text-slate-900 m-0">{selectedOfficer.name}</h2>
              <button
                className="bg-none border-none text-2xl text-slate-600 cursor-pointer p-1 rounded-md hover:bg-slate-100 hover:text-slate-900 transition-all"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  {selectedOfficer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-1">{selectedOfficer.name}</h3>
                  <p className="text-slate-600 text-base mb-2">{selectedOfficer.rank}</p>
                  <span className={`role-badge role-${selectedOfficer.role}`}>
                    {selectedOfficer.role.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wide">Badge Number:</label>
                  <span className="text-sm text-slate-900">{selectedOfficer.badge_number}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wide">Email:</label>
                  <span className="text-sm text-slate-900">{selectedOfficer.email}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wide">Phone:</label>
                  <span className="text-sm text-slate-900">{selectedOfficer.phone}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wide">Joined:</label>
                  <span className="text-sm text-slate-900">{new Date(selectedOfficer.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Current Assignments:</label>
                <div className="flex flex-col gap-3">
                  {getOfficerAssignments(selectedOfficer.id).map(assignment => (
                    <div key={assignment.id} className="p-4 bg-slate-50 rounded-md border border-slate-200">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h4 className="text-base font-semibold text-slate-900 mb-1">{assignment.crime_report.title}</h4>
                          <p className="text-sm text-slate-600 mb-2">{assignment.crime_report.location}</p>
                          <span className="text-xs text-primary-600 font-medium">{assignment.role_in_case}</span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`status-badge status-${assignment.crime_report.status}`}>
                            {assignment.crime_report.status.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-500">
                            Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {getOfficerAssignments(selectedOfficer.id).length === 0 && (
                    <p className="text-slate-600 text-center py-4">No current assignments</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 p-6 border-t border-slate-200 bg-slate-50">
              <button className="btn btn-secondary" onClick={closeModal}>
                Close
              </button>
              {user.role === 'admin' && (
                <>
                  <button className="btn btn-primary">Edit Officer</button>
                  <button className="btn btn-warning">Assign to Case</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Officers;
