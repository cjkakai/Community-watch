import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalReports: 0,
    openReports: 0,
    totalOfficers: 0,
    totalAssignments: 0
  });
  const [recentReports, setRecentReports] = useState([]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [reportsRes, officersRes, assignmentsRes] = await Promise.all([
        fetch('/reports'),
        fetch('/officers'),
        fetch('/assignments')
      ]);

      const [reports, officers, assignments] = await Promise.all([
        reportsRes.json(),
        officersRes.json(),
        assignmentsRes.json()
      ]);

      setStats({
        totalReports: reports.length,
        openReports: reports.filter(r => r.status === 'open').length,
        totalOfficers: officers.length,
        totalAssignments: assignments.length
      });

      // Get 5 most recent reports
      const sortedReports = reports
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      setRecentReports(sortedReports);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Welcome to Community Watch</h1>
        <p className="text-slate-600 mb-8">Please log in to access the dashboard.</p>
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mx-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 mt-2">Dashboard</h1>
        <p className="text-slate-600">Welcome back, {user.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Reports</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalReports}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Open Reports</p>
              <p className="text-3xl font-bold text-slate-900">{stats.openReports}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Officers</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalOfficers}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Assignments</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalAssignments}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Recent Reports</h2>
          <div className="space-y-4">
            {recentReports.map(report => (
              <div key={report.id} className="border-l-4 border-primary-500 pl-4">
                <h3 className="font-medium text-slate-900">{report.title}</h3>
                <p className="text-sm text-slate-600 mb-1">{report.location}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-primary-600 font-medium">{report.crime_category?.name}</span>
                  <span className="text-xs text-slate-500">
                    {new Date(report.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            {recentReports.length === 0 && (
              <p className="text-slate-500 text-sm">No reports found</p>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Quick Actions</h2>
          <div className="flex gap-4 flex-wrap">
            <Link to="/reports/new" className="btn btn-primary">
              New Crime Report
            </Link>
            <Link to="/assignments/new" className="btn btn-secondary">
              New Assignment
            </Link>
            {user.role === 'admin' && (
              <Link to="/officers" className="btn btn-secondary">
                Manage Officers
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
