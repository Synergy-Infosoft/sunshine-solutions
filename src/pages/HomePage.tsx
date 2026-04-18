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
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="bg-sun-navy text-white border-b-4 border-sun-gold">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-sun-yellow text-sun-navy text-sm font-bold px-4 py-1.5 rounded-sm mb-6 uppercase tracking-wider border-2 border-sun-navy shadow-solid-sm">
              <span className="w-2.5 h-2.5 bg-sun-red rounded-sm animate-pulse"></span>
              Bulk Hiring Active — 1000+ Openings
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold uppercase tracking-wide leading-none mb-4 text-white">
              {t('hero_title')}
            </h1>
            <p className="text-sun-gold/90 text-lg sm:text-xl font-medium leading-relaxed mb-8 max-w-xl">
              {t('hero_subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#jobs"
                className="bg-sun-yellow text-sun-navy font-display text-2xl uppercase tracking-wide px-8 py-3 rounded-sm border-2 border-sun-navy shadow-solid-sm hover:shadow-solid-hover transition-all duration-150 hover:bg-sun-gold cursor-pointer"
              >
                {t('hero_btn_browse')}
              </a>
              <button
                onClick={handleWhatsApp}
                className="flex items-center gap-2 bg-[#25D366] text-white font-display text-2xl uppercase tracking-wide px-8 py-3 rounded-sm border-2 border-[#128C7E] shadow-solid-sm hover:shadow-solid-hover transition-all duration-150 cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {t('hero_btn_whatsapp')}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t-2 border-sun-gold/20">
            {[
              { val: '18+', label: t('hero_stats_exp') },
              { val: '10K+', label: t('hero_stats_emp') },
              { val: '100+', label: t('hero_stats_clients') },
              { val: '11', label: t('hero_stats_states') },
            ].map(s => (
              <div key={s.label} className="bg-sun-navy/50 border-2 border-sun-gold/20 rounded-sm px-4 py-4 text-center">
                <div className="text-sun-gold font-display text-4xl leading-none mb-1">{s.val}</div>
                <div className="text-white/80 font-display uppercase tracking-wide text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-white border-b-2 border-sun-navy sticky top-16 z-30 shadow-md" id="jobs">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-sun-navy" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('filter_search')}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-sun-navy rounded-sm text-sm font-medium focus:outline-none focus:ring-0 focus:border-sun-gold focus:shadow-solid-sm transition-all duration-150"
              />
            </div>
            <div className="relative hidden sm:block">
              <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-sun-navy" />
              <input
                type="text"
                value={location}
                onChange={e => handleCityInput(e.target.value)}
                onBlur={() => setTimeout(() => setShowCitySug(false), 150)}
                placeholder={t('filter_location')}
                className="w-48 pl-10 pr-4 py-2.5 border-2 border-sun-navy rounded-sm text-sm font-medium focus:outline-none focus:ring-0 focus:border-sun-gold focus:shadow-solid-sm transition-all duration-150"
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
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-sm font-display uppercase tracking-wide text-lg transition-all duration-150 border-2 cursor-pointer ${showFilters ? 'bg-sun-navy text-white border-sun-navy shadow-solid-sm' : 'bg-white text-sun-navy border-sun-navy hover:bg-sun-gold hover:shadow-solid-sm'}`}
            >
              <Filter size={16} />
              {t('filter_title')}
              {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-sun-red px-3 border-2 border-transparent hover:border-sun-red rounded-sm transition-all duration-150 cursor-pointer">
                <X size={20} />
                <span className="hidden sm:inline font-display uppercase tracking-wide text-lg">{t('filter_clear')}</span>
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
                  className="w-full pl-10 pr-4 py-2 border-2 border-sun-navy rounded-sm text-sm font-medium focus:outline-none focus:ring-0 focus:border-sun-gold focus:shadow-solid-sm transition-all duration-150"
                />
              </div>

              <select
                value={jobType}
                onChange={e => setJobType(e.target.value as JobType | '')}
                className="border-2 border-sun-navy font-medium rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-sun-gold focus:shadow-solid-sm transition-all duration-150 bg-white"
              >
                <option value="">{t('filter_type')}: {t('filter_all')}</option>
                <option value="Helper">Helper</option>
                <option value="ITI">ITI</option>
                <option value="Skilled">Skilled</option>
              </select>

              <select
                value={shift}
                onChange={e => setShift(e.target.value as ShiftType | '')}
                className="border-2 border-sun-navy font-medium rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-sun-gold focus:shadow-solid-sm transition-all duration-150 bg-white"
              >
                <option value="">{t('filter_shift')}: {t('filter_all')}</option>
                <option value="Day">Day</option>
                <option value="Night">Night</option>
                <option value="Rotational">Rotational</option>
              </select>

              <select
                value={salaryMin}
                onChange={e => setSalaryMin(e.target.value)}
                className="border-2 border-sun-navy font-medium rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-sun-gold focus:shadow-solid-sm transition-all duration-150 bg-white"
              >
                <option value="">{t('filter_salary')}: {t('filter_all')}</option>
                <option value="10000">Min ₹10,000</option>
                <option value="15000">Min ₹15,000</option>
                <option value="20000">Min ₹20,000</option>
                <option value="25000">Min ₹25,000</option>
              </select>

              <div className="col-span-2 sm:col-span-1 lg:col-span-2 flex flex-wrap gap-2 items-center">
                <span className="text-sm font-display uppercase tracking-wide text-sun-navy">{t('filter_facilities')}:</span>
                {(['pf', 'esic', 'food', 'room'] as const).map(f => (
                  <label key={f} className={`flex items-center gap-1.5 px-3 py-1 rounded-sm border-2 cursor-pointer font-display tracking-wide uppercase text-lg transition-colors duration-150 ${facilities[f] ? 'bg-sun-navy text-sun-yellow border-sun-navy shadow-solid-sm' : 'bg-white text-sun-navy border-sun-gold/50 hover:border-sun-gold hover:bg-sun-gold/10'}`}>
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 border-b-2 border-sun-gold/20 pb-2">
          <h2 className="font-display text-2xl uppercase tracking-wide text-sun-navy">
            {filtered.length} {filtered.length === 1 ? 'Job' : 'Jobs'} Found
          </h2>
          {hasFilters && (
            <button onClick={clearFilters} className="text-sm text-sun-red font-bold hover:underline flex items-center gap-1 cursor-pointer">
              <X size={16} /> {t('filter_clear')}
            </button>
          )}
        </div>

        {urgentJobs.length > 0 && (
          <div className="mb-10 bg-caution/10 p-4 rounded-sm border-2 border-sun-navy">
            <div className="flex items-center gap-2 mb-4 bg-white px-3 py-1.5 rounded-sm border-2 border-sun-red shadow-solid-sm inline-flex">
              <span className="w-3 h-3 bg-sun-red rounded-sm animate-pulse"></span>
              <h3 className="font-display font-bold text-sun-red uppercase text-xl tracking-wider leading-none">Urgent Hiring</h3>
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
          <div className="text-center py-20 bg-gray-50 border-2 border-sun-gold/20 rounded-sm">
            <div className="text-sun-gold/50 mb-4">
              <Search size={64} className="mx-auto" />
            </div>
            <h3 className="font-display uppercase text-3xl text-sun-navy mb-2">No jobs found</h3>
            <p className="text-sun-navy/70 mb-8 font-medium">Try adjusting your filters or contact us directly.</p>
            <button
              onClick={clearFilters}
              className="bg-sun-navy text-sun-yellow font-display text-2xl uppercase tracking-wide border-2 border-sun-navy shadow-solid-sm px-8 py-3 rounded-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-solid-hover transition-all duration-150 cursor-pointer"
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
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-sm border-2 border-[#128C7E] shadow-solid hover:shadow-solid-hover hover:translate-x-1 hover:translate-y-1 transition-all duration-150 flex items-center gap-2 group cursor-pointer"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        <span className="hidden group-hover:inline font-display uppercase tracking-wide text-xl whitespace-nowrap">Chat with us</span>
      </a>
    </div>
  );
}
