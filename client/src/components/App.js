import React from "react";
import { Switch, Route } from "react-router-dom";
import Navigation from "./Navigation";
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
        <Navigation />
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          <Switch>
            <Route exact path="/" component={Home} />
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
