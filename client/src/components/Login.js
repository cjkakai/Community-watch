import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const history = useHistory();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = login(formData.email, formData.password);

    if (result.success) {
      history.push("/");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-700 p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-center mb-2 text-slate-900 text-3xl font-bold">Community Watch Login</h2>
        <p className="text-center text-slate-600 mb-8 text-sm">Sign in to access the police management system</p>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md border border-red-200 mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full btn btn-primary py-3 text-base font-semibold mt-4"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="bg-slate-50 p-6 rounded-md border border-slate-200">
          <h4 className="mb-2 text-slate-900 text-sm font-semibold">Demo Credentials:</h4>
          <p className="mb-1 text-xs text-slate-600">
            <strong className="text-slate-900">Admin:</strong> john.smith@police.gov / password123
          </p>
          <p className="text-xs text-slate-600">
            <strong className="text-slate-900">Officer:</strong> sarah.johnson@police.gov / password123
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
