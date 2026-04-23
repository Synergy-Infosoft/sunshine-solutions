import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Copy, Download, MapPin, Users, Building2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { getJobs, deleteJob, saveJob, getApplications, genId } from '../../store';
import CustomSelect from '../../components/CustomSelect';
import { Job, JobRole } from '../../types';

const statusBadge = (s: string) => {
  if (s === 'active') return 'bg-green-100 text-green-700';
  return 'bg-gray-100 text-gray-600';
};

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [apps, setApps] = useState<any[]>([]);

  const refresh = async () => {
    const [jobsData, appsData] = await Promise.all([getJobs(), getApplications()]);
    setJobs(jobsData);
    setApps(appsData);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Delete this site listing? All nested roles will be lost.')) {
      await deleteJob(id);
      await refresh();
    }
  };

  const handleDuplicate = async (job: Job) => {
    await saveJob({
      ...job,
      id: genId(),
      company: `${job.company} (Copy)`,
      status: 'inactive',
      roles: job.roles.map(r => ({ ...r, id: undefined })) // clear ids for new creation
    });
    await refresh();
  };

  const handleToggleStatus = async (job: Job) => {
    await saveJob({
      ...job,
      status: job.status === 'active' ? 'inactive' : 'active',
    });
    await refresh();
  };

  const downloadApplicants = (job: Job) => {
    // get all apps whose role_id matches one of the job's roles
    const siteRoleIds = job.roles.map(r => r.id?.toString());
    const jobApps = apps.filter(a => siteRoleIds.includes(a.role_id?.toString()));
    
    if (jobApps.length === 0) { alert('No applicants for this site.'); return; }
    
    const ws = XLSX.utils.json_to_sheet(jobApps.map(a => ({
      Company: a.jobCompany,
      Location: a.jobLocation,
      Role: a.roleTitle,
      Name: a.name,
      Phone: a.phone,
      Experience: a.experience || 'Not specified',
      Status: a.status,
      Date: new Date(a.appliedAt).toLocaleDateString('en-IN'),
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Applicants');
    const dateStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    const fileName = `${job.company.toLowerCase().replace(/\s+/g, '-')}_${dateStr}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const filtered = jobs.filter(j => {
    if (filterStatus && filterStatus !== 'All' && j.status !== filterStatus) return false;
    if (search && !j.company.toLowerCase().includes(search.toLowerCase()) && !j.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Sites Management</h1>
          <p className="text-gray-500 text-sm">{jobs.length} total active sites</p>
        </div>
        <Link
          to="/admin/jobs/new"
          className="flex items-center gap-2 bg-blue-900 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-blue-800 transition-colors text-sm"
        >
          <Plus size={18} /> Add New Site
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by company or location..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <CustomSelect
          value={filterStatus || 'All'}
          onChange={v => setFilterStatus(v === 'All' ? '' : v)}
          options={[{value: 'All'}, {value: 'active'}, {value: 'inactive'}]}
          className="w-full sm:w-48 border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Company / Site</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Roles Active</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Urgent Roles</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Applicants</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Created</th>
              <th className="text-right px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">No sites found.</td></tr>
            )}
            {filtered.map(job => {
              const roles = job.roles || [];
              const activeRoles = roles.length;
              const urgentRoles = roles.filter(r => r?.urgent_hiring).length;
              
              return (
              <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="font-semibold text-gray-800">{job.company}</div>
                  <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                    <MapPin size={10} /> {job.location}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 w-fit">
                     <Building2 size={12}/> {activeRoles} Roles
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleToggleStatus(job)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase ${statusBadge(job.status)} hover:opacity-80`}
                  >
                    {job.status}
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                   {urgentRoles > 0 ? (
                     <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{urgentRoles}</span>
                   ) : (
                     <span className="text-xs text-gray-400">-</span>
                   )}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="flex items-center justify-center gap-1 text-sm font-bold text-green-700">
                    <Users size={13} /> {job.applicant_count || 0}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-xs text-gray-500">
                  {new Date(job.createdAt || Date.now()).toLocaleDateString('en-IN')}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <button onClick={() => downloadApplicants(job)} title="Download all site applicants" className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors">
                      <Download size={15} />
                    </button>
                    <button onClick={() => handleDuplicate(job)} title="Duplicate Site" className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors">
                      <Copy size={15} />
                    </button>
                    <Link to={`/admin/jobs/${job.id}`} className="p-1.5 rounded-lg hover:bg-yellow-50 text-yellow-600 transition-colors" title="Edit Site">
                      <Edit size={15} />
                    </Link>
                    <button onClick={() => handleDelete(job.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete Site">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-gray-100">No sites found.</div>
        )}
        {filtered.map(job => (
          <div key={job.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-gray-800">{job.company}</h3>
                <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                  <MapPin size={11} /> {job.location}
                </div>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 uppercase rounded-full ${statusBadge(job.status)}`}>{job.status}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 font-semibold">
              <span className="text-blue-600">{(job.roles || []).length} Roles</span>
              <span className="flex items-center gap-1 text-green-600"><Users size={11} /> {job.applicant_count || 0} Apps</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => downloadApplicants(job)} className="flex-1 flex items-center justify-center gap-1 bg-green-50 text-green-700 font-semibold py-2 rounded-xl text-xs hover:bg-green-100">
                <Download size={13} /> Export
              </button>
              <Link to={`/admin/jobs/${job.id}`} className="flex-1 flex items-center justify-center gap-1 bg-yellow-50 text-yellow-700 font-semibold py-2 rounded-xl text-xs hover:bg-yellow-100">
                <Edit size={13} /> Edit
              </Link>
              <button onClick={() => handleDelete(job.id)} className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-600 font-semibold py-2 rounded-xl text-xs hover:bg-red-100">
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
