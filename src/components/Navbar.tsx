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
    <nav className="bg-sun-navy text-white sticky top-0 z-50 border-b-2 border-sun-gold/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Sunshine Solutions" className="h-12 sm:h-14 w-auto object-contain bg-white px-2 py-1 rounded-sm shadow-solid-sm" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`font-display tracking-wide uppercase text-lg transition-colors duration-200 hover:text-sun-gold ${location.pathname === l.to ? 'text-sun-yellow border-b-2 border-sun-yellow pb-0.5' : 'text-white'}`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 text-sm bg-sun-navy hover:bg-sun-navy/80 px-3 py-1.5 rounded-sm transition-colors duration-200 border-2 border-sun-gold/40 hover:border-sun-gold hover:text-sun-gold cursor-pointer"
              title="Switch Language"
            >
              <Globe size={14} />
              <span className="font-bold tracking-wide uppercase">{i18n.language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>
            <a
              href="tel:+919828377776"
              className="hidden sm:flex items-center gap-1.5 bg-sun-yellow text-sun-navy font-display text-lg tracking-wide uppercase px-4 py-1.5 rounded-sm transition-all duration-150 border-2 border-sun-navy shadow-solid-sm hover:shadow-solid-hover hover:bg-sun-gold cursor-pointer"
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
        <div className="md:hidden bg-sun-navy border-t-2 border-sun-gold/20 px-4 pb-4 pt-2">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block py-2.5 font-display text-xl uppercase tracking-wide border-b border-sun-gold/20 transition-colors duration-200 hover:text-sun-gold ${location.pathname === l.to ? 'text-sun-yellow' : 'text-white'}`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="tel:+919828377776"
            className="mt-4 flex items-center justify-center gap-2 bg-sun-yellow text-sun-navy font-display text-xl uppercase tracking-wide px-4 py-2 rounded-sm border-2 border-sun-navy shadow-solid-sm hover:shadow-solid-hover transition-all duration-150 hover:bg-sun-gold cursor-pointer"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
            +91 9828377776
          </a>
        </div>
      )}
    </nav>
  );
}
