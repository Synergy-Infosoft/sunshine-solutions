import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe } from 'lucide-react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isAdmin = location.pathname.startsWith('/admin');

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en');
  };

  const links = [
    { to: '/', label: t('nav_jobs') },
    { to: '/about', label: t('nav_about') },
    { to: '/contact', label: t('nav_contact') },
  ];

  if (isAdmin) return null;

  return (
    <nav className="bg-blue-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Sunshine Solutions" className="h-12 sm:h-14 w-auto object-contain bg-white px-2 py-1 rounded" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`font-semibold text-sm transition-colors hover:text-yellow-300 ${location.pathname === l.to ? 'text-yellow-400 border-b-2 border-yellow-400 pb-0.5' : 'text-white'}`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 text-sm bg-blue-800 hover:bg-blue-700 px-3 py-1.5 rounded-full transition-colors border border-blue-600"
              title="Switch Language"
            >
              <Globe size={14} />
              <span className="font-semibold">{i18n.language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>
            <a
              href="tel:+919828377776"
              className="hidden sm:flex items-center gap-1.5 bg-yellow-400 text-blue-900 font-bold text-sm px-3 py-1.5 rounded-full hover:bg-yellow-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
              Call Now
            </a>
            <button
              className="md:hidden p-1.5 rounded-md hover:bg-blue-800"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-blue-800 border-t border-blue-700 px-4 pb-4 pt-2">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block py-2.5 font-semibold text-sm border-b border-blue-700 hover:text-yellow-300 transition-colors ${location.pathname === l.to ? 'text-yellow-400' : 'text-white'}`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="tel:+919828377776"
            className="mt-3 flex items-center justify-center gap-2 bg-yellow-400 text-blue-900 font-bold text-sm px-4 py-2.5 rounded-full"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
            +91 9828377776
          </a>
        </div>
      )}
    </nav>
  );
}
