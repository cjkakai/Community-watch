import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Assignments() {
  const { user } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [reports, setReports] = useState([]);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignmentsRes, officersRes, reportsRes] = await Promise.all([
        fetch('/assignments'),
        fetch('/officers'),
        fetch('/reports')
      ]);

      const [assignmentsData, officersData, reportsData] = await Promise.all([
        assignmentsRes.json(),
        officersRes.json(),
        reportsRes.json()
      ]);

      setAssignments(assignmentsData);
      setOfficers(officersData);
      setReports(reportsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;

    try {
      const response = await fetch(`/assignments/${assignmentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setAssignments(assignments.filter(assignment => assignment.id !== assignmentId));
      }
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment.id);
    setEditForm({
      role_in_case: assignment.role_in_case,
      officer_id: assignment.officer_id,
      crime_report_id: assignment.crime_report_id
    });
  };

  const handleUpdate = async (assignmentId) => {
    try {
      const response = await fetch(`/assignments/${assignmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const updatedAssignment = await response.json();
        setAssignments(assignments.map(assignment => 
          assignment.id === assignmentId ? updatedAssignment : assignment
        ));
        setEditingAssignment(null);
      }
    } catch (error) {
      console.error('Error updating assignment:', error);
    }
  };

  const getOfficerName = (officerId) => {
    const officer = officers.find(off => off.id === officerId);
    return officer ? officer.name : 'Unknown Officer';
  };

  const getReportTitle = (reportId) => {
    const report = reports.find(rep => rep.id === reportId);
    return report ? report.title : 'Unknown Report';
  };

  if (!user) {
    return <div>Please log in to view assignments.</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Assignments</h1>
        <Link to="/assignments/new" className="btn btn-primary">
          New Assignment
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">All Assignments</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Officer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Crime Report
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Role in Case
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Assigned Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {assignments.map(assignment => (
                <tr key={assignment.id} className="hover:bg-slate-50">
                  {editingAssignment === assignment.id ? (
                    <>
                      <td className="px-6 py-4">
                        <select
                          value={editForm.officer_id}
                          onChange={(e) => setEditForm({...editForm, officer_id: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md"
                        >
                          {officers.map(officer => (
                            <option key={officer.id} value={officer.id}>
                              {officer.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={editForm.crime_report_id}
                          onChange={(e) => setEditForm({...editForm, crime_report_id: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md"
                        >
                          {reports.map(report => (
                            <option key={report.id} value={report.id}>
                              {report.title}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editForm.role_in_case}
                          onChange={(e) => setEditForm({...editForm, role_in_case: e.target.value})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {new Date(assignment.assigned_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(assignment.id)}
                            className="btn btn-sm btn-primary"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingAssignment(null)}
                            className="btn btn-sm btn-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900">
                          {getOfficerName(assignment.officer_id)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">
                          {getReportTitle(assignment.crime_report_id)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                          {assignment.role_in_case}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {new Date(assignment.assigned_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(assignment)}
                            className="btn btn-sm btn-secondary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(assignment.id)}
                            className="btn btn-sm btn-danger"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {assignments.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No assignments found. <Link to="/assignments/new" className="text-primary-600 hover:text-primary-700">Create one</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Assignments;
