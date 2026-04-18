import { useState } from 'react';
import { Download, Phone, MapPin, Clock } from 'lucide-react';
import * as XLSX from 'xlsx';
import { getApplications } from '../../store';
import { Application } from '../../types';

export default function Applications() {
  const [apps] = useState<Application[]>(getApplications());
  const [search, setSearch] = useState('');
  const [jobFilter, setJobFilter] = useState('');

  const uniqueJobs = [...new Set(apps.map(a => a.jobTitle))];

  const filtered = apps.filter(a => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.phone.includes(search) && !a.location.toLowerCase().includes(search.toLowerCase())) return false;
    if (jobFilter && a.jobTitle !== jobFilter) return false;
    return true;
  });

  const downloadAll = () => {
    if (apps.length === 0) { alert('No applications to download.'); return; }
    const ws = XLSX.utils.json_to_sheet(apps.map(a => ({
      Name: a.name,
      Phone: a.phone,
      Location: a.location,
      Experience: a.experience || 'Not specified',
      'Applied Job': a.jobTitle,
      Date: new Date(a.appliedAt).toLocaleDateString('en-IN'),
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'All Applications');
    const dateStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    XLSX.writeFile(wb, `all-applications_${dateStr}.xlsx`);
  };

  const downloadFiltered = () => {
    if (filtered.length === 0) { alert('No applications to download.'); return; }
    const ws = XLSX.utils.json_to_sheet(filtered.map(a => ({
      Name: a.name,
      Phone: a.phone,
      Location: a.location,
      Experience: a.experience || 'Not specified',
      'Applied Job': a.jobTitle,
      Date: new Date(a.appliedAt).toLocaleDateString('en-IN'),
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Applications');
    const dateStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    const suffix = jobFilter ? `-${jobFilter.toLowerCase().replace(/\s+/g, '-')}` : '';
    XLSX.writeFile(wb, `applications${suffix}_${dateStr}.xlsx`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Applications</h1>
          <p className="text-gray-500 text-sm">{apps.length} total applications</p>
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
        <select
          value={jobFilter}
          onChange={e => setJobFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Jobs</option>
          {uniqueJobs.map(j => <option key={j} value={j}>{j}</option>)}
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">#</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Phone</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Location</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Applied For</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Experience</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Date</th>
              <th className="text-right px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="text-center py-10 text-gray-400">No applications found.</td></tr>
            )}
            {filtered.map((a, idx) => (
              <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 text-gray-400 text-xs">{idx + 1}</td>
                <td className="px-4 py-3 font-semibold text-gray-800">{a.name}</td>
                <td className="px-4 py-3">
                  <a href={`tel:${a.phone}`} className="text-blue-600 font-semibold hover:underline">{a.phone}</a>
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs flex items-center gap-1">
                  <MapPin size={12} className="text-blue-400" />{a.location}
                </td>
                <td className="px-4 py-3">
                  <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">{a.jobTitle}</span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{a.experience || '—'}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  <span className="flex items-center gap-1"><Clock size={11} /> {new Date(a.appliedAt).toLocaleDateString('en-IN')}</span>
                </td>
                <td className="px-5 py-3 text-right">
                  <a
                    href={`https://wa.me/91${a.phone}?text=${encodeURIComponent(`Hi ${a.name}, we received your application for ${a.jobTitle}. Please share more details.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-green-50 text-green-700 font-semibold px-2.5 py-1 rounded-lg text-xs hover:bg-green-100 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
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
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">{a.jobTitle}</span>
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <Clock size={11} /> {new Date(a.appliedAt).toLocaleDateString('en-IN')}
              </div>
            </div>
            <div className="space-y-1 text-xs text-gray-500 mb-3">
              <div className="flex items-center gap-1.5"><Phone size={12} className="text-blue-400" />{a.phone}</div>
              <div className="flex items-center gap-1.5"><MapPin size={12} className="text-blue-400" />{a.location}</div>
              {a.experience && <div className="text-gray-400">Exp: {a.experience}</div>}
            </div>
            <div className="flex gap-2">
              <a href={`tel:${a.phone}`} className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-700 font-semibold py-2 rounded-xl text-xs hover:bg-blue-100">
                <Phone size={12} /> Call
              </a>
              <a
                href={`https://wa.me/91${a.phone}?text=${encodeURIComponent(`Hi ${a.name}, we received your application for ${a.jobTitle}. Please share more details.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1 bg-green-50 text-green-700 font-semibold py-2 rounded-xl text-xs hover:bg-green-100"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
