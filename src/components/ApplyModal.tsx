import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, CheckCircle, MapPin } from 'lucide-react';
import { Job } from '../types';
import { saveApplication, genId } from '../store';

interface Props {
  job: Job;
  onClose: () => void;
}

const INDIAN_CITIES = [
  'Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bhiwadi', 'Neemrana', 'Alwar', 'Ajmer',
  'Delhi', 'Noida', 'Gurugram', 'Faridabad', 'Ghaziabad',
  'Mumbai', 'Pune', 'Nashik', 'Aurangabad',
  'Bengaluru', 'Mysuru', 'Hubli',
  'Chennai', 'Coimbatore', 'Madurai',
  'Hyderabad', 'Secunderabad',
  'Kolkata', 'Howrah', 'Durgapur',
  'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot',
  'Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut',
  'Patna', 'Gaya',
  'Bhopal', 'Indore', 'Jabalpur',
  'Raipur', 'Bhilai',
  'Ranchi', 'Jamshedpur',
  'Chandigarh', 'Ludhiana', 'Amritsar',
];

export default function ApplyModal({ job, onClose }: Props) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', phone: '', location: '', experience: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter valid 10-digit mobile number';
    if (!form.location.trim()) e.location = 'Location is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCityInput = (val: string) => {
    setForm({ ...form, location: val });
    if (val.length >= 2) {
      const filtered = INDIAN_CITIES.filter(c => c.toLowerCase().includes(val.toLowerCase()));
      setCitySuggestions(filtered.slice(0, 6));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    saveApplication({
      id: genId(),
      jobId: job.id,
      jobTitle: job.title,
      name: form.name,
      phone: form.phone,
      location: form.location,
      experience: form.experience,
      appliedAt: new Date().toISOString(),
    });
    setSubmitted(true);
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Hi, I am interested in ${job.title} job in ${job.location}. Please share details.`);
    window.open(`https://wa.me/${job.whatsappNumber}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-0 sm:px-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-blue-900 text-white px-5 py-4 flex items-start justify-between rounded-t-2xl sm:rounded-t-2xl">
          <div>
            <p className="text-xs text-blue-300 font-medium">{t('apply_title')}</p>
            <h3 className="font-bold text-lg leading-tight">{job.title}</h3>
            <p className="text-yellow-300 text-sm font-semibold">
              ₹{job.salaryMin.toLocaleString('en-IN')} – ₹{job.salaryMax.toLocaleString('en-IN')}/month
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-blue-800 mt-0.5">
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('apply_location')} *</label>
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
                className="w-full bg-blue-900 text-white font-bold py-3.5 rounded-xl hover:bg-blue-800 transition-colors text-base"
              >
                {t('apply_submit')}
              </button>
            </form>
          ) : (
            <div className="text-center py-6">
              <CheckCircle size={56} className="text-green-500 mx-auto mb-3" />
              <h3 className="font-bold text-xl text-gray-800 mb-2">Application Submitted!</h3>
              <p className="text-gray-600 text-sm mb-6">{t('apply_success')}</p>
              <p className="text-sm font-semibold text-gray-700 mb-3">{t('apply_whatsapp_redirect')}</p>
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors mb-3"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Connect on WhatsApp
              </button>
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
