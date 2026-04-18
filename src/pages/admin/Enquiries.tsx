import { useState, useEffect } from 'react';
import { Download, Phone, Clock, MessageCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { getEnquiries } from '../../store';
import { Enquiry } from '../../types';

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  
  useEffect(() => {
    getEnquiries().then(setEnquiries);
  }, []);
  const [search, setSearch] = useState('');

  const filtered = enquiries.filter(e => {
    if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.phone.includes(search) && !e.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const downloadAll = () => {
    if (enquiries.length === 0) { alert('No enquiries to download.'); return; }
    const ws = XLSX.utils.json_to_sheet(enquiries.map(e => ({
      Name: e.name,
      Phone: e.phone,
      Message: e.message,
      Date: new Date(e.createdAt).toLocaleDateString('en-IN'),
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Enquiries');
    const dateStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    XLSX.writeFile(wb, `all-enquiries_${dateStr}.xlsx`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Support Enquiries</h1>
          <p className="text-gray-500 text-sm font-medium">Direct messages from the website's Contact Form.</p>
        </div>
        <button
          onClick={downloadAll}
          className="flex items-center gap-2 bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-green-700 transition-colors text-sm"
        >
          <Download size={16} /> Download All Enquiries
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, phone, or message..."
          className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">#</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Phone</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Message</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Date</th>
              <th className="text-right px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">No enquiries found.</td></tr>
            )}
            {filtered.map((e, idx) => (
              <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 text-gray-400 text-xs">{idx + 1}</td>
                <td className="px-4 py-3 font-semibold text-gray-800">{e.name}</td>
                <td className="px-4 py-3">
                  <a href={`tel:${e.phone}`} className="text-blue-600 font-semibold hover:underline">{e.phone}</a>
                </td>
                <td className="px-4 py-3 text-gray-600 max-w-xs">
                  <p className="truncate text-sm">{e.message}</p>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs flex items-center gap-1">
                  <Clock size={11} /> {new Date(e.createdAt).toLocaleDateString('en-IN')}
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a href={`tel:${e.phone}`} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 font-semibold px-2.5 py-1 rounded-lg text-xs hover:bg-blue-100">
                      <Phone size={12} /> Call
                    </a>
                    <a
                      href={`https://wa.me/91${e.phone}?text=${encodeURIComponent(`Hi ${e.name}, thank you for your enquiry with Sunshine Solutions. How can we assist you?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-green-50 text-green-700 font-semibold px-2.5 py-1 rounded-lg text-xs hover:bg-green-100"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp
                    </a>
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
          <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-gray-100">No enquiries found.</div>
        )}
        {filtered.map(e => (
          <div key={e.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-gray-800">{e.name}</h3>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <Clock size={11} /> {new Date(e.createdAt).toLocaleDateString('en-IN')}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-blue-600 text-sm font-semibold mb-2">
              <Phone size={12} /> {e.phone}
            </div>
            <div className="flex items-start gap-1.5 text-gray-500 text-sm mb-3">
              <MessageCircle size={13} className="flex-shrink-0 mt-0.5 text-gray-400" />
              <p className="text-xs">{e.message}</p>
            </div>
            <div className="flex gap-2">
              <a href={`tel:${e.phone}`} className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-700 font-semibold py-2 rounded-xl text-xs hover:bg-blue-100">
                <Phone size={12} /> Call
              </a>
              <a
                href={`https://wa.me/91${e.phone}?text=${encodeURIComponent(`Hi ${e.name}, thank you for your enquiry. How can we assist you?`)}`}
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
