import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { getJob, saveJob, genId } from '../../store';
import { Job, JobType, ShiftType } from '../../types';
import CustomSelect from '../../components/CustomSelect';


const empty: Omit<Job, 'id' | 'createdAt' | 'expiresAt'> = {
  title: '',
  salaryMin: 12000,
  salaryMax: 15000,
  location: '',
  state: '',
  jobType: 'Helper',
  shift: 'Day',
  benefits: { pf: true, esic: true, food: false, room: false, overtime: false },
  contactNumber: '+919828377776',
  whatsappNumber: '919828377776',
  status: 'Active',
  urgentHiring: false,
  expiryDays: 15,
  description: '',
  openings: 10,
};

export default function JobForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id && id !== 'new' && id !== undefined;

  const [form, setForm] = useState<Omit<Job, 'id' | 'createdAt' | 'expiresAt'>>(empty);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCitySug, setShowCitySug] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [allCities, setAllCities] = useState<string[]>([]);
  const [dynamicStateMap, setDynamicStateMap] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/sab99r/Indian-States-And-Districts/master/states-and-districts.json')
      .then(r => r.json())
      .then(data => {
        const cList: string[] = [];
        const sMap: Record<string, string> = {};
        if (data && data.states) {
          data.states.forEach((s: any) => {
            if (s.districts) {
              s.districts.forEach((d: string) => {
                cList.push(d);
                sMap[d] = s.state;
              });
            }
          });
          setAllCities(cList);
          setDynamicStateMap(sMap);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (isEdit) {
      getJob(id!).then(existing => {
        if (existing) {
          const { id: _id, ...rest } = existing;
          // Ensure benefits is defined
          if (!rest.benefits) rest.benefits = { pf: true, esic: true, food: false, room: false, overtime: false };
          setForm(rest as any);
        }
      });
    }
  }, [id]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Job title is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (form.salaryMin >= form.salaryMax) e.salary = 'Max salary must be greater than min';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCityInput = (val: string) => {
    setForm({ ...form, location: val, state: dynamicStateMap[val] || '' });
    if (val.length >= 2) {
      const f = allCities.filter(c => c.toLowerCase().includes(val.toLowerCase()));
      setCitySuggestions(f.slice(0, 6));
      setShowCitySug(true);
    } else {
      setShowCitySug(false);
    }
  };

  const selectCity = (c: string) => {
    setForm({ ...form, location: c, state: dynamicStateMap[c] || '' });
    setShowCitySug(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const now = new Date();
    const expiry = new Date(now);
    expiry.setDate(expiry.getDate() + form.expiryDays);

    const job: Job = {
      id: isEdit ? id! : genId(),
      ...form,
      createdAt: isEdit ? (getJob(id!)?.createdAt || now.toISOString()) : now.toISOString(),
      expiresAt: expiry.toISOString(),
    };
    saveJob(job);
    navigate('/admin/jobs');
  };

  const inputCls = (field: string) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[field] ? 'border-red-400' : 'border-gray-300'}`;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate('/admin/jobs')} className="p-2 rounded-xl hover:bg-gray-200 transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-black text-gray-800">{isEdit ? 'Edit Job' : 'Create New Job'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        {/* Title & Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Job Title *</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Paint Shop Helper" className={inputCls('title')} />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Job Type *</label>
            <CustomSelect
              value={form.jobType}
              onChange={v => setForm({ ...form, jobType: v as JobType })}
              options={[{value: 'Helper'}, {value: 'ITI'}, {value: 'Skilled'}]}
              className={inputCls('jobType').replace("focus:outline-none focus:ring-2 focus:ring-blue-500", "")}
            />
          </div>
        </div>

        {/* Salary */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Salary Range (INR/month) *</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input type="number" value={form.salaryMin} onChange={e => setForm({ ...form, salaryMin: parseInt(e.target.value) || 0 })} placeholder="Min salary" className={inputCls('salary')} />
              <p className="text-xs text-gray-400 mt-1">Minimum</p>
            </div>
            <div>
              <input type="number" value={form.salaryMax} onChange={e => setForm({ ...form, salaryMax: parseInt(e.target.value) || 0 })} placeholder="Max salary" className={inputCls('salary')} />
              <p className="text-xs text-gray-400 mt-1">Maximum</p>
            </div>
          </div>
          {errors.salary && <p className="text-red-500 text-xs mt-1">{errors.salary}</p>}
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Location (City) *</label>
            <div className="relative">
              <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={form.location}
                onChange={e => handleCityInput(e.target.value)}
                onBlur={() => setTimeout(() => setShowCitySug(false), 150)}
                placeholder="Search city..."
                className={`${inputCls('location')} pl-9`}
              />
            </div>
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            {showCitySug && citySuggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-44 overflow-y-auto">
                {citySuggestions.map(c => (
                  <li key={c} onMouseDown={() => selectCity(c)} className="px-4 py-2.5 text-sm hover:bg-blue-50 cursor-pointer border-b last:border-0 border-gray-100">{c}</li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">State (Auto)</label>
            <input type="text" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} placeholder="Auto-detected" className={inputCls('state')} />
          </div>
        </div>

        {/* Shift, Openings, Expiry */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Shift</label>
            <CustomSelect
              value={form.shift}
              onChange={v => setForm({ ...form, shift: v as ShiftType })}
              options={[{value: 'Day'}, {value: 'Night'}, {value: 'Rotational'}]}
              className={inputCls('shift').replace("focus:outline-none focus:ring-2 focus:ring-blue-500", "")}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Total Openings</label>
            <input type="number" value={form.openings} onChange={e => setForm({ ...form, openings: parseInt(e.target.value) || 1 })} min={1} className={inputCls('openings')} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Expiry Days</label>
            <input type="number" value={form.expiryDays} onChange={e => setForm({ ...form, expiryDays: parseInt(e.target.value) || 7 })} min={1} max={90} className={inputCls('expiryDays')} />
          </div>
        </div>

        {/* Benefits */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Benefits / Facilities</label>
          <div className="flex flex-wrap gap-3">
            {([['pf', 'PF'], ['esic', 'ESIC'], ['food', 'Food'], ['room', 'Room / Accommodation'], ['overtime', 'Overtime']] as const).map(([key, label]) => (
              <label key={key} className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer text-sm font-medium transition-colors ${form.benefits[key] ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'}`}>
                <input type="checkbox" checked={form.benefits[key]} onChange={e => setForm({ ...form, benefits: { ...form.benefits, [key]: e.target.checked } })} className="hidden" />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number</label>
            <input type="text" value={form.contactNumber} onChange={e => setForm({ ...form, contactNumber: e.target.value })} className={inputCls('contactNumber')} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">WhatsApp Number (with country code)</label>
            <input type="text" value={form.whatsappNumber} onChange={e => setForm({ ...form, whatsappNumber: e.target.value })} placeholder="e.g. 919828377776" className={inputCls('whatsappNumber')} />
          </div>
        </div>

        {/* Status & Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
            <CustomSelect
              value={form.status}
              onChange={v => setForm({ ...form, status: v as 'Active' | 'Inactive' })}
              options={[{value: 'Active'}, {value: 'Inactive'}]}
              className={inputCls('status').replace("focus:outline-none focus:ring-2 focus:ring-blue-500", "")}
            />
          </div>
          <div className="flex items-center gap-3 pt-5">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={form.urgentHiring} onChange={e => setForm({ ...form, urgentHiring: e.target.checked })} className="sr-only peer" />
              <div className="w-10 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-red-400 rounded-full peer peer-checked:bg-red-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
              <span className="ml-2 text-sm font-semibold text-gray-700">Urgent Hiring</span>
            </label>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Job Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Brief job description..." className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate('/admin/jobs')} className="flex-1 border border-gray-300 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" className="flex-1 bg-blue-900 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition-colors">
            {isEdit ? 'Update Job' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  );
}
