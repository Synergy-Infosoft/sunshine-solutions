import { useState, useEffect } from 'react';
import { Download, Phone, MapPin, Clock } from 'lucide-react';
import * as XLSX from 'xlsx';
import { getApplications } from '../../store';
import { Application } from '../../types';
import CustomSelect from '../../components/CustomSelect';

const statusColors: Record<string, string> = {
  New: 'bg-blue-100 text-blue-700',
  Called: 'bg-yellow-100 text-yellow-700',
  Selected: 'bg-green-100 text-green-700',
  Rejected: 'bg-gray-100 text-gray-600',
};

export default function Applications() {
  const [apps, setApps] = useState<Application[]>([]);
  
  useEffect(() => {
    getApplications().then(setApps);
  }, []);
  
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const uniqueCompanies = [...new Set(apps.map(a => a.jobCompany).filter(Boolean) as string[])].sort();

  const filtered = apps.filter(a => {
    if (!a) return false;
    if (search && !(a.name?.toLowerCase().includes(search.toLowerCase())) && !(a.phone?.includes(search)) && !(a.location?.toLowerCase().includes(search.toLowerCase()))) return false;
    if (companyFilter && a.jobCompany !== companyFilter) return false;
    if (statusFilter && a.status !== statusFilter) return false;
    return true;
  });

  const downloadAll = () => {
    if (apps.length === 0) { alert('No applications to download.'); return; }
    const ws = XLSX.utils.json_to_sheet(apps.map(a => ({
      Date: new Date(a.appliedAt).toLocaleDateString('en-IN'),
      Company: a.jobCompany,
      Location: a.jobLocation,
      Role: a.roleTitle,
      Name: a.name,
      Mobile: a.phone,
      Qualification: a.experience || 'Not specified',
      Status: a.status
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'All Applications');
    const dateStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    XLSX.writeFile(wb, `all-applications_${dateStr}.xlsx`);
  };

  const downloadFiltered = () => {
    if (filtered.length === 0) { alert('No applications to download.'); return; }
    const ws = XLSX.utils.json_to_sheet(filtered.map(a => ({
      Date: new Date(a.appliedAt).toLocaleDateString('en-IN'),
      Company: a.jobCompany,
      Location: a.jobLocation,
      Role: a.roleTitle,
      Name: a.name,
      Mobile: a.phone,
      Qualification: a.experience || 'Not specified',
      Status: a.status
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Applications');
    const dateStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    XLSX.writeFile(wb, `applications-filtered_${dateStr}.xlsx`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Candidate Applications</h1>
          <p className="text-gray-500 text-sm font-medium">Job seeker applications submitted via the Job Portal.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={downloadFiltered} className="flex items-center gap-2 bg-blue-900 text-white font-bold px-4 py-2.5 rounded-xl hover:bg-blue-800 transition-colors text-sm">
            <Download size={16} /> Download Filtered
          </button>
          <button onClick={downloadAll} className="flex items-center gap-2 bg-green-600 text-white font-bold px-4 py-2.5 rounded-xl hover:bg-green-700 transition-colors text-sm">
            <Download size={16} /> Download All
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, phone, or location..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <CustomSelect
          value={companyFilter}
          onChange={v => setCompanyFilter(v)}
          options={[{value: '', label: 'All Companies'}, ...uniqueCompanies.map(c => ({value: c}))]}
          className="w-full sm:w-64 border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white"
        />
        <CustomSelect
          value={statusFilter}
          onChange={v => setStatusFilter(v)}
          options={[
            {value: '', label: 'All Statuses'},
            {value: 'New'}, {value: 'Called'}, {value: 'Selected'}, {value: 'Rejected'}
          ]}
          className="w-full sm:w-48 border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white"
        />
      </div>

      {/* Desktop Table (Matching requested Excel format) */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Date</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Company</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Location</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Role</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Mobile</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Qualification</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="text-center py-10 text-gray-400">No applications found.</td></tr>
            )}
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                   {new Date(a.appliedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </td>
                <td className="px-4 py-3 font-semibold text-gray-800">{a.jobCompany}</td>
                <td className="px-4 py-3 text-gray-600 text-xs"><MapPin size={12} className="inline text-blue-400 mr-1" />{a.jobLocation}</td>
                <td className="px-4 py-3 text-blue-700 font-medium text-xs">{a.roleTitle}</td>
                <td className="px-4 py-3 font-bold text-gray-800">{a.name}</td>
                <td className="px-4 py-3">
                  <a href={`tel:${a.phone}`} className="text-blue-600 font-semibold hover:underline bg-blue-50 px-2 py-0.5 rounded">{a.phone}</a>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{a.experience || '—'}</td>
                <td className="px-4 py-3 text-center">
                   <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColors[a.status] || 'bg-gray-100 text-gray-600'}`}>
                      {a.status}
                   </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={`https://wa.me/91${a.phone}?text=${encodeURIComponent(`Hi ${a.name}, regarding your application for the ${a.roleTitle} role at ${a.jobCompany}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-col items-center text-green-600 hover:text-green-700"
                    title="WhatsApp"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-gray-100">No applications found.</div>
        )}
        {filtered.map(a => (
          <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-gray-800">{a.name}</h3>
                <span className="text-blue-700 text-xs font-semibold">{a.roleTitle} @ {a.jobCompany}</span>
              </div>
              <div className="text-xs text-gray-400 flex flex-col items-end gap-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusColors[a.status] || ''}`}>{a.status}</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {new Date(a.appliedAt).toLocaleDateString('en-IN', {day:'2-digit', month:'short'})}</span>
              </div>
            </div>
            <div className="space-y-1 text-xs text-gray-500 mb-3 border-t border-gray-50 pt-2">
              <div className="flex items-center gap-1.5"><Phone size={12} className="text-blue-400" />{a.phone}</div>
              <div className="flex items-center gap-1.5"><MapPin size={12} className="text-blue-400" />{a.jobLocation}</div>
              {a.experience && <div className="text-gray-400">Qual: {a.experience}</div>}
            </div>
            <div className="flex gap-2">
              <a href={`tel:${a.phone}`} className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-700 font-semibold py-2 rounded-xl text-xs hover:bg-blue-100">
                <Phone size={12} /> Call
              </a>
              <a
                href={`https://wa.me/91${a.phone}?text=${encodeURIComponent(`Hi ${a.name}, regarding your application for the ${a.roleTitle} role at ${a.jobCompany}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-[2] flex items-center justify-center gap-1 bg-green-50 text-green-700 font-semibold py-2 rounded-xl text-xs hover:bg-green-100"
              >
                WhatsApp Message
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
