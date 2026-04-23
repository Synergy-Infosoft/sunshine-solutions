import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, CheckCircle, MapPin, Briefcase } from 'lucide-react';
import { Job, JobRole } from '../types';
import { saveApplication, genId, getCities } from '../store';

interface Props {
  job: Job;
  preselectedRole?: JobRole; // Might select a specific role from the card
  onClose: () => void;
}

export default function ApplyModal({ job, preselectedRole, onClose }: Props) {
  const { t } = useTranslation();
  
  // Default to the first role if none preselected
  const defaultRoleId = preselectedRole ? preselectedRole.id : (job.roles[0]?.id || '');
  
  const [form, setForm] = useState({ 
    role_id: defaultRoleId, 
    name: '', 
    phone: '', 
    location: '', 
    experience: '' 
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allCities, setAllCities] = useState<string[]>([]);

  useEffect(() => {
    getCities().then(setAllCities);
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.role_id) e.role_id = 'Please select a role';
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter valid 10-digit mobile number';
    if (!form.location.trim()) e.location = 'Location is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCityInput = (val: string) => {
    setForm({ ...form, location: val });
    if (val.length >= 2) {
      const filtered = allCities.filter(c => c.toLowerCase().includes(val.toLowerCase()));
      setCitySuggestions(filtered.slice(0, 6));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await saveApplication({
        id: genId(),
        role_id: form.role_id,
        name: form.name,
        phone: form.phone,
        location: form.location,
        experience: form.experience,
        status: 'New',
        appliedAt: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch (err) {
      alert('Application failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedRoleDetails = job.roles.find(r => r.id?.toString() === form.role_id?.toString());

  const handleWhatsApp = () => {
    const roleTitle = selectedRoleDetails?.title || 'a job';
    const msg = encodeURIComponent(`Hi, I just applied for the ${roleTitle} role at ${job.company} in ${job.location}. Please check my application.`);
    window.open(`https://wa.me/${job.whatsapp_number}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-0 sm:px-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-blue-900 text-white px-5 py-4 flex items-start justify-between rounded-t-2xl sm:rounded-t-2xl">
          <div>
            <p className="text-xs text-blue-300 font-medium">{t('apply_title')}</p>
            <h3 className="font-bold text-lg leading-tight">{job.company}</h3>
            <p className="text-blue-200 text-sm flex items-center gap-1 mt-0.5">
              <MapPin size={12} /> {job.location}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-blue-800 mt-0.5">
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Apply For Role *</label>
                <div className="relative">
                  <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={form.role_id}
                    onChange={(e) => setForm({ ...form, role_id: e.target.value })}
                    className={`w-full border rounded-xl pl-9 pr-4 py-3 text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.role_id ? 'border-red-400' : 'border-gray-300'}`}
                  >
                    <option value="" disabled>Select a role</option>
                    {job.roles.map(r => (
                      <option key={r.id} value={r.id?.toString()}>
                        {r.title} (₹{r.salary_min.toLocaleString('en-IN')} - ₹{r.salary_max.toLocaleString('en-IN')})
                      </option>
                    ))}
                  </select>
                </div>
                {errors.role_id && <p className="text-red-500 text-xs mt-1">{errors.role_id}</p>}
                
                {selectedRoleDetails && (
                   <p className="text-xs text-green-600 font-medium mt-1">
                     {selectedRoleDetails.openings} open positions available!
                   </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('apply_name')} *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder={t('apply_placeholder_name')}
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('apply_phone')} *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder={t('apply_placeholder_phone')}
                  maxLength={10}
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Your City/Location *</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={form.location}
                    onChange={e => handleCityInput(e.target.value)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    placeholder={t('apply_placeholder_location')}
                    className={`w-full border rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.location ? 'border-red-400' : 'border-gray-300'}`}
                  />
                </div>
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                {showSuggestions && citySuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-44 overflow-y-auto">
                    {citySuggestions.map(c => (
                      <li
                        key={c}
                        onMouseDown={() => { setForm({ ...form, location: c }); setShowSuggestions(false); }}
                        className="px-4 py-2.5 text-sm hover:bg-blue-50 cursor-pointer border-b last:border-0 border-gray-100"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('apply_experience')}</label>
                <input
                  type="text"
                  value={form.experience}
                  onChange={e => setForm({ ...form, experience: e.target.value })}
                  placeholder={t('apply_placeholder_exp')}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-900 text-white font-bold py-3.5 rounded-xl transition-all text-base mt-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-800'}`}
              >
                {isSubmitting ? 'Submitting...' : t('apply_submit')}
              </button>
            </form>
          ) : (
            <div className="text-center py-6">
              <CheckCircle size={56} className="text-green-500 mx-auto mb-3" />
              <h3 className="font-bold text-xl text-gray-800 mb-2">Application Submitted!</h3>
              <p className="text-gray-600 text-sm mb-6">{t('apply_success')}</p>

              <button onClick={onClose} className="w-full border border-gray-300 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 text-sm">
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
