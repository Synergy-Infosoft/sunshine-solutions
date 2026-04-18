import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, Users, MessageSquare,
  LogOut, Menu, X, ExternalLink
} from 'lucide-react';

export default function AdminLayout() {
  const [sideOpen, setSideOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const auth = sessionStorage.getItem('ss_admin_auth');
    if (!auth) navigate('/admin');
  }, []);

  const logout = () => {
    sessionStorage.removeItem('ss_admin_auth');
    navigate('/admin');
  };

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/jobs', label: 'Job Management', icon: Briefcase },
    { to: '/admin/applications', label: 'Applications', icon: Users },
    { to: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile Drawer Backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-blue-950/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${sideOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setSideOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-blue-950 text-white flex flex-col transform transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${sideOpen ? 'translate-x-0 shadow-2xl skew-x-0' : '-translate-x-full -skew-x-2'} lg:translate-x-0 lg:skew-x-0 lg:static lg:flex lg:shadow-none`}>
        {/* Logo */}
        <div className="p-5 border-b border-blue-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Logo" className="h-9 w-9 rounded-full border-2 border-yellow-400 object-cover" />
            <div>
              <div className="font-bold text-sm leading-tight">Sunshine Solutions</div>
              <div className="text-blue-400 text-xs">Admin Panel</div>
            </div>
          </div>
          <button onClick={() => setSideOpen(false)} className="lg:hidden p-1 hover:bg-blue-800 rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSideOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                  isActive(item.to)
                    ? 'bg-yellow-400 text-blue-900'
                    : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-blue-800 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm text-blue-200 hover:bg-blue-800 hover:text-white transition-colors"
          >
            <ExternalLink size={18} />
            View Website
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>



      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-subtle">
          <button
            onClick={() => setSideOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
          <div className="font-bold text-gray-800 text-base lg:hidden">Admin Panel</div>
          <div className="hidden lg:block font-bold text-gray-800">
            {navItems.find(n => isActive(n.to))?.label || 'Admin Panel'}
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-red-500 font-semibold hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors"
          >
            <LogOut size={15} /> Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
