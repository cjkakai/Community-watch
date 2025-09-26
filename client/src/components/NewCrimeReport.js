import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../context/AuthContext";

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .required("Title is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),
  location: Yup.string()
    .min(3, "Location must be at least 3 characters")
    .required("Location is required"),
  crime_category_id: Yup.number()
    .required("Crime category is required"),
  status: Yup.string()
    .oneOf(["open", "closed", "pending"], "Invalid status")
    .required("Status is required")
});

function NewCrimeReport() {
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const [categories, setCategories] = useState([]);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitError("");

    try {
      const response = await fetch('/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        history.push('/reports');
      } else {
        const errorData = await response.json();
        setSubmitError(errorData.error || 'Failed to create report');
      }
    } catch (error) {
      setSubmitError('Network error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return <div>Please log in to create a report.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Create New Crime Report</h1>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <Formik
          initialValues={{
            title: "",
            description: "",
            location: "",
            crime_category_id: "",
            status: "open"
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {submitError}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title *
                </label>
                <Field
                  type="text"
                  name="title"
                  placeholder="Enter report title"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <ErrorMessage name="title" component="div" className="text-red-600 text-sm mt-1" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description *
                </label>
                <Field
                  as="textarea"
                  name="description"
                  rows="4"
                  placeholder="Describe the incident in detail"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <ErrorMessage name="description" component="div" className="text-red-600 text-sm mt-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location *
                  </label>
                  <Field
                    type="text"
                    name="location"
                    placeholder="Enter location"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <ErrorMessage name="location" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Crime Category *
                  </label>
                  <Field
                    as="select"
                    name="crime_category_id"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="crime_category_id" component="div" className="text-red-600 text-sm mt-1" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status *
                </label>
                <Field
                  as="select"
                  name="status"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </Field>
                <ErrorMessage name="status" component="div" className="text-red-600 text-sm mt-1" />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Report"}
                </button>
                <button
                  type="button"
                  onClick={() => history.push('/reports')}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default NewCrimeReport;
