import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock, Users } from 'lucide-react';
import { Job } from '../types';
import ApplyModal from './ApplyModal';

interface Props {
  job: Job;
}

const BenefitTag = ({ label, active }: { label: string; active: boolean }) => {
  if (!active) return null;
  return (
    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-2 py-0.5 rounded-full">
      {label}
    </span>
  );
};

export default function JobCard({ job }: Props) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Hi, I am interested in ${job.title} job in ${job.location}. Please share details.`);
    window.open(`https://wa.me/${job.whatsappNumber}?text=${msg}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${job.contactNumber}`;
  };

  const shiftLabel = () => {
    if (job.shift === 'Day') return t('job_day');
    if (job.shift === 'Night') return t('job_night');
    return t('job_rotational');
  };

  const typeColor = {
    Helper: 'bg-orange-100 text-orange-700 border-orange-200',
    ITI: 'bg-purple-100 text-purple-700 border-purple-200',
    Skilled: 'bg-teal-100 text-teal-700 border-teal-200',
  }[job.jobType];

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-200">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 pt-4 pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                {job.urgentHiring && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide animate-pulse">
                    {t('job_urgent')}
                  </span>
                )}
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${typeColor}`}>
                  {job.jobType}
                </span>
              </div>
              <h3 className="text-white font-bold text-lg leading-tight">{job.title}</h3>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-yellow-300 font-black text-xl leading-tight">
                ₹{(job.salaryMax / 1000).toFixed(0)}K
              </div>
              <div className="text-yellow-200 text-xs">/month</div>
            </div>
          </div>
        </div>

        {/* Salary Banner */}
        <div className="bg-yellow-400 px-4 py-2 flex items-center justify-between">
          <span className="text-blue-900 font-bold text-sm">
            {t('job_salary')}: ₹{job.salaryMin.toLocaleString('en-IN')} – ₹{job.salaryMax.toLocaleString('en-IN')}
            <span className="font-normal text-blue-800">{t('job_per_month')}</span>
          </span>
          <span className="flex items-center gap-1 text-blue-900 text-xs font-semibold">
            <Users size={12} />
            {job.openings} {t('job_openings')}
          </span>
        </div>

        {/* Details */}
        <div className="px-4 py-3 space-y-2.5">
          <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin size={14} className="text-blue-600 flex-shrink-0" />
              {job.location}, {job.state}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock size={14} className="text-blue-600 flex-shrink-0" />
              {shiftLabel()}
            </span>
          </div>

          {/* Benefits */}
          <div className="flex flex-wrap gap-1.5">
            <BenefitTag label={t('job_pf')} active={job.benefits.pf} />
            <BenefitTag label={t('job_esic')} active={job.benefits.esic} />
            <BenefitTag label={t('job_food')} active={job.benefits.food} />
            <BenefitTag label={t('job_room')} active={job.benefits.room} />
            <BenefitTag label={t('job_overtime')} active={job.benefits.overtime} />
          </div>

          {job.description && (
            <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{job.description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="px-4 pb-4 grid grid-cols-3 gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="col-span-1 bg-blue-900 text-white font-bold text-sm py-2.5 rounded-xl hover:bg-blue-800 transition-colors text-center"
          >
            {t('job_apply')}
          </button>
          <button
            onClick={handleCall}
            className="flex items-center justify-center gap-1.5 bg-blue-100 text-blue-900 font-bold text-sm py-2.5 rounded-xl hover:bg-blue-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
            {t('job_call')}
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-1.5 bg-green-500 text-white font-bold text-sm py-2.5 rounded-xl hover:bg-green-600 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            {t('job_whatsapp')}
          </button>
        </div>
      </div>

      {showModal && <ApplyModal job={job} onClose={() => setShowModal(false)} />}
    </>
  );
}
