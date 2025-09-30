import React from "react";
import { Switch, Route } from "react-router-dom";
import Navigation from "./Navigation";
import Dashboard from "./Dashboard";
import Home from "./Home";
import CrimeReports from "./CrimeReports";
import NewCrimeReport from "./NewCrimeReport";
import Officers from "./Officers";
import Assignments from "./Assignments";
import NewAssignment from "./NewAssignment";
import Login from "./Login";
import Signup from "./Signup";
import { AuthProvider } from "../context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 w-full">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route exact path="/reports" component={CrimeReports} />
            <Route path="/reports/new" component={NewCrimeReport} />
            <Route path="/officers" component={Officers} />
            <Route exact path="/assignments" component={Assignments} />
            <Route path="/assignments/new" component={NewAssignment} />
          </Switch>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
