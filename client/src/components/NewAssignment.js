import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../context/AuthContext";

const validationSchema = Yup.object({
  officer_id: Yup.number()
    .required("Officer is required"),
  crime_report_id: Yup.number()
    .required("Crime report is required"),
  role_in_case: Yup.string()
    .required("Role in case is required")
});

function NewAssignment() {
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const [officers, setOfficers] = useState([]);
  const [reports, setReports] = useState([]);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [officersRes, reportsRes] = await Promise.all([
        fetch('/officers'),
        fetch('/reports')
      ]);

      const [officersData, reportsData] = await Promise.all([
        officersRes.json(),
        reportsRes.json()
      ]);

      setOfficers(officersData);
      setReports(reportsData.filter(report => report.status !== 'closed'));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitError("");

    try {
      const response = await fetch('/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        history.push('/assignments');
      } else {
        const errorData = await response.json();
        setSubmitError(errorData.error || 'Failed to create assignment');
      }
    } catch (error) {
      setSubmitError('Network error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return <div>Please log in to create an assignment.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">New Assignment</h1>
        
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {submitError}
          </div>
        )}

        <Formik
          initialValues={{
            officer_id: "",
            crime_report_id: "",
            role_in_case: ""
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Officer *
                </label>
                <Field
                  as="select"
                  name="officer_id"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select an officer</option>
                  {officers.map(officer => (
                    <option key={officer.id} value={officer.id}>
                      {officer.name} - {officer.badge_number} ({officer.rank})
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="officer_id" component="div" className="text-red-600 text-sm mt-1" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Crime Report *
                </label>
                <Field
                  as="select"
                  name="crime_report_id"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select a report</option>
                  {reports.map(report => (
                    <option key={report.id} value={report.id}>
                      {report.title} - {report.location} ({report.status})
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="crime_report_id" component="div" className="text-red-600 text-sm mt-1" />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Role in Case *
                </label>
                <Field
                  as="select"
                  name="role_in_case"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select role</option>
                  <option value="Lead Investigator">Lead Investigator</option>
                  <option value="Support Officer">Support Officer</option>
                  <option value="Evidence Collector">Evidence Collector</option>
                  <option value="Witness Interviewer">Witness Interviewer</option>
                </Field>
                <ErrorMessage name="role_in_case" component="div" className="text-red-600 text-sm mt-1" />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? 'Creating...' : 'Create Assignment'}
                </button>
                <button
                  type="button"
                  onClick={() => history.push('/assignments')}
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

export default NewAssignment;