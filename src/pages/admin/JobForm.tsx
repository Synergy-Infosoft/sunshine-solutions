import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Plus, Trash2, X } from 'lucide-react';
import { getJob, saveJob, genId } from '../../store';
import { Job, JobRole, JobType, ShiftType } from '../../types';
import CustomSelect from '../../components/CustomSelect';

const emptyRole = (): JobRole => ({
  title: '',
  type: 'Helper',
  salary_min: 12000,
  salary_max: 15000,
  openings: 5,
  shift: 'Day',
  description: '',
  requirements: [],
  benefits: ['PF', 'ESIC'],
  urgent_hiring: false,
  status: 'active'
});

const emptyJob: Omit<Job, 'id' | 'createdAt' | 'updatedAt'> = {
  company: '',
  location: '',
  contact_number: '+919828377776',
  whatsapp_number: '919828377776',
  status: 'active',
  roles: [emptyRole()]
};

export default function JobForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id && id !== 'new' && id !== undefined;

  const [form, setForm] = useState<Omit<Job, 'id' | 'createdAt' | 'updatedAt'>>(emptyJob);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCitySug, setShowCitySug] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [allCities, setAllCities] = useState<string[]>([]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/sab99r/Indian-States-And-Districts/master/states-and-districts.json')
      .then(r => r.json())
      .then(data => {
        const cList: string[] = [];
        if (data && data.states) {
          data.states.forEach((s: any) => {
            if (s.districts) s.districts.forEach((d: string) => cList.push(d));
          });
          setAllCities(cList);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (isEdit) {
      getJob(id!).then(existing => {
        if (existing) {
          const { id: _id, createdAt, updatedAt, applicant_count, ...rest } = existing;
          if (!rest.roles || rest.roles.length === 0) {
             rest.roles = [emptyRole()];
          }
          setForm(rest as any);
        }
      });
    }
  }, [id]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.company.trim()) e.company = 'Company Name is required';
    if (!form.location.trim()) e.location = 'Location is required';
    
    if (form.roles.length === 0) e.roles = 'At least one role is required';
    else {
      form.roles.forEach((r, idx) => {
        if (!r.title.trim()) e[`role_${idx}_title`] = 'Role Title is required';
        if (r.salary_min >= r.salary_max) e[`role_${idx}_salary`] = 'Max salary must be greater than Min';
      });
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCityInput = (val: string) => {
    setForm({ ...form, location: val });
    if (val.length >= 2) {
      const f = allCities.filter(c => c.toLowerCase().includes(val.toLowerCase()));
      setCitySuggestions(f.slice(0, 6));
      setShowCitySug(true);
    } else {
      setShowCitySug(false);
    }
  };

  const selectCity = (c: string) => {
    setForm({ ...form, location: c });
    setShowCitySug(false);
  };

  const handleRoleChange = (idx: number, field: keyof JobRole, value: any) => {
    const newRoles = [...form.roles];
    newRoles[idx] = { ...newRoles[idx], [field]: value };
    setForm({ ...form, roles: newRoles });
  };

  const addRole = () => {
    setForm({ ...form, roles: [...form.roles, emptyRole()] });
  };

  const removeRole = (idx: number) => {
    if (form.roles.length === 1) return;
    const newRoles = form.roles.filter((_, i) => i !== idx);
    setForm({ ...form, roles: newRoles });
  };

  const toggleBenefitForRole = (idx: number, benefit: string) => {
    const role = form.roles[idx];
    const newBenefits = role.benefits.includes(benefit) 
      ? role.benefits.filter(b => b !== benefit)
      : [...role.benefits, benefit];
    handleRoleChange(idx, 'benefits', newBenefits);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    Object.keys(errors).forEach(k => {
      const el = document.getElementById(k);
      if(el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    
    if (!validate()) return;

    const jobToSave: Job = {
      id: isEdit ? id! : genId(),
      ...form,
    };
    
    await saveJob(jobToSave);
    navigate('/admin/jobs');
  };

  const inputCls = (errKey?: string) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errKey && errors[errKey] ? 'border-red-400' : 'border-gray-300'}`;

  const availableBenefits = ['PF', 'ESIC', 'Food', 'Room', 'Overtime', 'Bonus'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/admin/jobs')} className="p-2 rounded-xl hover:bg-gray-200 transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-black text-gray-800">{isEdit ? 'Edit Site Listing' : 'Create New Site Listing'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Parent / Site Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
           <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Site / Company Details</h2>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Company / Client Name *</label>
                <input id="company" type="text" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="e.g. Amazon Warehouse" className={inputCls('company')} />
                {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
              </div>
              
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Site Location (City) *</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="location"
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
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number</label>
                <input type="text" value={form.contact_number} onChange={e => setForm({ ...form, contact_number: e.target.value })} className={inputCls()} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">WhatsApp Number</label>
                <input type="text" value={form.whatsapp_number} onChange={e => setForm({ ...form, whatsapp_number: e.target.value })} className={inputCls()} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Site Status</label>
                <CustomSelect
                  value={form.status}
                  onChange={v => setForm({ ...form, status: v as 'active' | 'inactive' })}
                  options={[{value: 'active'}, {value: 'inactive'}]}
                  className={inputCls().replace("focus:outline-none focus:ring-2 focus:ring-blue-500", "")}
                />
              </div>
           </div>
        </div>

        {/* Roles Details */}
        <div className="space-y-4">
           <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Job Profiles / Roles</h2>
              <button type="button" onClick={addRole} className="flex items-center gap-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer">
                 <Plus size={16} /> Add Role
              </button>
           </div>
           
           {errors.roles && <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg">{errors.roles}</p>}

           {form.roles.map((role, idx) => (
             <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 relative group">
                {form.roles.length > 1 && (
                  <button type="button" onClick={() => removeRole(idx)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-1 bg-gray-50 rounded-md transition-colors" title="Remove Role">
                     <Trash2 size={16} />
                  </button>
                )}
                
                <h3 className="font-bold text-gray-700 mb-4 pr-10">Role #{idx + 1}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                   <div className="sm:col-span-2">
                     <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Profile Title *</label>
                     <input id={`role_${idx}_title`} type="text" value={role.title} onChange={e => handleRoleChange(idx, 'title', e.target.value)} placeholder="e.g. Picker" className={inputCls(`role_${idx}_title`)} />
                     {errors[`role_${idx}_title`] && <p className="text-red-500 text-[10px] mt-1">{errors[`role_${idx}_title`]}</p>}
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Openings</label>
                     <input type="number" value={role.openings} onChange={e => handleRoleChange(idx, 'openings', parseInt(e.target.value) || 1)} min="1" className={inputCls()} />
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Category</label>
                     <CustomSelect
                       value={role.type}
                       onChange={v => handleRoleChange(idx, 'type', v)}
                       options={[{value: 'Helper'}, {value: 'ITI'}, {value: 'Skilled'}]}
                       className={inputCls().replace("focus:outline-none focus:ring-2 focus:ring-blue-500", "")}
                     />
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                   <div>
                     <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Min Salary (₹)</label>
                     <input id={`role_${idx}_salary`} type="number" value={role.salary_min} onChange={e => handleRoleChange(idx, 'salary_min', parseInt(e.target.value) || 0)} className={inputCls(`role_${idx}_salary`)} />
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Max Salary (₹)</label>
                     <input type="number" value={role.salary_max} onChange={e => handleRoleChange(idx, 'salary_max', parseInt(e.target.value) || 0)} className={inputCls(`role_${idx}_salary`)} />
                     {errors[`role_${idx}_salary`] && <p className="text-red-500 text-[10px] mt-1">{errors[`role_${idx}_salary`]}</p>}
                   </div>
                   <div>
                     <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Shift</label>
                     <CustomSelect
                       value={role.shift}
                       onChange={v => handleRoleChange(idx, 'shift', v)}
                       options={[{value: 'Day'}, {value: 'Night'}, {value: 'Rotational'}]}
                       className={inputCls().replace("focus:outline-none focus:ring-2 focus:ring-blue-500", "")}
                     />
                   </div>
                   <div className="flex items-end pb-1 pb-2">
                     <label className="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" checked={role.urgent_hiring} onChange={e => handleRoleChange(idx, 'urgent_hiring', e.target.checked)} className="sr-only peer" />
                       <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-red-400 rounded-full peer peer-checked:bg-red-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                       <span className="ml-2 text-xs font-bold text-gray-600">Urgent Fill</span>
                     </label>
                   </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Facilities & Benefits</label>
                  <div className="flex flex-wrap gap-2">
                    {availableBenefits.map(b => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => toggleBenefitForRole(idx, b)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer ${role.benefits.includes(b) ? 'bg-blue-900 border-blue-900 text-white' : 'bg-white border-gray-300 text-gray-600 hover:border-blue-400'}`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                   <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Brief Description (Optional)</label>
                   <textarea
                     value={role.description}
                     onChange={e => handleRoleChange(idx, 'description', e.target.value)}
                     rows={2}
                     className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                     placeholder="Specific details about this role..."
                   />
                </div>
             </div>
           ))}
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4 sticky bottom-6 z-10 bg-gray-50/80 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-gray-200">
          <button type="button" onClick={() => navigate('/admin/jobs')} className="flex-1 border-2 border-gray-300 text-gray-600 font-bold py-3.5 rounded-xl hover:bg-white transition-colors">
            Cancel
          </button>
          <button type="submit" className="flex-[2] bg-blue-900 text-white font-bold py-3.5 rounded-xl hover:bg-blue-800 transition-colors shadow-md flex justify-center items-center gap-2">
            {isEdit ? 'Update Site Listing' : 'Publish Site Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
