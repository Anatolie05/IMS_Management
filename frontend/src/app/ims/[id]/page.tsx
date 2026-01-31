'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { IMS } from '@/types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function IMSDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [ims, setIMS] = useState<IMS | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchIMS();
    }
  }, [params.id]);

  const fetchIMS = async () => {
    try {
      const response = await api.get(`/ims/${params.id}`);
      setIMS(response.data);
    } catch (error) {
      toast.error('Failed to fetch IMS details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this IMS?')) return;

    try {
      await api.delete(`/ims/${params.id}`);
      toast.success('IMS deleted successfully');
      router.push('/ims');
    } catch (error) {
      toast.error('Failed to delete IMS');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-600 dark:text-slate-400">Loading...</div>;
  }

  if (!ims) {
    return <div className="text-center py-12 text-slate-600 dark:text-slate-400">IMS not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/ims" className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              ← Back to IMS
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-2">{ims.ccdId}</h1>
          <p className="text-slate-500 dark:text-slate-400">{ims.reportName}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/ims/${ims.id}/edit`} className="btn btn-primary">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Details</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Description</dt>
                <dd className="mt-1 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                  {ims.description}
                </dd>
              </div>
              {ims.comments && (
                <div>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Comments</dt>
                  <dd className="mt-1 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                    {ims.comments}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Links */}
          {(ims.linkOpenCTI || ims.linkDocIntel) && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">External Links</h2>
              <div className="space-y-2">
                {ims.linkOpenCTI && (
                  <a
                    href={ims.linkOpenCTI}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    OpenCTI Report →
                  </a>
                )}
                {ims.linkDocIntel && (
                  <a
                    href={ims.linkDocIntel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    DocIntel Document →
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Metadata</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Status</dt>
                <dd className="mt-1">
                  <span
                    className={`badge badge-${ims.status.toLowerCase().replace('_', '-')}`}
                  >
                    {ims.status.replace('_', ' ')}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Priority</dt>
                <dd className="mt-1">
                  <span className={`badge badge-${ims.priority.toLowerCase()}`}>
                    {ims.priority}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Analyst</dt>
                <dd className="mt-1 text-sm text-slate-800 dark:text-slate-200">
                  {ims.analyst?.fullName || 'Unassigned'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Created By</dt>
                <dd className="mt-1 text-sm text-slate-800 dark:text-slate-200">
                  {ims.createdBy.fullName}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Date</dt>
                <dd className="mt-1 text-sm text-slate-800 dark:text-slate-200">
                  {format(new Date(ims.date), 'PPP')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Created At</dt>
                <dd className="mt-1 text-sm text-slate-800 dark:text-slate-200">
                  {format(new Date(ims.createdAt), 'PPP')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Last Updated</dt>
                <dd className="mt-1 text-sm text-slate-800 dark:text-slate-200">
                  {format(new Date(ims.updatedAt), 'PPP')}
                </dd>
              </div>
            </dl>
          </div>

          {ims.tags && ims.tags.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {ims.tags.map((item) => (
                  <span
                    key={item.tag.id}
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: item.tag.color || '#e5e7eb',
                      color: '#1f2937',
                    }}
                  >
                    {item.tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
