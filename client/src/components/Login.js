import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Login() {
  const { login } = useContext(AuthContext);
  const history = useHistory();

  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-700 p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-center mb-2 text-slate-900 text-3xl font-bold">
          Community Watch Login
        </h2>
        <p className="text-center text-slate-600 mb-8 text-sm">
          Sign in to access the police management system
        </p>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            const result = await login(values.email, values.password);

            if (result.success) {
              history.push("/");
            } else {
              setFieldError("general", result.error); // set custom error
            }

            setSubmitting(false);
          }}
        >
          {({ isSubmitting, errors }) => (
            <Form className="mb-6">
              <div className="form-group mb-4">
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full border rounded p-2"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="form-group mb-4">
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full border rounded p-2"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {errors.general && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md border border-red-200 mb-4 text-sm text-center">
                  {errors.general}
                </div>
              )}

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

        <div className="bg-slate-50 p-6 rounded-md border border-slate-200">
          <h4 className="mb-2 text-slate-900 text-sm font-semibold">
            Demo Credentials:
          </h4>
          <p className="mb-1 text-xs text-slate-600">
            <strong className="text-slate-900">Admin:</strong>{" "}
            john.smith@police.gov / password123
          </p>
          <p className="text-xs text-slate-600">
            <strong className="text-slate-900">Officer:</strong>{" "}
            sarah.johnson@police.gov / password123
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
