export type JobType = 'Helper' | 'ITI' | 'Skilled';
export type ShiftType = 'Day' | 'Night' | 'Rotational';
export type JobStatus = 'Active' | 'Inactive' | 'Expired';

export interface Job {
  id: string;
  title: string;
  salaryMin: number;
  salaryMax: number;
  location: string;
  state: string;
  jobType: JobType;
  shift: ShiftType;
  benefits: {
    pf: boolean;
    esic: boolean;
    food: boolean;
    room: boolean;
    overtime: boolean;
  };
  contactNumber: string;
  whatsappNumber: string;
  status: JobStatus;
  urgentHiring: boolean;
  expiryDays: number;
  createdAt: string;
  expiresAt: string;
  description: string;
  openings: number;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  phone: string;
  location: string;
  experience: string;
  appliedAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
}
