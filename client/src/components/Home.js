import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";

function Home(){

    const [stats,setStats] = useState({
      totalReports:0,
      openReports:0,
      pendingReports:0,
      closedReports:0,
      totalOfficers:0,
      totalAssignments:0,
    });

    const [recentReports, setRecentReports] = useState([]);

    useEffect(() => {
      // Fetching reports and police officer data

      Promise.all([
        fetch('/reports'),
        fetch('/assignments'),
        fetch('/officers'),
      ])
      .then(responses => Promise.all(responses.map(r => r.json())))
      .then(([reports,officers,assignments]) => {
        // manipulating the data
        const openReports = reports.filter(r => r.status === 'open').length;
        const pendingReports = reports.filter(r => r.status === 'pending').length;
        const closedReports = reports.filter(r => r.status === 'closed').length;

        setStats({
          totalReports:reports.length,
          openReports,
          pendingReports,
          closedReports,
          totalOfficers: officers.length,
          totalAssignments: assignments.length
        });
        
        setRecentReports(reports.slice(0, 5));
      })
      .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Crime Watch</h1>
            <p className="text-slate-600">Welcome back, Officer</p>
          </div>
    
                <div className="bg-fit bg-center min-h-screen p-6 rounded-md" style={{ backgroundImage: "url('/police.png')" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
                    <div className="backdrop-blur-sm p-6 rounded-lg shadow-sm  text-center hover:-translate-y-1 transition-transform">
                        <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-2">Total Reports</h3>
                        <div className="text-4xl font-bold text-slate-100">{stats.totalReports}</div>
                    </div>
                    <div className="backdrop-blur-sm p-6 rounded-lg shadow-sm  text-center hover:-translate-y-1 transition-transform">
                        <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-2">Open Cases</h3>
                        <div className="text-4xl font-bold text-red-600">{stats.openReports}</div>
                    </div>
                    <div className="backdrop-blur-sm p-6 rounded-lg shadow-sm  text-center hover:-translate-y-1 transition-transform">
                        <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-2">Pending Cases</h3>
                        <div className="text-4xl font-bold text-blue-500">{stats.pendingReports}</div>
                    </div>
                    <div className="backdrop-blur-sm p-6 rounded-lg shadow-sm  text-center hover:-translate-y-1 transition-transform">
                        <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-2">Closed Cases</h3>
                        <div className="text-4xl font-bold text-green-500">{stats.closedReports}</div>
                    </div>
                    <div className="backdrop-blur-sm p-6 rounded-lg shadow-sm  text-center hover:-translate-y-1 transition-transform">
                        <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-2">Total Officers</h3>
                        <div className="text-4xl font-bold text-slate-300">{stats.totalOfficers}</div>
                    </div>
                    <div className="backdrop-blur-sm p-6 rounded-lg shadow-sm  text-center hover:-translate-y-1 transition-transform">
                        <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-2">Active Assignments</h3>
                        <div className="text-3xl font-bold text-slate-100">{stats.totalAssignments}</div>
                    </div>
                </div>
            </div>
    
          <div className="m-8">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">Recent Crime Reports</h2>
                <Link to="/reports" className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors">View All</Link>
              </div>
              <div className="p-6">
                {recentReports.map(report => (
                  <div key={report.id} className={`flex justify-between items-start p-4 rounded-md mb-4 border-l-4 bg-slate-50 hover:bg-slate-100 hover:translate-x-1 transition-all ${
                    report.status === 'open' ? 'border-l-red-500' :
                    report.status === 'pending' ? 'border-l-amber-500' :
                    'border-l-green-500'
                  }`}>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-slate-900 mb-1">{report.title}</h4>
                      <p className="text-xs text-slate-600 mb-1">{report.location}</p>
                      <p className="text-xs text-slate-600">{report.crime_category.name}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`status-badge status-${report.status}`}>
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
    
            {/* <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">Priority Cases</h2>
                <Link to="/reports?status=open" className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors">View All Open</Link>
              </div>
              <div className="p-6">
                {openReports.slice(0, 3).map(report => (
                  <div key={report.id} className="p-4 rounded-md mb-4 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-primary-300 transition-all">
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">{report.title}</h4>
                    <p className="text-xs text-slate-600 mb-3">{report.location}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-primary-600 font-medium">{report.crime_category.name}</span>
                      <span className="text-xs text-slate-500">
                        {new Date(report.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      );
}

export default Home;