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
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <main className="flex-1 w-full">
          <Switch>
            {/* Home page (landing) */}
            <Route exact path="/" component={Home} />

            {/* Full-width dashboard routes */}
            <Route exact path="/dashboard" component={Dashboard} />
            <Route path="/login" component={Login} />
            <Route path="/reports" component={CrimeReports} />
            <Route path="/officers" component={Officers} />
            <Route path="/assignments" component={Assignments} />
          </Switch>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
