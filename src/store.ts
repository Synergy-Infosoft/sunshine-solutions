import { Job, Application, Enquiry } from './types';

// Admin authentication helpers
const getHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export async function getJobs(): Promise<Job[]> {
  try {
    const res = await fetch('/api/jobs');
    const json = await res.json();
    return (json.data || []).map((j: any) => {
      let min = 12000;
      let max = 15000;
      if (j.salary && typeof j.salary === 'string') {
        const parts = j.salary.split('-');
        if (parts.length === 2) {
          min = parseInt(parts[0].replace(/[^0-9]/g, '')) || 12000;
          max = parseInt(parts[1].replace(/[^0-9]/g, '')) || 15000;
        }
      }

      // Convert array of benefits from backend to object
      const benefitsArr = Array.isArray(j.benefits) ? j.benefits : [];
      
      return {
        id: j.id.toString(),
        title: j.title || 'Unknown Job',
        salaryMin: min,
        salaryMax: max,
        location: j.location || '',
        state: j.location || '', // Duplicate for now
        jobType: (j.type === 'Helper' || j.type === 'ITI' || j.type === 'Skilled') ? j.type : 'Helper',
        shift: 'Day', // Default shift since not in schema
        benefits: {
          pf: benefitsArr.includes('pf'),
          esic: benefitsArr.includes('esic'),
          food: benefitsArr.includes('food'),
          room: benefitsArr.includes('room'),
          overtime: benefitsArr.includes('overtime')
        },
        contactNumber: '+919828377776',
        whatsappNumber: '919828377776',
        status: (j.status === 'active' || j.status === 'Active') ? 'Active' : 'Inactive',
        urgentHiring: Boolean(j.featured),
        expiryDays: 15,
        createdAt: j.created_at || new Date().toISOString(),
        expiresAt: j.created_at || new Date().toISOString(),
        description: j.description || '',
        openings: 5,
        applicantCount: j.applicant_count || 0
      } as Job;
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

export async function getJob(id: string): Promise<Job | undefined> {
  try {
    const res = await fetch(`/api/jobs/${id}`);
    const json = await res.json();
    const j = json.data;
    if (!j) return undefined;

    let min = 12000; let max = 15000;
    if (j.salary) {
      const parts = j.salary.split('-');
      if (parts.length === 2) {
        min = parseInt(parts[0].replace(/[^0-9]/g, '')) || 12000;
        max = parseInt(parts[1].replace(/[^0-9]/g, '')) || 15000;
      }
    }
    const benefitsArr = Array.isArray(j.benefits) ? j.benefits : [];
    
    return {
      id: j.id.toString(),
      title: j.title || '',
      salaryMin: min,
      salaryMax: max,
      location: j.location || '',
      state: j.location || '',
      jobType: j.type,
      shift: 'Day',
      benefits: {
        pf: benefitsArr.includes('pf'),
        esic: benefitsArr.includes('esic'),
        food: benefitsArr.includes('food'),
        room: benefitsArr.includes('room'),
        overtime: benefitsArr.includes('overtime')
      },
      contactNumber: '+919828377776',
      whatsappNumber: '919828377776',
      status: (j.status === 'active' || j.status === 'Active') ? 'Active' : 'Inactive',
      urgentHiring: Boolean(j.featured),
      expiryDays: 15,
      createdAt: j.created_at || new Date().toISOString(),
      expiresAt: j.created_at || new Date().toISOString(),
      description: j.description || '',
      openings: 5,
      applicantCount: j.applicant_count || 0
    } as Job;
  } catch (e) {
    return undefined;
  }
}

export async function saveJob(job: Job) {
  const isUpdate = !!job.id && job.id.length < 15; // Realistic auto-id check
  
  // Prepare data for backend (snake_case)
  const payload = {
    title: job.title,
    company: 'Sunshine Solutions',
    location: job.location,
    salary: `₹${job.salaryMin} - ₹${job.salaryMax}`,
    type: job.jobType,
    posted_time: 'Just now',
    description: job.description,
    requirements: [],
    benefits: Object.entries(job.benefits).filter(([_, v]) => v).map(([k]) => k),
    featured: job.urgentHiring,
    status: job.status.toLowerCase()
  };

  const url = isUpdate ? `/api/jobs/${job.id}` : '/api/jobs';
  const method = isUpdate ? 'PATCH' : 'POST';

  const res = await fetch(url, {
    method,
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return await res.json();
}

export async function deleteJob(id: string) {
  const res = await fetch(`/api/jobs/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return await res.json();
}

export async function saveApplication(app: Application) {
  const payload = {
    job_id: parseInt(app.jobId) || 1,
    name: app.name,
    phone: app.phone,
    experience: app.experience || 'Not specified',
  };
  const res = await fetch('/api/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return await res.json();
}

export async function getApplications(): Promise<Application[]> {
  try {
    const res = await fetch('/api/applications', { headers: getHeaders() });
    const json = await res.json();
    if (!json.success) {
      console.error('getApplications auth error:', json.message);
      return [];
    }
    return (json.data || []).map((a: any) => ({
      id: a.id.toString(),
      jobId: a.job_id?.toString() || '',
      jobTitle: a.job_title || 'Unknown',
      name: a.name || '',
      phone: a.phone || '',
      location: a.location || 'Not Specified',
      experience: a.experience || '',
      appliedAt: a.created_at || new Date().toISOString()
    }));
  } catch (e) {
    console.error('getApplications error:', e);
    return [];
  }
}

export async function saveEnquiry(enq: Enquiry) {
  // Only send fields the backend Zod schema expects
  const payload = {
    name: enq.name,
    phone: enq.phone,
    message: enq.message,
    type: 'GENERAL',
  };
  const res = await fetch('/api/enquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return await res.json();
}

export async function getEnquiries(): Promise<Enquiry[]> {
  try {
    const res = await fetch('/api/enquiries', { headers: getHeaders() });
    const json = await res.json();
    return (json.data || []).map((e: any) => ({
      id: e.id.toString(),
      name: e.name || '',
      phone: e.phone || '',
      message: e.message || '',
      createdAt: e.created_at || new Date().toISOString()
    }));
  } catch (e) {
    return [];
  }
}

export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
