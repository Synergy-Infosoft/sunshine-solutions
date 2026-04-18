import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, MessageSquare, TrendingUp, Clock, MapPin } from 'lucide-react';
import { getJobs, getApplications, getEnquiries } from '../../store';

export default function Dashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [apps, setApps] = useState<any[]>([]);
  const [enqs, setEnqs] = useState<any[]>([]);

  useEffect(() => {
    getJobs().then(setJobs);
    getApplications().then(setApps);
    getEnquiries().then(setEnqs);
  }, []);

  const activeJobs = jobs.filter(j => j.status === 'Active').length;
  const expiredJobs = jobs.filter(j => j.status === 'Expired').length;
  const urgentJobs = jobs.filter(j => j.urgentHiring && j.status === 'Active').length;

  const today = new Date().toDateString();
  const todayApps = apps.filter(a => new Date(a.appliedAt).toDateString() === today).length;
  const todayEnqs = enqs.filter(e => new Date(e.createdAt).toDateString() === today).length;

  const recentApps = apps.slice(0, 5);
  const recentEnqs = enqs.slice(0, 5);

  const topLocations = jobs.reduce((acc: Record<string, number>, j) => {
    acc[j.location] = (acc[j.location] || 0) + 1;
    return acc;
  }, {});
  const topLoc = Object.entries(topLocations).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const statCards = [
    { label: 'Total Jobs', val: jobs.length, sub: `${activeJobs} Active`, icon: Briefcase, color: 'bg-blue-600', to: '/admin/jobs' },
    { label: 'Total Applications', val: apps.length, sub: `${todayApps} Today`, icon: Users, color: 'bg-green-600', to: '/admin/applications' },
    { label: 'Total Enquiries', val: enqs.length, sub: `${todayEnqs} Today`, icon: MessageSquare, color: 'bg-purple-600', to: '/admin/enquiries' },
    { label: 'Urgent Hiring', val: urgentJobs, sub: `${expiredJobs} Expired`, icon: TrendingUp, color: 'bg-red-600', to: '/admin/jobs' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Welcome back! Here's an overview of your portal.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              to={s.to}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`${s.color} p-2.5 rounded-xl`}>
                  <Icon size={20} className="text-white" />
                </div>
              </div>
              <div className="text-2xl font-black text-gray-800">{s.val}</div>
              <div className="text-gray-500 text-xs font-medium mt-0.5">{s.label}</div>
              <div className="text-gray-400 text-xs mt-1">{s.sub}</div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-800">Recent Applications</h2>
            <Link to="/admin/applications" className="text-blue-600 text-sm font-semibold hover:underline">View All</Link>
          </div>
          {recentApps.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No applications yet.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentApps.map(a => (
                <div key={a.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-800 text-sm truncate">{a.name}</div>
                    <div className="text-gray-400 text-xs">{a.jobTitle} • {a.location}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-blue-600 text-xs font-semibold">{a.phone}</div>
                    <div className="text-gray-400 text-xs flex items-center gap-1">
                      <Clock size={11} /> {new Date(a.appliedAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Locations + Recent Enquiries */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">Job Locations</h2>
            </div>
            <div className="p-4 space-y-2">
              {topLoc.map(([loc, count]) => (
                <div key={loc} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm text-gray-600">
                    <MapPin size={13} className="text-blue-500" /> {loc}
                  </span>
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
                </div>
              ))}
              {topLoc.length === 0 && <p className="text-gray-400 text-sm text-center py-3">No data yet.</p>}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-800">Recent Enquiries</h2>
              <Link to="/admin/enquiries" className="text-blue-600 text-sm font-semibold hover:underline">View All</Link>
            </div>
            {recentEnqs.length === 0 ? (
              <div className="p-5 text-center text-gray-400 text-sm">No enquiries yet.</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentEnqs.map(e => (
                  <div key={e.id} className="px-4 py-2.5">
                    <div className="font-semibold text-gray-800 text-xs">{e.name}</div>
                    <div className="text-gray-400 text-xs">{e.phone}</div>
                    <p className="text-gray-500 text-xs truncate">{e.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
