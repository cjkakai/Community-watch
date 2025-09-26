import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function CrimeReports() {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [editingReport, setEditingReport] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reportsRes, categoriesRes, assignmentsRes] = await Promise.all([
        fetch('/reports'),
        fetch('/categories'),
        fetch('/assignments')
      ]);

      const [reportsData, categoriesData, assignmentsData] = await Promise.all([
        reportsRes.json(),
        categoriesRes.json(),
        assignmentsRes.json()
      ]);

      setReports(reportsData);
      setCategories(categoriesData);
      setAssignments(assignmentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;

    try {
      const response = await fetch(`/reports/${reportId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setReports(reports.filter(report => report.id !== reportId));
        setSelectedReport(null);
      }
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  const handleEdit = (report) => {
    setEditingReport(report.id);
    setEditForm({
      title: report.title,
      description: report.description,
      location: report.location,
      status: report.status,
      crime_category_id: report.crime_category_id
    });
  };

  const handleUpdate = async (reportId) => {
    try {
      const response = await fetch(`/reports/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const updatedReport = await response.json();
        setReports(reports.map(report => 
          report.id === reportId ? updatedReport : report
        ));
        setEditingReport(null);
        setSelectedReport(updatedReport);
      }
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  const getReportAssignments = (reportId) => {
    return assignments.filter(assignment => assignment.crime_report_id === reportId);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return <div>Please log in to view reports.</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Crime Reports</h1>
        <Link to="/reports/new" className="btn btn-primary">
          New Report
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">All Reports</h2>
          </div>
          <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
            {reports.map(report => (
              <div
                key={report.id}
                className={`p-4 cursor-pointer hover:bg-slate-50 ${
                  selectedReport?.id === report.id ? 'bg-primary-50' : ''
                }`}
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-slate-900">{report.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-2">{report.location}</p>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>{getCategoryName(report.crime_category_id)}</span>
                  <span>{new Date(report.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedReport && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-slate-900">Report Details</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(selectedReport)}
                    className="btn btn-sm btn-secondary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(selectedReport.id)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {editingReport === selectedReport.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      rows="3"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    >
                      <option value="open">Open</option>
                      <option value="pending">Pending</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(selectedReport.id)}
                      className="btn btn-primary"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingReport(null)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-slate-900 mb-2">{selectedReport.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}>
                      {selectedReport.status}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-slate-700 mb-1">Description</h4>
                    <p className="text-slate-600">{selectedReport.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-slate-700 mb-1">Location</h4>
                      <p className="text-slate-600">{selectedReport.location}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-700 mb-1">Category</h4>
                      <p className="text-slate-600">{getCategoryName(selectedReport.crime_category_id)}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Assigned Officers</h4>
                    <div className="space-y-2">
                      {getReportAssignments(selectedReport.id).map(assignment => (
                        <div key={assignment.id} className="bg-slate-50 p-3 rounded">
                          <p className="font-medium">{assignment.officer.name}</p>
                          <p className="text-sm text-slate-600">{assignment.role_in_case}</p>
                        </div>
                      ))}
                      {getReportAssignments(selectedReport.id).length === 0 && (
                        <p className="text-slate-500 text-sm">No officers assigned</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CrimeReports;
