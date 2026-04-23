export type JobType = 'Helper' | 'ITI' | 'Skilled';
export type ShiftType = 'Day' | 'Night' | 'Rotational';
export type JobStatus = 'active' | 'inactive';

// Represents a specific role inside a site
export interface JobRole {
  id?: string | number; // Can be empty when creating new
  title: string;
  type: JobType;
  salary_min: number;
  salary_max: number;
  openings: number;
  shift: ShiftType;
  description: string;
  requirements: string[];
  benefits: string[];
  urgent_hiring: boolean;
  status: JobStatus;
}

// Represents the Parent Company / "Site"
export interface Job {
  id: string;
  company: string;
  location: string;
  contact_number: string;
  whatsapp_number: string;
  status: JobStatus;
  roles: JobRole[];
  applicant_count?: number; // Total applications across all roles
  createdAt?: string;
  updatedAt?: string;
}

export interface Application {
  id: string;
  role_id: string | number;
  roleTitle?: string;
  jobCompany?: string;
  jobLocation?: string;
  name: string;
  phone: string;
  location: string;
  experience: string;
  status: 'New' | 'Called' | 'Selected' | 'Rejected';
  appliedAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
}
