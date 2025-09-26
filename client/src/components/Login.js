import React, { useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../context/AuthContext";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
});

function Login() {
  const { login } = useContext(AuthContext);
  const history = useHistory();

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    const result = await login(values.email, values.password);

    if (result.success) {
      history.push("/dashboard");
    } else {
      setFieldError("password", result.error);
    }
    
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-700 p-6"
    style={{
      backgroundImage: "url('/police.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-center mb-2 text-slate-900 text-3xl font-bold">Community Watch Login</h2>
        <p className="text-center text-slate-600 mb-8 text-sm">Sign in to access the police management system</p>

        <Formik
          initialValues={{
            email: "",
            password: ""
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mb-6">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <ErrorMessage name="password" component="div" className="text-red-600 text-sm mt-1" />
              </div>

              <button
                type="submit"
                className="w-full btn btn-primary py-3 text-base font-semibold mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="text-center mb-6">
          <p className="text-slate-600 text-sm">
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign up here
            </Link>
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-md border border-slate-200">
          <h4 className="mb-2 text-slate-900 text-sm font-semibold">Demo Note:</h4>
          <p className="text-xs text-slate-600">
            Use the signup form to create a new officer account, or contact your administrator for existing credentials.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
