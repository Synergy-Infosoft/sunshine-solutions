import { useTranslation } from 'react-i18next';
import { CheckCircle, Award, Users, MapPin, Building2 } from 'lucide-react';

const stats = [
  { val: '18+', label: 'Years Experience', icon: Award },
  { val: '10,000+', label: 'Employees Placed', icon: Users },
  { val: '60+', label: 'Corporate Clients', icon: Building2 },
  { val: '11', label: 'States Covered', icon: MapPin },
];

const services = [
  'Factory / Plant Helpers',
  'ITI Certified Technicians',
  'Skilled Industrial Workers',
  'Housekeeping & Facility Management',
  'Security Personnel',
  'Contractual Staffing',
];

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-950 to-blue-800 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <img src="/logo.png" alt="Sunshine Solutions" className="h-20 w-20 rounded-full border-4 border-yellow-400 object-cover mx-auto mb-4 shadow-xl" />
          <h1 className="text-3xl sm:text-4xl font-black mb-3">{t('about_title')}</h1>
          <p className="text-blue-200 text-base sm:text-lg">{t('about_subtitle')}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="text-center">
                <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Icon size={22} className="text-blue-700" />
                </div>
                <div className="text-blue-900 font-black text-2xl">{s.val}</div>
                <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Company Info */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Who We Are</h2>
          <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
            <p>{t('about_desc1')}</p>
            <p>{t('about_desc2')}</p>
            <p>We are fully compliant with PF, ESIC, Contract Labour regulations and ISO certified, ensuring legal safety for both clients and workers.</p>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
            <h3 className="font-bold text-gray-800 mb-2">{t('about_mission')}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{t('about_mission_desc')}</p>
          </div>
        </div>

        {/* Services */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Our Services</h2>
          <ul className="space-y-2.5">
            {services.map(s => (
              <li key={s} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
                <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                <span className="text-gray-700 text-sm font-medium">{s}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 bg-blue-900 text-white rounded-2xl p-5">
            <h3 className="font-bold text-base mb-1">ISO Certified & Legally Compliant</h3>
            <p className="text-blue-200 text-sm">PF, ESIC, Contract Labour Act, and all statutory compliance maintained for every placement.</p>
          </div>
        </div>
      </div>

      {/* Clients Section */}
      <div className="bg-white border-t border-gray-100 py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Trusted by 60+ Companies</h2>
          <p className="text-gray-500 text-sm mb-6">Serving Private Sector & Public Sector clients across India for 18+ years.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { title: '50% Clients', sub: 'Relationship of 10+ Years' },
              { title: '11 States', sub: 'Pan India Operations' },
              { title: '50 Cities', sub: 'Active Deployments' },
            ].map(c => (
              <div key={c.title} className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="text-blue-900 font-black text-xl">{c.title}</div>
                <div className="text-gray-500 text-xs mt-1">{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-10 px-4 text-center">
        <h2 className="text-xl font-bold mb-2">Looking for a Job?</h2>
        <p className="text-blue-200 text-sm mb-5">Browse our latest factory and industrial jobs and apply in under 2 minutes.</p>
        <a
          href="/"
          className="inline-block bg-yellow-400 text-blue-900 font-bold px-8 py-3 rounded-full hover:bg-yellow-300 transition-colors"
        >
          View All Jobs
        </a>
      </div>
    </div>
  );
}
