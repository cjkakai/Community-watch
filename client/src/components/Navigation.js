import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navigation() {
  const { user, logout } = useContext(AuthContext);
  const history = useHistory();

  const handleLogout = async () => {
    await logout();
    history.push("/login");
  };

  if (!user) {
    return (
      <nav className="bg-slate-800 border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
            Community Watch
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/signup" className="text-white hover:text-primary-600 hover:bg-slate-50 font-medium px-3 py-2 rounded-md transition-all">
              Sign Up
            </Link>
            <Link to="/login" className="text-white hover:text-primary-600 hover:bg-slate-50 font-medium px-3 py-2 rounded-md transition-all">
              Login
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link to="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
          Community Watch
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-slate-600 hover:text-primary-600 hover:bg-slate-50 font-medium px-3 py-2 rounded-md transition-all">
            Dashboard
          </Link>
          <Link to="/reports" className="text-slate-600 hover:text-primary-600 hover:bg-slate-50 font-medium px-3 py-2 rounded-md transition-all">
            Reports
          </Link>
          <Link to="/officers" className="text-slate-600 hover:text-primary-600 hover:bg-slate-50 font-medium px-3 py-2 rounded-md transition-all">
            Officers
          </Link>
          <Link to="/assignments" className="text-slate-600 hover:text-primary-600 hover:bg-slate-50 font-medium px-3 py-2 rounded-md transition-all">
            Assignments
          </Link>
          
          <div className="flex items-center gap-4 ml-6 pl-6 border-l border-slate-200">
            <span className="text-sm text-slate-600">
              Welcome, <span className="font-medium text-slate-900">{user.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="text-slate-600 hover:text-red-600 hover:bg-red-50 font-medium px-3 py-2 rounded-md transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
