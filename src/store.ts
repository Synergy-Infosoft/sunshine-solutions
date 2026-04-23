import { Job, Application, Enquiry, JobRole } from './types';

// City cache
let cachedCities: string[] | null = null;
let fetchingCities: Promise<string[]> | null = null;

export async function getCities(): Promise<string[]> {
  if (cachedCities) return cachedCities;
  if (fetchingCities) return fetchingCities;
  
  fetchingCities = fetch('https://raw.githubusercontent.com/sab99r/Indian-States-And-Districts/master/states-and-districts.json')
    .then(r => r.json())
    .then(data => {
      const cList: string[] = [];
      if (data && data.states) {
        data.states.forEach((s: any) => {
          if (s.districts) s.districts.forEach((d: string) => cList.push(d));
        });
      }
      cachedCities = cList;
      fetchingCities = null;
      return cList;
    })
    .catch(e => {
      console.error('Failed to fetch cities', e);
      fetchingCities = null;
      return [];
    });
    
  return fetchingCities;
}

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
    return (json.data || []).map((j: any) => ({
      id: j.id.toString(),
      company: j.company || 'Sunshine Solutions',
      location: j.location || '',
      contact_number: j.contact_number || '+919828377776',
      whatsapp_number: j.whatsapp_number || '919828377776',
      status: j.status || 'active',
      applicant_count: j.applicant_count || 0,
      createdAt: j.created_at || new Date().toISOString(),
      updatedAt: j.updated_at || new Date().toISOString(),
      roles: (j.roles || []).map((r: any) => ({
        id: r.id.toString(),
        title: r.title || 'Unknown Role',
        type: r.type || 'Helper',
        salary_min: r.salary_min || 10000,
        salary_max: r.salary_max || 15000,
        openings: r.openings || 5,
        shift: r.shift || 'Day',
        description: r.description || '',
        requirements: Array.isArray(r.requirements) ? r.requirements : [],
        benefits: Array.isArray(r.benefits) ? r.benefits : [],
        urgent_hiring: Boolean(r.urgent_hiring),
        status: r.status || 'active'
      }))
    })) as Job[];
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

    return {
      id: j.id.toString(),
      company: j.company || 'Sunshine Solutions',
      location: j.location || '',
      contact_number: j.contact_number || '+919828377776',
      whatsapp_number: j.whatsapp_number || '919828377776',
      status: j.status || 'active',
      applicant_count: j.applicant_count || 0,
      createdAt: j.created_at || new Date().toISOString(),
      updatedAt: j.updated_at || new Date().toISOString(),
      roles: (j.roles || []).map((r: any) => ({
        id: r.id.toString(),
        title: r.title || 'Unknown Role',
        type: r.type || 'Helper',
        salary_min: r.salary_min || 10000,
        salary_max: r.salary_max || 15000,
        openings: r.openings || 5,
        shift: r.shift || 'Day',
        description: r.description || '',
        requirements: Array.isArray(r.requirements) ? r.requirements : [],
        benefits: Array.isArray(r.benefits) ? r.benefits : [],
        urgent_hiring: Boolean(r.urgent_hiring),
        status: r.status || 'active'
      }))
    } as Job;
  } catch (e) {
    return undefined;
  }
}

export async function saveJob(job: Job) {
  const isUpdate = !!job.id && !isNaN(Number(job.id)); // Safer ID check
  
  const payload = {
    company: job.company,
    location: job.location,
    contact_number: job.contact_number,
    whatsapp_number: job.whatsapp_number,
    status: job.status.toLowerCase(),
    roles: job.roles.map(r => ({
      title: r.title,
      type: r.type,
      salary_min: r.salary_min,
      salary_max: r.salary_max,
      openings: r.openings,
      shift: r.shift,
      description: r.description,
      requirements: r.requirements,
      benefits: r.benefits,
      urgent_hiring: r.urgent_hiring,
      status: r.status
    }))
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
    role_id: parseInt(app.role_id.toString()),
    name: app.name,
    phone: app.phone,
    location: app.location || 'Not specified',
    experience: app.experience || 'Not specified',
    status: app.status || 'New'
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
      role_id: a.role_id?.toString() || '',
      roleTitle: a.role_title || 'Unknown',
      jobCompany: a.company || 'Unknown',
      jobLocation: a.job_location || 'Unknown',
      name: a.name || '',
      phone: a.phone || '',
      location: a.location || 'Not Specified',
      experience: a.experience || '',
      status: a.status || 'New',
      appliedAt: a.created_at || new Date().toISOString()
    }));
  } catch (e) {
    console.error('getApplications error:', e);
    return [];
  }
}

export async function saveEnquiry(enq: Enquiry) {
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
