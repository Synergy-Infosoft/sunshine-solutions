import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  const handleWhatsApp = () => {
    const msg = encodeURIComponent('Hi, I am looking for job opportunities. Please share details.');
    window.open(`https://wa.me/919828377776?text=${msg}`, '_blank');
  };

  return (
    <footer className="bg-blue-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <img src="/logo.png" alt="Sunshine Solutions" className="h-14 sm:h-16 w-auto object-contain bg-white px-3 py-2 rounded shadow-sm" />
            </div>
            <p className="text-blue-300 text-sm leading-relaxed mb-4">{t('footer_tagline')}</p>
            <div className="flex gap-3">
              <a
                href="tel:+919828377776"
                className="flex items-center gap-2 bg-yellow-400 text-blue-900 font-bold text-sm px-4 py-2 rounded-full hover:bg-yellow-300 transition-colors"
              >
                <Phone size={15} /> Call Us
              </a>
              <button
                onClick={handleWhatsApp}
                className="flex items-center gap-2 bg-green-500 text-white font-bold text-sm px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-yellow-400 mb-3">{t('footer_quick')}</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: t('nav_jobs') },
                { to: '/about', label: t('nav_about') },
                { to: '/contact', label: t('nav_contact') },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-blue-300 text-sm hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-yellow-400 mb-3">{t('footer_contact')}</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2 text-blue-300 text-sm">
                <Phone size={14} className="mt-0.5 flex-shrink-0 text-yellow-400" />
                <a href="tel:+919828377776" className="hover:text-white transition-colors">+91 9828377776</a>
              </li>
              <li className="flex items-start gap-2 text-blue-300 text-sm">
                <Mail size={14} className="mt-0.5 flex-shrink-0 text-yellow-400" />
                <a href="mailto:hr@sunshinesolution.in" className="hover:text-white transition-colors">hr@sunshinesolution.in</a>
              </li>
              <li className="flex items-start gap-2 text-blue-300 text-sm">
                <MapPin size={14} className="mt-0.5 flex-shrink-0 text-yellow-400" />
                <span>6th Floor, 603, Metro Plaza, Jaipur, Rajasthan</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-blue-400 text-xs">
          <p>© {new Date().getFullYear()} Sunshine Solution Services Pvt. Ltd. {t('footer_rights')}</p>
          <p>ISO Certified | PF & ESIC Compliant</p>
        </div>
      </div>
    </footer>
  );
}
