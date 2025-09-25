// Mock data for Community Watch application
// This data mirrors the structure from the Flask backend models

export const crimeCategories = [
  { id: 1, name: "Theft", created_at: "2024-01-15T10:30:00Z" },
  { id: 2, name: "Assault", created_at: "2024-01-15T10:30:00Z" },
  { id: 3, name: "Fraud", created_at: "2024-01-15T10:30:00Z" },
  { id: 4, name: "Vandalism", created_at: "2024-01-15T10:30:00Z" },
  { id: 5, name: "Traffic", created_at: "2024-01-15T10:30:00Z" }
];

export const policeOfficers = [
  {
    id: 1,
    name: "John Smith",
    badge_number: "12345678",
    rank: "Sergeant",
    email: "john.smith@police.gov",
    phone: "5551234567",
    role: "admin",
    created_at: "2024-01-10T08:00:00Z"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    badge_number: "23456789",
    rank: "Inspector",
    email: "sarah.johnson@police.gov",
    phone: "5552345678",
    role: "officer",
    created_at: "2024-01-10T08:00:00Z"
  },
  {
    id: 3,
    name: "Michael Brown",
    badge_number: "34567890",
    rank: "Constable",
    email: "michael.brown@police.gov",
    phone: "5553456789",
    role: "officer",
    created_at: "2024-01-10T08:00:00Z"
  },
  {
    id: 4,
    name: "Emily Davis",
    badge_number: "45678901",
    rank: "Chief",
    email: "emily.davis@police.gov",
    phone: "5554567890",
    role: "admin",
    created_at: "2024-01-10T08:00:00Z"
  },
  {
    id: 5,
    name: "Robert Wilson",
    badge_number: "56789012",
    rank: "Sergeant",
    email: "robert.wilson@police.gov",
    phone: "5555678901",
    role: "officer",
    created_at: "2024-01-10T08:00:00Z"
  }
];

export const crimeReports = [
  {
    id: 1,
    title: "Bicycle theft at Main Street",
    description: "A red mountain bike was stolen from outside the coffee shop on Main Street. The bike was locked with a chain lock that was cut.",
    location: "123 Main Street, Downtown",
    status: "open",
    created_at: "2024-01-20T14:30:00Z",
    crime_category_id: 1,
    crime_category: crimeCategories[0]
  },
  {
    id: 2,
    title: "Assault incident at Park Avenue",
    description: "Physical altercation between two individuals resulted in minor injuries. Witnesses present at the scene.",
    location: "Park Avenue, Central Park",
    status: "pending",
    created_at: "2024-01-19T20:15:00Z",
    crime_category_id: 2,
    crime_category: crimeCategories[1]
  },
  {
    id: 3,
    title: "Credit card fraud reported",
    description: "Victim reported unauthorized transactions on their credit card totaling $2,500. Transactions occurred at various online retailers.",
    location: "Online/Various",
    status: "open",
    created_at: "2024-01-18T09:45:00Z",
    crime_category_id: 3,
    crime_category: crimeCategories[2]
  },
  {
    id: 4,
    title: "Graffiti vandalism on school property",
    description: "Multiple graffiti tags found on the exterior walls of Lincoln Elementary School. Estimated cleanup cost $800.",
    location: "Lincoln Elementary School, Oak Street",
    status: "closed",
    created_at: "2024-01-17T07:20:00Z",
    crime_category_id: 4,
    crime_category: crimeCategories[3]
  },
  {
    id: 5,
    title: "Hit and run accident",
    description: "Vehicle struck parked car and fled the scene. Damage to victim's vehicle estimated at $3,000. Partial license plate obtained.",
    location: "Elm Street intersection",
    status: "open",
    created_at: "2024-01-16T16:10:00Z",
    crime_category_id: 5,
    crime_category: crimeCategories[4]
  },
  {
    id: 6,
    title: "Shoplifting at grocery store",
    description: "Suspect took items worth approximately $150 from the grocery store without payment. Security footage available.",
    location: "SuperMart, Commerce Boulevard",
    status: "pending",
    created_at: "2024-01-21T11:30:00Z",
    crime_category_id: 1,
    crime_category: crimeCategories[0]
  },
  {
    id: 7,
    title: "Domestic disturbance call",
    description: "Neighbors reported loud argument and possible physical altercation. Officers responded and mediated the situation.",
    location: "456 Residential Lane",
    status: "closed",
    created_at: "2024-01-15T22:45:00Z",
    crime_category_id: 2,
    crime_category: crimeCategories[1]
  },
  {
    id: 8,
    title: "Identity theft case",
    description: "Victim's personal information used to open fraudulent accounts. Multiple financial institutions affected.",
    location: "Various financial institutions",
    status: "open",
    created_at: "2024-01-14T13:20:00Z",
    crime_category_id: 3,
    crime_category: crimeCategories[2]
  }
];

export const assignments = [
  {
    id: 1,
    role_in_case: "Lead Investigator",
    assigned_at: "2024-01-20T15:00:00Z",
    crime_report_id: 1,
    officer_id: 2,
    crime_report: crimeReports[0],
    officer: policeOfficers[1]
  },
  {
    id: 2,
    role_in_case: "Support Officer",
    assigned_at: "2024-01-20T15:00:00Z",
    crime_report_id: 1,
    officer_id: 3,
    crime_report: crimeReports[0],
    officer: policeOfficers[2]
  },
  {
    id: 3,
    role_in_case: "Lead Investigator",
    assigned_at: "2024-01-19T20:30:00Z",
    crime_report_id: 2,
    officer_id: 1,
    crime_report: crimeReports[1],
    officer: policeOfficers[0]
  },
  {
    id: 4,
    role_in_case: "Lead Investigator",
    assigned_at: "2024-01-18T10:00:00Z",
    crime_report_id: 3,
    officer_id: 4,
    crime_report: crimeReports[2],
    officer: policeOfficers[3]
  },
  {
    id: 5,
    role_in_case: "Lead Investigator",
    assigned_at: "2024-01-17T08:00:00Z",
    crime_report_id: 4,
    officer_id: 5,
    crime_report: crimeReports[3],
    officer: policeOfficers[4]
  },
  {
    id: 6,
    role_in_case: "Lead Investigator",
    assigned_at: "2024-01-16T16:30:00Z",
    crime_report_id: 5,
    officer_id: 2,
    crime_report: crimeReports[4],
    officer: policeOfficers[1]
  },
  {
    id: 7,
    role_in_case: "Support Officer",
    assigned_at: "2024-01-16T16:30:00Z",
    crime_report_id: 5,
    officer_id: 3,
    crime_report: crimeReports[4],
    officer: policeOfficers[2]
  },
  {
    id: 8,
    role_in_case: "Lead Investigator",
    assigned_at: "2024-01-21T12:00:00Z",
    crime_report_id: 6,
    officer_id: 1,
    crime_report: crimeReports[5],
    officer: policeOfficers[0]
  }
];

// Helper functions for working with mock data
export const getReportsByStatus = (status) => {
  return crimeReports.filter(report => report.status === status);
};

export const getReportsByCategory = (categoryId) => {
  return crimeReports.filter(report => report.crime_category_id === categoryId);
};

export const getOfficerAssignments = (officerId) => {
  return assignments.filter(assignment => assignment.officer_id === officerId);
};

export const getReportAssignments = (reportId) => {
  return assignments.filter(assignment => assignment.crime_report_id === reportId);
};

export const getOfficersByRole = (role) => {
  return policeOfficers.filter(officer => officer.role === role);
};

// Statistics helpers
export const getStatistics = () => {
  const totalReports = crimeReports.length;
  const openReports = getReportsByStatus('open').length;
  const pendingReports = getReportsByStatus('pending').length;
  const closedReports = getReportsByStatus('closed').length;
  const totalOfficers = policeOfficers.length;
  const adminOfficers = getOfficersByRole('admin').length;
  const regularOfficers = getOfficersByRole('officer').length;

  return {
    totalReports,
    openReports,
    pendingReports,
    closedReports,
    totalOfficers,
    adminOfficers,
    regularOfficers,
    totalAssignments: assignments.length
  };
};
