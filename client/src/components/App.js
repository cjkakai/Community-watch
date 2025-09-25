import React from "react";
import { Switch, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Home from "./Home";
import CrimeReports from "./CrimeReports";
import Officers from "./Officers";
import Assignments from "./Assignments";
import Login from "./Login";
import { AuthProvider } from "../context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        {/* Routes */}
        <main className="flex-1 w-full">
          <Switch>
            {/* Full width landing page */}
            <Route exact path="/" component={Home} />

            {/* Wrapped routes (centered content) */}
            <div className="p-6 max-w-7xl mx-auto w-full">
              <Route exact path="/dashboard" component={Dashboard} />
              <Route path="/login" component={Login} />
              <Route path="/reports" component={CrimeReports} />
              <Route path="/officers" component={Officers} />
              <Route path="/assignments" component={Assignments} />
            </div>
          </Switch>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
