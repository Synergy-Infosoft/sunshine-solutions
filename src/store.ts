import { Job, Application, Enquiry } from './types';

const JOBS_KEY = 'ss_jobs';
const APPS_KEY = 'ss_applications';
const ENQUIRIES_KEY = 'ss_enquiries';

const today = new Date();
const fmt = (d: Date) => d.toISOString();
const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

const SEED_JOBS: Job[] = [
  {
    id: '1',
    title: 'Paint Shop Helper',
    salaryMin: 12000,
    salaryMax: 15000,
    location: 'Jaipur',
    state: 'Rajasthan',
    jobType: 'Helper',
    shift: 'Day',
    benefits: { pf: true, esic: true, food: true, room: false, overtime: true },
    contactNumber: '+919828377776',
    whatsappNumber: '919828377776',
    status: 'Active',
    urgentHiring: true,
    expiryDays: 15,
    createdAt: fmt(today),
    expiresAt: fmt(addDays(today, 15)),
    description: 'Paint shop helper required for automobile manufacturing unit. No experience needed. Training provided.',
    openings: 20,
  },
  {
    id: '2',
    title: 'ITI Fitter',
    salaryMin: 18000,
    salaryMax: 22000,
    location: 'Pune',
    state: 'Maharashtra',
    jobType: 'ITI',
    shift: 'Rotational',
    benefits: { pf: true, esic: true, food: false, room: true, overtime: true },
    contactNumber: '+919828377776',
    whatsappNumber: '919828377776',
    status: 'Active',
    urgentHiring: true,
    expiryDays: 10,
    createdAt: fmt(today),
    expiresAt: fmt(addDays(today, 10)),
    description: 'ITI Fitter required for heavy machine manufacturing. Must have ITI certificate in Fitter trade.',
    openings: 15,
  },
  {
    id: '3',
    title: 'Welding Operator',
    salaryMin: 16000,
    salaryMax: 20000,
    location: 'Gurugram',
    state: 'Haryana',
    jobType: 'Skilled',
    shift: 'Night',
    benefits: { pf: true, esic: true, food: true, room: true, overtime: false },
    contactNumber: '+919828377776',
    whatsappNumber: '919828377776',
    status: 'Active',
    urgentHiring: false,
    expiryDays: 20,
    createdAt: fmt(today),
    expiresAt: fmt(addDays(today, 20)),
    description: 'Experienced welding operator for steel fabrication unit. MIG/TIG welding experience preferred.',
    openings: 10,
  },
  {
    id: '4',
    title: 'Packing Helper',
    salaryMin: 11000,
    salaryMax: 13000,
    location: 'Bhiwadi',
    state: 'Rajasthan',
    jobType: 'Helper',
    shift: 'Day',
    benefits: { pf: true, esic: true, food: true, room: false, overtime: false },
    contactNumber: '+919828377776',
    whatsappNumber: '919828377776',
    status: 'Active',
    urgentHiring: false,
    expiryDays: 30,
    createdAt: fmt(today),
    expiresAt: fmt(addDays(today, 30)),
    description: 'Packing helpers needed for FMCG company. No experience required. Freshers welcome.',
    openings: 30,
  },
  {
    id: '5',
    title: 'Electrician ITI',
    salaryMin: 20000,
    salaryMax: 25000,
    location: 'Neemrana',
    state: 'Rajasthan',
    jobType: 'ITI',
    shift: 'Day',
    benefits: { pf: true, esic: true, food: false, room: true, overtime: true },
    contactNumber: '+919828377776',
    whatsappNumber: '919828377776',
    status: 'Active',
    urgentHiring: true,
    expiryDays: 7,
    createdAt: fmt(today),
    expiresAt: fmt(addDays(today, 7)),
    description: 'ITI Electrician for Japanese automobile plant. Must have valid electrician license.',
    openings: 8,
  },
  {
    id: '6',
    title: 'CNC Operator',
    salaryMin: 22000,
    salaryMax: 28000,
    location: 'Chennai',
    state: 'Tamil Nadu',
    jobType: 'Skilled',
    shift: 'Rotational',
    benefits: { pf: true, esic: true, food: true, room: false, overtime: true },
    contactNumber: '+919828377776',
    whatsappNumber: '919828377776',
    status: 'Active',
    urgentHiring: false,
    expiryDays: 14,
    createdAt: fmt(today),
    expiresAt: fmt(addDays(today, 14)),
    description: 'CNC machine operator for precision engineering firm. Minimum 1 year experience required.',
    openings: 5,
  },
];

function initStore() {
  if (!localStorage.getItem(JOBS_KEY)) {
    localStorage.setItem(JOBS_KEY, JSON.stringify(SEED_JOBS));
  }
  if (!localStorage.getItem(APPS_KEY)) {
    localStorage.setItem(APPS_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(ENQUIRIES_KEY)) {
    localStorage.setItem(ENQUIRIES_KEY, JSON.stringify([]));
  }
}

initStore();

// Auto-expire jobs
function checkExpiry() {
  const jobs: Job[] = JSON.parse(localStorage.getItem(JOBS_KEY) || '[]');
  const now = new Date();
  let changed = false;
  const updated = jobs.map(job => {
    if (job.status === 'Active' && new Date(job.expiresAt) < now) {
      changed = true;
      return { ...job, status: 'Expired' as const };
    }
    return job;
  });
  if (changed) localStorage.setItem(JOBS_KEY, JSON.stringify(updated));
}
checkExpiry();

export function getJobs(): Job[] {
  return JSON.parse(localStorage.getItem(JOBS_KEY) || '[]');
}

export function saveJobs(jobs: Job[]) {
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

export function getJob(id: string): Job | undefined {
  return getJobs().find(j => j.id === id);
}

export function saveJob(job: Job) {
  const jobs = getJobs();
  const idx = jobs.findIndex(j => j.id === job.id);
  if (idx >= 0) jobs[idx] = job;
  else jobs.unshift(job);
  saveJobs(jobs);
}

export function deleteJob(id: string) {
  saveJobs(getJobs().filter(j => j.id !== id));
}

export function getApplications(): Application[] {
  return JSON.parse(localStorage.getItem(APPS_KEY) || '[]');
}

export function saveApplication(app: Application) {
  const apps = getApplications();
  apps.unshift(app);
  localStorage.setItem(APPS_KEY, JSON.stringify(apps));
}

export function getEnquiries(): Enquiry[] {
  return JSON.parse(localStorage.getItem(ENQUIRIES_KEY) || '[]');
}

export function saveEnquiry(enq: Enquiry) {
  const enqs = getEnquiries();
  enqs.unshift(enq);
  localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(enqs));
}

export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
