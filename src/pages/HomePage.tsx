import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { getJobs } from '../store';
import { JobType, ShiftType } from '../types';
import JobCard from '../components/JobCard';

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
  'Patna', 'Gaya', 'Bhopal', 'Indore', 'Jabalpur',
  'Raipur', 'Bhilai', 'Ranchi', 'Jamshedpur',
  'Chandigarh', 'Ludhiana', 'Amritsar',
];

const WHATSAPP_NUM = '919828377776';

export default function HomePage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState<JobType | ''>('');
  const [shift, setShift] = useState<ShiftType | ''>('');
  const [salaryMin, setSalaryMin] = useState('');
  const [facilities, setFacilities] = useState({ pf: false, esic: false, food: false, room: false });
  const [showFilters, setShowFilters] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCitySug, setShowCitySug] = useState(false);

  const allJobs = getJobs().filter(j => j.status === 'Active');

  const filtered = useMemo(() => {
    return allJobs.filter(j => {
      if (search && !j.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (location && !j.location.toLowerCase().includes(location.toLowerCase()) && !j.state.toLowerCase().includes(location.toLowerCase())) return false;
      if (jobType && j.jobType !== jobType) return false;
      if (shift && j.shift !== shift) return false;
      if (salaryMin && j.salaryMax < parseInt(salaryMin)) return false;
      if (facilities.pf && !j.benefits.pf) return false;
      if (facilities.esic && !j.benefits.esic) return false;
      if (facilities.food && !j.benefits.food) return false;
      if (facilities.room && !j.benefits.room) return false;
      return true;
    });
  }, [search, location, jobType, shift, salaryMin, facilities, allJobs.length]);

  const urgentJobs = filtered.filter(j => j.urgentHiring);
  const regularJobs = filtered.filter(j => !j.urgentHiring);

  const handleCityInput = (val: string) => {
    setLocation(val);
    if (val.length >= 2) {
      const f = INDIAN_CITIES.filter(c => c.toLowerCase().includes(val.toLowerCase()));
      setCitySuggestions(f.slice(0, 6));
      setShowCitySug(true);
    } else {
      setShowCitySug(false);
    }
  };

  const clearFilters = () => {
    setSearch(''); setLocation(''); setJobType(''); setShift(''); setSalaryMin('');
    setFacilities({ pf: false, esic: false, food: false, room: false });
  };

  const hasFilters = search || location || jobType || shift || salaryMin || Object.values(facilities).some(Boolean);

  const handleWhatsApp = () => {
    const msg = encodeURIComponent('Hi, I am looking for factory job opportunities. Please share available positions.');
    window.open(`https://wa.me/${WHATSAPP_NUM}?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Bulk Hiring Active — 1000+ Openings
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-3">
              {t('hero_title')}
            </h1>
            <p className="text-blue-200 text-base sm:text-lg leading-relaxed mb-6">
              {t('hero_subtitle')}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#jobs"
                className="bg-yellow-400 text-blue-900 font-bold px-6 py-3 rounded-full hover:bg-yellow-300 transition-colors text-sm sm:text-base"
              >
                {t('hero_btn_browse')}
              </a>
              <button
                onClick={handleWhatsApp}
                className="flex items-center gap-2 bg-green-500 text-white font-bold px-6 py-3 rounded-full hover:bg-green-600 transition-colors text-sm sm:text-base"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {t('hero_btn_whatsapp')}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 pt-8 border-t border-blue-800">
            {[
              { val: '18+', label: t('hero_stats_exp') },
              { val: '10K+', label: t('hero_stats_emp') },
              { val: '100+', label: t('hero_stats_clients') },
              { val: '11', label: t('hero_stats_states') },
            ].map(s => (
              <div key={s.label} className="bg-blue-800/50 rounded-xl px-4 py-3 text-center">
                <div className="text-yellow-400 font-black text-2xl">{s.val}</div>
                <div className="text-blue-300 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm" id="jobs">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('filter_search')}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative hidden sm:block">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={location}
                onChange={e => handleCityInput(e.target.value)}
                onBlur={() => setTimeout(() => setShowCitySug(false), 150)}
                placeholder={t('filter_location')}
                className="w-40 pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {showCitySug && citySuggestions.length > 0 && (
                <ul className="absolute z-20 w-48 bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-44 overflow-y-auto">
                  {citySuggestions.map(c => (
                    <li
                      key={c}
                      onMouseDown={() => { setLocation(c); setShowCitySug(false); }}
                      className="px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer border-b last:border-0 border-gray-100"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${showFilters ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
            >
              <Filter size={15} />
              {t('filter_title')}
              {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-red-500 text-sm font-semibold px-2 hover:bg-red-50 rounded-xl transition-colors">
                <X size={15} />
                <span className="hidden sm:inline">{t('filter_clear')}</span>
              </button>
            )}
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* Mobile location */}
              <div className="sm:hidden relative col-span-2">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={e => handleCityInput(e.target.value)}
                  onBlur={() => setTimeout(() => setShowCitySug(false), 150)}
                  placeholder={t('filter_location')}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={jobType}
                onChange={e => setJobType(e.target.value as JobType | '')}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">{t('filter_type')}: {t('filter_all')}</option>
                <option value="Helper">Helper</option>
                <option value="ITI">ITI</option>
                <option value="Skilled">Skilled</option>
              </select>

              <select
                value={shift}
                onChange={e => setShift(e.target.value as ShiftType | '')}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">{t('filter_shift')}: {t('filter_all')}</option>
                <option value="Day">Day</option>
                <option value="Night">Night</option>
                <option value="Rotational">Rotational</option>
              </select>

              <select
                value={salaryMin}
                onChange={e => setSalaryMin(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">{t('filter_salary')}: {t('filter_all')}</option>
                <option value="10000">Min ₹10,000</option>
                <option value="15000">Min ₹15,000</option>
                <option value="20000">Min ₹20,000</option>
                <option value="25000">Min ₹25,000</option>
              </select>

              <div className="col-span-2 sm:col-span-1 lg:col-span-2 flex flex-wrap gap-2 items-center">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('filter_facilities')}:</span>
                {(['pf', 'esic', 'food', 'room'] as const).map(f => (
                  <label key={f} className={`flex items-center gap-1 px-2.5 py-1 rounded-full border cursor-pointer text-xs font-semibold transition-colors ${facilities[f] ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'}`}>
                    <input
                      type="checkbox"
                      checked={facilities[f]}
                      onChange={e => setFacilities({ ...facilities, [f]: e.target.checked })}
                      className="hidden"
                    />
                    {f.toUpperCase()}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Jobs Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800 text-lg">
            {filtered.length} {filtered.length === 1 ? 'Job' : 'Jobs'} Found
          </h2>
          {hasFilters && (
            <button onClick={clearFilters} className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">
              <X size={13} /> {t('filter_clear')}
            </button>
          )}
        </div>

        {urgentJobs.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              <h3 className="font-bold text-red-600 uppercase text-sm tracking-wider">Urgent Hiring</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {urgentJobs.map(job => <JobCard key={job.id} job={job} />)}
            </div>
          </div>
        )}

        {regularJobs.length > 0 && (
          <div>
            {urgentJobs.length > 0 && (
              <h3 className="font-bold text-gray-600 uppercase text-sm tracking-wider mb-3">All Jobs</h3>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {regularJobs.map(job => <JobCard key={job.id} job={job} />)}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-300 mb-4">
              <Search size={60} className="mx-auto" />
            </div>
            <h3 className="font-bold text-xl text-gray-700 mb-2">No jobs found</h3>
            <p className="text-gray-500 mb-6 text-sm">Try adjusting your filters or contact us directly.</p>
            <button
              onClick={clearFilters}
              className="bg-blue-900 text-white font-bold px-6 py-3 rounded-full hover:bg-blue-800 transition-colors"
            >
              {t('filter_clear')}
            </button>
          </div>
        )}
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent('Hi, I am looking for factory job opportunities. Please share available positions.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-4 z-40 bg-green-500 text-white p-4 rounded-full shadow-xl hover:bg-green-600 transition-colors flex items-center gap-2 group"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        <span className="hidden group-hover:inline text-sm font-bold whitespace-nowrap">Chat with us</span>
      </a>
    </div>
  );
}
