import React, { useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../context/AuthContext";

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  badge_number: Yup.string()
    .matches(/^\d{8,}$/, "Badge number must be at least 8 digits")
    .required("Badge number is required"),
  rank: Yup.string()
    .required("Rank is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^\d{10,}$/, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required("Confirm password is required")
});

function Signup() {
  const { signup, login } = useContext(AuthContext);
  const history = useHistory();

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    const { confirmPassword, ...submitData } = values;
    
    // Default role to officer for public signup
    submitData.role = "officer";

    const result = await signup(submitData);

    if (result.success) {
      // Auto-login after successful signup
      const loginResult = await login(values.email, values.password);
      if (loginResult.success) {
        history.push("/dashboard");
      } else {
        history.push("/login");
      }
    } else {
      // Handle specific field errors
      if (result.error.includes('email')) {
        setFieldError("email", result.error);
      } else if (result.error.includes('badge')) {
        setFieldError("badge_number", result.error);
      } else {
        setFieldError("password", result.error);
      }
    }
    
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-700 p-6" style={{
      backgroundImage: "url('/police.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <h2 className="text-center mb-2 text-slate-900 text-3xl font-bold">Join Community Watch</h2>
        <p className="text-center text-slate-600 mb-8 text-sm">Create your officer account</p>

        <Formik
          initialValues={{
            name: "",
            badge_number: "",
            rank: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: ""
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Badge Number *
                  </label>
                  <Field
                    type="text"
                    name="badge_number"
                    placeholder="Enter your badge number"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <ErrorMessage name="badge_number" component="div" className="text-red-600 text-sm mt-1" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rank *
                </label>
                <Field
                  as="select"
                  name="rank"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select your rank</option>
                  <option value="Constable">Constable</option>
                  <option value="Sergeant">Sergeant</option>
                  <option value="Inspector">Inspector</option>
                  <option value="Chief">Chief</option>
                </Field>
                <ErrorMessage name="rank" component="div" className="text-red-600 text-sm mt-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email *
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone *
                  </label>
                  <Field
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <ErrorMessage name="phone" component="div" className="text-red-600 text-sm mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password *
                  </label>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm Password *
                  </label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-600 text-sm mt-1" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn btn-primary py-3 text-base font-semibold mb-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>

              <div className="text-center">
                <p className="text-slate-600 text-sm">
                  Already have an account?{" "}
                  <Link 
                    to="/login" 
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Signup;