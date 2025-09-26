import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user } = useContext(AuthContext);

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 bg-slate-900 shadow-md">
      <h1 className="text-2xl font-bold text-red-500">🚨 Crime Watch</h1>
      <div className="flex gap-6 text-sm">
        <Link to="/" className="hover:text-red-400">Home</Link>
        <Link to="/reports" className="hover:text-red-400">Reports</Link>
        <Link to="/officers" className="hover:text-red-400">Officers</Link>
        <Link to="/assignments" className="hover:text-red-400">Assignments</Link>
        {user ? (
          <span className="text-slate-300">{user.name}</span>
        ) : (
          <Link to="/login" className="hover:text-red-400">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
