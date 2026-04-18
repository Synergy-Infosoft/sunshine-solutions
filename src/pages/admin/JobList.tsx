import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Copy, Download, MapPin, Users } from 'lucide-react';
import * as XLSX from 'xlsx';
import { getJobs, deleteJob, saveJob, getApplications, genId } from '../../store';
import { Job } from '../../types';

const statusBadge = (s: string) => {
  if (s === 'Active') return 'bg-green-100 text-green-700';
  if (s === 'Inactive') return 'bg-gray-100 text-gray-600';
  return 'bg-red-100 text-red-600';
};

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>(getJobs());
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const apps = getApplications();

  const refresh = () => setJobs(getJobs());

  const handleDelete = (id: string) => {
    if (confirm('Delete this job?')) {
      deleteJob(id);
      refresh();
    }
  };

  const handleDuplicate = (job: Job) => {
    const now = new Date();
    const expiry = new Date(now);
    expiry.setDate(expiry.getDate() + job.expiryDays);
    saveJob({
      ...job,
      id: genId(),
      title: `${job.title} (Copy)`,
      createdAt: now.toISOString(),
      expiresAt: expiry.toISOString(),
      status: 'Inactive',
    });
    refresh();
  };

  const handleToggleUrgent = (job: Job) => {
    saveJob({ ...job, urgentHiring: !job.urgentHiring });
    refresh();
  };

  const handleToggleStatus = (job: Job) => {
    const now = new Date();
    const expiry = new Date(now);
    expiry.setDate(expiry.getDate() + job.expiryDays);
    saveJob({
      ...job,
      status: job.status === 'Active' ? 'Inactive' : 'Active',
      expiresAt: expiry.toISOString(),
    });
    refresh();
  };

  const downloadApplicants = (job: Job) => {
    const jobApps = apps.filter(a => a.jobId === job.id);
    if (jobApps.length === 0) { alert('No applicants for this job.'); return; }
    const ws = XLSX.utils.json_to_sheet(jobApps.map(a => ({
      Name: a.name,
      Phone: a.phone,
      Location: a.location,
      Experience: a.experience || 'Not specified',
      'Applied Job': a.jobTitle,
      Date: new Date(a.appliedAt).toLocaleDateString('en-IN'),
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Applicants');
    const dateStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    const fileName = `${job.title.toLowerCase().replace(/\s+/g, '-')}_${dateStr}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const filtered = jobs.filter(j => {
    if (filterStatus && j.status !== filterStatus) return false;
    if (search && !j.title.toLowerCase().includes(search.toLowerCase()) && !j.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const appCount = (jobId: string) => apps.filter(a => a.jobId === jobId).length;

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Job Management</h1>
          <p className="text-gray-500 text-sm">{jobs.length} total jobs</p>
        </div>
        <Link
          to="/admin/jobs/new"
          className="flex items-center gap-2 bg-blue-900 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-blue-800 transition-colors text-sm"
        >
          <Plus size={18} /> Create New Job
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by title or location..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Job Title</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Location</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Created</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Expires</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Applicants</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Urgent</th>
              <th className="text-right px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="text-center py-10 text-gray-400">No jobs found.</td></tr>
            )}
            {filtered.map(job => (
              <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="font-semibold text-gray-800">{job.title}</div>
                  <div className="text-xs text-gray-400">{job.jobType} • {job.shift} shift</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-gray-600 text-xs">
                    <MapPin size={12} className="text-blue-500" />
                    {job.location}, {job.state}
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-xs text-gray-500">
                  {new Date(job.createdAt).toLocaleDateString('en-IN')}
                </td>
                <td className="px-4 py-3 text-center text-xs text-gray-500">
                  {new Date(job.expiresAt).toLocaleDateString('en-IN')}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="flex items-center justify-center gap-1 text-sm font-bold text-blue-700">
                    <Users size={13} /> {appCount(job.id)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleToggleStatus(job)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge(job.status)} ${job.status !== 'Expired' ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                    disabled={job.status === 'Expired'}
                  >
                    {job.status}
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleToggleUrgent(job)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${job.urgentHiring ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  >
                    {job.urgentHiring ? 'Yes' : 'No'}
                  </button>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <button onClick={() => downloadApplicants(job)} title="Download applicants" className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors">
                      <Download size={15} />
                    </button>
                    <button onClick={() => handleDuplicate(job)} title="Duplicate" className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors">
                      <Copy size={15} />
                    </button>
                    <Link to={`/admin/jobs/${job.id}`} className="p-1.5 rounded-lg hover:bg-yellow-50 text-yellow-600 transition-colors">
                      <Edit size={15} />
                    </Link>
                    <button onClick={() => handleDelete(job.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-gray-100">No jobs found.</div>
        )}
        {filtered.map(job => (
          <div key={job.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-gray-800">{job.title}</h3>
                <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                  <MapPin size={11} /> {job.location}, {job.state}
                </div>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusBadge(job.status)}`}>{job.status}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
              <span>{job.jobType} • {job.shift}</span>
              <span className="flex items-center gap-1"><Users size={11} /> {appCount(job.id)} applicants</span>
              {job.urgentHiring && <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">Urgent</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => downloadApplicants(job)} className="flex-1 flex items-center justify-center gap-1 bg-green-50 text-green-700 font-semibold py-2 rounded-xl text-xs hover:bg-green-100">
                <Download size={13} /> Export
              </button>
              <button onClick={() => handleDuplicate(job)} className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-700 font-semibold py-2 rounded-xl text-xs hover:bg-blue-100">
                <Copy size={13} /> Clone
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
