async function test() {
    const res = await fetch('http://localhost:5000/api/jobs');
    const json = await res.json();
    
    try {
      const jobs = (json.data || []).map((j) => ({
        id: j.id.toString(),
        company: j.company || 'Sunshine Solutions',
        location: j.location || '',
        status: j.status || 'active',
        applicant_count: j.applicant_count || 0,
        createdAt: j.created_at || new Date().toISOString(),
        updatedAt: j.updated_at || new Date().toISOString(),
        roles: (j.roles || []).map((r) => ({
          id: r.id ? r.id.toString() : '',
          title: r.title || 'Unknown Role',
          urgent_hiring: Boolean(r.urgent_hiring),
        }))
      }));
      console.log('MAPPED SUCCESSFULLY:', jobs.length, 'jobs');
    } catch(e) {
      console.log('CRASH DURING MAP:', e.message);
    }
}
test();
