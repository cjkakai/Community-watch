import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navigation() {
  const { user, logout } = useContext(AuthContext);
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push("/login");
  };

  if (!user) {
    return (
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
            Community Watch
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-slate-600 hover:text-primary-600 hover:bg-slate-50 font-medium px-3 py-2 rounded-md transition-all">
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
          <Link to="/" className="text-slate-600 hover:text-primary-600 hover:bg-slate-50 font-medium px-3 py-2 rounded-md transition-all">
            Dashboard
          </Link>
          <Link to="/reports" className="text-slate-600 hover:text-primary-600 hover:bg-slate-50 font-medium px-3 py-2 rounded-md transition-all">
            Crime Reports
          </Link>
          <Link to="/officers" className="text-slate-600 hover:text-primary-600 hover:bg-slate-50 font-medium px-3 py-2 rounded-md transition-all">
            Officers
          </Link>
          <Link to="/assignments" className="text-slate-600 hover:text-primary-600 hover:bg-slate-50 font-medium px-3 py-2 rounded-md transition-all">
            Assignments
          </Link>
          <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
            <span className="text-slate-600 text-sm">
              {user.name} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="border border-slate-300 text-slate-600 hover:bg-red-500 hover:text-white hover:border-red-500 px-3 py-1 rounded-md text-sm transition-all"
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
