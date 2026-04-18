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
    <span className="inline-flex items-center gap-1 bg-gray-50 text-sun-navy border-2 border-sun-gold/40 text-xs font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
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
    Helper: 'bg-white text-sun-navy border-sun-navy shadow-solid-sm',
    ITI: 'bg-sun-yellow text-sun-navy border-sun-navy shadow-solid-sm',
    Skilled: 'bg-sun-navy text-white border-sun-navy shadow-solid-sm',
  }[job.jobType];

  return (
    <>
      <div className="bg-white rounded-sm shadow-solid border-[3px] border-sun-navy overflow-hidden hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_#423d85] transition-all duration-200 flex flex-col h-full">
        {/* Card Header */}
        <div className="bg-sun-navy border-b-[3px] border-sun-navy px-4 pt-4 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                {job.urgentHiring && (
                  <span className="bg-sun-red text-white text-sm font-display font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide border-2 border-sun-red shadow-solid-sm animate-pulse">
                    {t('job_urgent')}
                  </span>
                )}
                <span className={`font-display uppercase tracking-wide text-sm px-2 py-0.5 rounded-sm border-2 ${typeColor}`}>
                  {job.jobType}
                </span>
              </div>
              <h3 className="text-white font-display text-2xl uppercase tracking-wide leading-tight">{job.title}</h3>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sun-yellow font-display text-4xl leading-none">
                ₹{(job.salaryMax / 1000).toFixed(0)}K
              </div>
              <div className="text-sun-gold text-sm font-bold uppercase tracking-wider">/month</div>
            </div>
          </div>
        </div>

        {/* Salary Banner */}
        <div className="bg-sun-yellow border-b-[3px] border-sun-navy px-4 py-2 flex items-center justify-between">
          <span className="text-sun-navy font-display text-xl uppercase tracking-wide">
            {t('job_salary')}: ₹{job.salaryMin.toLocaleString('en-IN')} – ₹{job.salaryMax.toLocaleString('en-IN')}
          </span>
          <span className="flex items-center gap-1 text-sun-navy font-bold uppercase text-xs tracking-wider border-2 border-sun-navy px-2 py-0.5 rounded-sm bg-white shadow-solid-sm">
            <Users size={12} />
            {job.openings} {t('job_openings')}
          </span>
        </div>

        {/* Details */}
        <div className="px-4 py-4 space-y-3 flex-1">
          <div className="flex items-center gap-4 text-sm text-sun-navy flex-wrap">
            <span className="flex items-center gap-1.5 font-bold">
              <MapPin size={16} className="text-sun-gold flex-shrink-0" />
              {job.location}, {job.state}
            </span>
            <span className="flex items-center gap-1.5 font-bold">
              <Clock size={16} className="text-sun-gold flex-shrink-0" />
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
        <div className="px-4 pb-4 grid grid-cols-3 gap-2 mt-auto">
          <button
            onClick={() => setShowModal(true)}
            className="col-span-1 bg-sun-navy text-sun-yellow font-display text-xl uppercase tracking-wide py-2 rounded-sm border-2 border-sun-navy shadow-solid-sm hover:shadow-solid-hover transition-all duration-150 hover:text-white cursor-pointer text-center"
          >
            {t('job_apply')}
          </button>
          <button
            onClick={handleCall}
            className="flex items-center justify-center gap-1 bg-white text-sun-navy font-display text-xl uppercase tracking-wide py-2 rounded-sm border-2 border-sun-navy shadow-solid-sm hover:shadow-solid-hover transition-all duration-150 hover:bg-sun-yellow cursor-pointer"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
            {t('job_call')}
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-1 bg-[#25D366] text-white font-display text-xl uppercase tracking-wide py-2 rounded-sm border-2 border-[#128C7E] shadow-solid-sm hover:shadow-solid-hover transition-all duration-150 cursor-pointer"
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
