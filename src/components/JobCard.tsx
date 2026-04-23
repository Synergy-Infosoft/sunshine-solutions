import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Users, ArrowRight } from 'lucide-react';
import { Job, JobRole } from '../types';
import ApplyModal from './ApplyModal';

const PALETTES = [
  { from: 'from-[#0B132B]', to: 'to-blue-900', badge: 'bg-blue-800', text: 'text-blue-100', border: 'border-blue-700/50', accent: 'text-blue-200/80' },
  { from: 'from-[#1A1C2C]', to: 'to-[#4A192C]', badge: 'bg-[#5C1F37]', text: 'text-rose-100', border: 'border-rose-900/30', accent: 'text-rose-200/80' },
  { from: 'from-[#0F2027]', to: 'to-[#2C5364]', badge: 'bg-[#203A43]', text: 'text-cyan-100', border: 'border-cyan-900/30', accent: 'text-cyan-200/80' },
  { from: 'from-[#141E30]', to: 'to-[#243B55]', badge: 'bg-[#2C3E50]', text: 'text-slate-100', border: 'border-slate-800/50', accent: 'text-slate-200/80' },
  { from: 'from-[#134E5E]', to: 'to-[#71B280]', badge: 'bg-[#134E5E]', text: 'text-emerald-100', border: 'border-emerald-900/30', accent: 'text-emerald-200/80' },
  { from: 'from-[#232526]', to: 'to-[#414345]', badge: 'bg-[#2C3E50]', text: 'text-gray-100', border: 'border-gray-800/50', accent: 'text-gray-200/80' },
  { from: 'from-[#200122]', to: 'to-[#6f0000]', badge: 'bg-[#4A0000]', text: 'text-red-100', border: 'border-red-900/30', accent: 'text-red-200/80' },
  { from: 'from-[#2C3E50]', to: 'to-[#000000]', badge: 'bg-[#1C2833]', text: 'text-gray-200', border: 'border-gray-900/50', accent: 'text-gray-300/80' },
];

interface Props {
  job: Job;
}

export default function JobCard({ job }: Props) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<JobRole | undefined>();

  const openApply = (role?: JobRole) => {
    setSelectedRole(role);
    setShowModal(true);
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Hi, I am interested in jobs at ${job.company} in ${job.location}. Please share details.`);
    window.open(`https://wa.me/${job.whatsapp_number}?text=${msg}`, '_blank');
  };

  const hasUrgent = job.roles.some(r => r.urgent_hiring);
  
  // Pick a palette based on job ID
  const paletteIndex = parseInt(job.id.toString()) % PALETTES.length;
  const palette = PALETTES[isNaN(paletteIndex) ? 0 : paletteIndex];

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
        
        {/* --- DYNAMIC GRADIENT HEADER --- */}
        <div className={`bg-gradient-to-r ${palette.from} ${palette.to} px-4 pt-4 pb-3 relative overflow-hidden min-h-[140px] flex flex-col justify-between`}>
          {/* Subtle overlay elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>
          
          <div className="flex items-start justify-between gap-2 relative z-10">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                {hasUrgent && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider animate-pulse">
                    {t('job_urgent', 'Urgent Hiring')}
                  </span>
                )}
                <span className={`${palette.badge} ${palette.text} border ${palette.border} text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider`}>
                  Site: {job.location}
                </span>
              </div>
              <h3 className="text-white font-black text-xl leading-tight line-clamp-2">
                {job.company} Hiring 
                <span className="text-amber-400"> – {job.location}</span>
              </h3>
            </div>
          </div>
          <div className={`mt-3 flex items-center gap-3 text-sm ${palette.accent} font-medium relative z-10`}>
             <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded">
               <MapPin size={14} className="text-amber-400" />
               {job.location}
             </span>
             {/* {job.applicant_count ? (
               <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded text-white">
                 <Users size={14} className="text-green-400" />
                 {job.applicant_count} Applied
               </span>
             ) : null} */}
          </div>
        </div>

        {/* --- POSITIONS SECTION (NEW STYLE) --- */}
        <div className="p-3.5 flex-1 bg-white">
           <h4 className="text-[10px] font-semibold text-gray-600 uppercase tracking-[0.2em] mb-3 ml-1">
             OPEN POSITIONS
           </h4>
           
           <div className="space-y-3">
             {job.roles.map(role => (
               <div key={role.id} className="relative bg-[#F9FBFC] border border-gray-100 rounded-xl p-3 transition-all hover:border-amber-200 shadow-sm">
                  <div className="flex justify-between items-start gap-3 mb-3">
                     <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                           <h5 className="font-bold text-gray-800 text-base leading-none capitalize">{role.title}</h5>
                           {role.urgent_hiring && (
                             <span className="bg-red-50 text-red-600 text-[9px] font-black px-1.5 py-0.5 rounded leading-none ml-1">URGENT</span>
                           )}
                        </div>
                        <div className="text-amber-600 font-extrabold text-sm">
                           ₹{role.salary_min.toLocaleString('en-IN')} – ₹{role.salary_max.toLocaleString('en-IN')} / mo
                        </div>
                     </div>
                     
                     <button
                        onClick={() => openApply(role)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-black text-[10px] px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-yellow-400/20 active:scale-95 shimmer-effect"
                     >
                        APPLY <ArrowRight size={14} />
                     </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2.5 border-t border-gray-100/60">
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] px-3 py-1 rounded-full font-bold">
                      {role.openings} Openings
                    </span>
                    <span className="bg-white border border-gray-200 text-gray-500 text-[10px] px-3 py-1 rounded-full font-medium">
                      {role.type}
                    </span>
                    <span className="bg-white border border-gray-200 text-gray-500 text-[10px] px-3 py-1 rounded-full font-medium">
                      {role.shift} Shift
                    </span>
                  </div>
               </div>
             ))}
           </div>
        </div>

      </div>

      {showModal && <ApplyModal job={job} preselectedRole={selectedRole} onClose={() => setShowModal(false)} />}
    </>
  );
}
