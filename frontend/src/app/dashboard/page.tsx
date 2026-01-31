'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { DashboardStats, IMSStatus, PriorityLevel } from '@/types';
import Link from 'next/link';
import { format } from 'date-fns';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/statistics');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-800 dark:text-slate-200">Loading...</div>;
  }

  if (!stats) {
    return <div className="text-center py-12 text-slate-800 dark:text-slate-200">No data available</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Overview of IMS management system
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div className="card">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Total IMS</div>
          <div className="mt-1 text-3xl font-semibold text-slate-800 dark:text-slate-200">
            {stats.overview.totalIMS}
          </div>
        </div>
        <div className="card">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Analysts</div>
          <div className="mt-1 text-3xl font-semibold text-slate-800 dark:text-slate-200">
            {stats.overview.totalAnalysts}
          </div>
        </div>
        <div className="card">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Tags</div>
          <div className="mt-1 text-3xl font-semibold text-slate-800 dark:text-slate-200">
            {stats.overview.totalTags}
          </div>
        </div>
        <div className="card">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Merges</div>
          <div className="mt-1 text-3xl font-semibold text-slate-800 dark:text-slate-200">
            {stats.overview.totalMerges}
          </div>
        </div>
        <div className="card">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Unassigned</div>
          <div className="mt-1 text-3xl font-semibold text-slate-800 dark:text-slate-200">
            {stats.overview.unassignedIMS}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="card">
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">
            Status Distribution
          </h3>
          <div className="space-y-3">
            {stats.statusDistribution.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`badge badge-${item.status.toLowerCase().replace('_', '-')}`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="card">
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">
            Priority Distribution
          </h3>
          <div className="space-y-3">
            {stats.priorityDistribution.map((item) => (
              <div key={item.priority} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`badge badge-${item.priority.toLowerCase()}`}>
                    {item.priority}
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent IMS */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Recent IMS</h3>
          <Link href="/ims" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead>
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                  CCD ID
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                  Report Name
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                  Status
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                  Priority
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                  Analyst
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {stats.recentIMS.map((ims) => (
                <tr key={ims.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-3 py-4 text-sm">
                    <Link
                      href={`/ims/${ims.id}`}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                    >
                      {ims.ccdId}
                    </Link>
                  </td>
                  <td className="px-3 py-4 text-sm text-slate-800 dark:text-slate-200">
                    {ims.reportName}
                  </td>
                  <td className="px-3 py-4 text-sm">
                    <span className={`badge badge-${ims.status.toLowerCase().replace('_', '-')}`}>
                      {ims.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm">
                    <span className={`badge badge-${ims.priority.toLowerCase()}`}>
                      {ims.priority}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {ims.analyst?.fullName || 'Unassigned'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analyst Workload */}
      <div className="card">
        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">
          Analyst Workload
        </h3>
        <div className="space-y-3">
          {stats.analystWorkload.map((analyst) => (
            <div key={analyst.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {analyst.fullName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{analyst.email}</p>
              </div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {analyst.activeIMS} IMS
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
