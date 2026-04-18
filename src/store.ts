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
  {
    id: '7', title: 'Quality Inspector', salaryMin: 18000, salaryMax: 22000, location: 'Pune', state: 'Maharashtra', jobType: 'Skilled', shift: 'Rotational', benefits: { pf: true, esic: true, food: true, room: true, overtime: false }, contactNumber: '+919828377776', whatsappNumber: '919828377776', status: 'Active', urgentHiring: false, expiryDays: 15, createdAt: fmt(today), expiresAt: fmt(addDays(today, 15)), description: 'Requires 2+ years of experience in automotive parts quality inspection.', openings: 5,
  },
  {
    id: '8', title: 'Forklift Operator', salaryMin: 15000, salaryMax: 18000, location: 'Noida', state: 'UP', jobType: 'Skilled', shift: 'Day', benefits: { pf: true, esic: true, food: true, room: false, overtime: true }, contactNumber: '+919828377776', whatsappNumber: '919828377776', status: 'Active', urgentHiring: true, expiryDays: 10, createdAt: fmt(today), expiresAt: fmt(addDays(today, 10)), description: 'Valid forklift operating license required. Warehouse experience preferred.', openings: 10,
  },
  {
    id: '9', title: 'Machine Helper', salaryMin: 12000, salaryMax: 14000, location: 'Bengaluru', state: 'Karnataka', jobType: 'Helper', shift: 'Rotational', benefits: { pf: true, esic: true, food: true, room: true, overtime: true }, contactNumber: '+919828377776', whatsappNumber: '919828377776', status: 'Active', urgentHiring: false, expiryDays: 20, createdAt: fmt(today), expiresAt: fmt(addDays(today, 20)), description: 'Looking for physically fit candidates for machine shop operations. Food and accommodation provided.', openings: 40,
  },
  {
    id: '10', title: 'Store Keeper', salaryMin: 16000, salaryMax: 20000, location: 'Gurugram', state: 'Haryana', jobType: 'Skilled', shift: 'Day', benefits: { pf: true, esic: true, food: false, room: false, overtime: false }, contactNumber: '+919828377776', whatsappNumber: '919828377776', status: 'Active', urgentHiring: false, expiryDays: 12, createdAt: fmt(today), expiresAt: fmt(addDays(today, 12)), description: 'Basic computer knowledge required. Experience in inventory management preferred.', openings: 2,
  },
  {
    id: '11', title: 'Security Guard', salaryMin: 13000, salaryMax: 16000, location: 'Mumbai', state: 'Maharashtra', jobType: 'Helper', shift: 'Night', benefits: { pf: true, esic: true, food: false, room: true, overtime: true }, contactNumber: '+919828377776', whatsappNumber: '919828377776', status: 'Active', urgentHiring: true, expiryDays: 8, createdAt: fmt(today), expiresAt: fmt(addDays(today, 8)), description: 'Night shift security guard needed for industrial park. Minimum height requirement applies.', openings: 15,
  },
  {
    id: '12', title: 'Assembly Operator', salaryMin: 14000, salaryMax: 17000, location: 'Jaipur', state: 'Rajasthan', jobType: 'Helper', shift: 'Day', benefits: { pf: true, esic: true, food: true, room: false, overtime: false }, contactNumber: '+919828377776', whatsappNumber: '919828377776', status: 'Active', urgentHiring: false, expiryDays: 15, createdAt: fmt(today), expiresAt: fmt(addDays(today, 15)), description: 'Fine motor skills required. Female candidates preferred for electronic assembly line.', openings: 50,
  },
  {
    id: '13', title: 'Plumber', salaryMin: 18000, salaryMax: 24000, location: 'Delhi', state: 'Delhi', jobType: 'ITI', shift: 'Day', benefits: { pf: true, esic: true, food: false, room: false, overtime: true }, contactNumber: '+919828377776', whatsappNumber: '919828377776', status: 'Active', urgentHiring: true, expiryDays: 5, createdAt: fmt(today), expiresAt: fmt(addDays(today, 5)), description: 'ITI Plumber with 1-3 years experience for factory maintenance team.', openings: 3,
  },
  {
    id: '14', title: 'HVAC Technician', salaryMin: 22000, salaryMax: 28000, location: 'Pune', state: 'Maharashtra', jobType: 'Skilled', shift: 'Rotational', benefits: { pf: true, esic: true, food: false, room: true, overtime: true }, contactNumber: '+919828377776', whatsappNumber: '919828377776', status: 'Active', urgentHiring: false, expiryDays: 20, createdAt: fmt(today), expiresAt: fmt(addDays(today, 20)), description: 'Troubleshoot and maintain industrial HVAC systems. Relevant diploma/certification is a must.', openings: 2,
  },
  {
    id: '15', title: 'Molding Machine Operator', salaryMin: 16000, salaryMax: 20000, location: 'Bhiwadi', state: 'Rajasthan', jobType: 'Skilled', shift: 'Night', benefits: { pf: true, esic: true, food: true, room: true, overtime: true }, contactNumber: '+919828377776', whatsappNumber: '919828377776', status: 'Active', urgentHiring: true, expiryDays: 10, createdAt: fmt(today), expiresAt: fmt(addDays(today, 10)), description: 'Experience in plastic injection molding machines required.', openings: 12,
  },
  {
    id: '16', title: 'Turner / Machinist', salaryMin: 19000, salaryMax: 25000, location: 'Faridabad', state: 'Haryana', jobType: 'ITI', shift: 'Day', benefits: { pf: true, esic: true, food: true, room: false, overtime: true }, contactNumber: '+919828377776', whatsappNumber: '919828377776', status: 'Active', urgentHiring: false, expiryDays: 18, createdAt: fmt(today), expiresAt: fmt(addDays(today, 18)), description: 'ITI Machinist needed for heavy duty lathe operations.', openings: 4,
  },
  {
    id: '17', title: 'Loading/Unloading Helper', salaryMin: 13000, salaryMax: 16000, location: 'Kolkata', state: 'West Bengal', jobType: 'Helper', shift: 'Rotational', benefits: { pf: true, esic: true, food: true, room: true, overtime: true }, contactNumber: '+919828377776', whatsappNumber: '919828377776', status: 'Active', urgentHiring: true, expiryDays: 7, createdAt: fmt(today), expiresAt: fmt(addDays(today, 7)), description: 'Heavy lifting involved. Require physically strong individuals for cement plant.', openings: 25,
  },
  {
    id: '18', title: 'Production Supervisor', salaryMin: 25000, salaryMax: 35000, location: 'Chennai', state: 'Tamil Nadu', jobType: 'Skilled', shift: 'Day', benefits: { pf: true, esic: true, food: true, room: false, overtime: false }, contactNumber: '+919828377776', whatsappNumber: '919828377776', status: 'Active', urgentHiring: false, expiryDays: 25, createdAt: fmt(today), expiresAt: fmt(addDays(today, 25)), description: 'Manage a team of 40+ workers. Diploma in Engineering required with 3+ years experience.', openings: 1,
  },
  {
    id: '19', title: 'Electrician Helper', salaryMin: 11000, salaryMax: 13000, location: 'Neemrana', state: 'Rajasthan', jobType: 'Helper', shift: 'Day', benefits: { pf: true, esic: true, food: true, room: true, overtime: true }, contactNumber: '+919828377776', whatsappNumber: '919828377776', status: 'Active', urgentHiring: false, expiryDays: 14, createdAt: fmt(today), expiresAt: fmt(addDays(today, 14)), description: 'Assist senior electricians. Great opportunity to learn electrical trades.', openings: 10,
  },
  {
    id: '20', title: 'Line Inspector', salaryMin: 15000, salaryMax: 19000, location: 'Surat', state: 'Gujarat', jobType: 'Skilled', shift: 'Day', benefits: { pf: true, esic: true, food: false, room: false, overtime: true }, contactNumber: '+919828377776', whatsappNumber: '919828377776', status: 'Active', urgentHiring: true, expiryDays: 5, createdAt: fmt(today), expiresAt: fmt(addDays(today, 5)), description: 'Final garment inspection and finishing process checks. Eye for detail is critical.', openings: 6,
  }
];

function initStore() {
  const existingJobs = JSON.parse(localStorage.getItem(JOBS_KEY) || '[]');
  if (existingJobs.length < 20) {
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
