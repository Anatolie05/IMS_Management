'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { MergedIMS, IMS } from '@/types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface CreateMergeForm {
  mergeName: string;
  description: string;
  reason: string;
  imsIds: string[];
}

export default function MergePage() {
  const [merges, setMerges] = useState<MergedIMS[]>([]);
  const [imsList, setImsList] = useState<IMS[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CreateMergeForm>({
    mergeName: '',
    description: '',
    reason: '',
    imsIds: [],
  });

  useEffect(() => {
    fetchMerges();
    fetchImsList();
  }, []);

  const fetchMerges = async () => {
    try {
      const response = await api.get('/merge');
      setMerges(response.data);
    } catch (error) {
      toast.error('Failed to fetch merges');
    } finally {
      setLoading(false);
    }
  };

  const fetchImsList = async () => {
    try {
      const response = await api.get('/ims');
      // Filter out already merged IMS
      const availableIms = (response.data.items || response.data).filter(
        (ims: IMS) => ims.status !== 'MERGED'
      );
      setImsList(availableIms);
    } catch (error) {
      console.error('Failed to fetch IMS list');
    }
  };

  const handleUnmerge = async (id: string) => {
    if (!confirm('Are you sure you want to unmerge this?')) return;

    try {
      await api.post(`/merge/${id}/unmerge`);
      toast.success('Successfully unmerged');
      fetchMerges();
      fetchImsList();
    } catch (error) {
      toast.error('Failed to unmerge');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.imsIds.length < 2) {
      toast.error('Please select at least 2 IMS to merge');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/merge', form);
      toast.success('Merge created successfully');
      setShowModal(false);
      setForm({ mergeName: '', description: '', reason: '', imsIds: [] });
      fetchMerges();
      fetchImsList();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create merge');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleImsSelection = (id: string) => {
    setForm((prev) => ({
      ...prev,
      imsIds: prev.imsIds.includes(id)
        ? prev.imsIds.filter((imsId) => imsId !== id)
        : [...prev.imsIds, id],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Merged IMS</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            View and manage merged IMS records
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          Create Merge
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-slate-600 dark:text-slate-400">Loading...</div>
        ) : merges.length > 0 ? (
          merges.map((merge) => (
            <div key={merge.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    {merge.mergeName}
                  </h3>
                  {merge.description && (
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{merge.description}</p>
                  )}
                  {merge.reason && (
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      <span className="font-medium">Reason:</span> {merge.reason}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span>
                      Merged by {merge.createdBy.fullName} on{' '}
                      {format(new Date(merge.mergedAt), 'PPP')}
                    </span>
                    <span>
                      {merge.sourceIMS.length} IMS included
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {merge.sourceIMS.map((item) => (
                      <span
                        key={item.ims.id}
                        className="badge badge-in-progress"
                      >
                        {item.ims.ccdId}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleUnmerge(merge.id)}
                  className="btn btn-secondary ml-4"
                >
                  Unmerge
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-12 text-slate-500 dark:text-slate-400">
            No merged IMS found
          </div>
        )}
      </div>

      {/* Create Merge Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                Create New Merge
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Select at least 2 IMS to merge together
              </p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Merge Name *
                </label>
                <input
                  type="text"
                  value={form.mergeName}
                  onChange={(e) => setForm({ ...form, mergeName: e.target.value })}
                  className="input"
                  placeholder="e.g., Combined Disinformation Campaign Analysis"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input min-h-[80px]"
                  placeholder="Brief description of the merged IMS"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Merge
                </label>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="input min-h-[80px]"
                  placeholder="Why are these IMS being merged?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Select IMS to Merge * ({form.imsIds.length} selected)
                </label>
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl max-h-60 overflow-y-auto">
                  {imsList.length > 0 ? (
                    imsList.map((ims) => (
                      <label
                        key={ims.id}
                        className={`flex items-center p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 last:border-b-0 ${
                          form.imsIds.includes(ims.id) ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={form.imsIds.includes(ims.id)}
                          onChange={() => toggleImsSelection(ims.id)}
                          className="w-4 h-4 text-primary-600 rounded border-slate-300 dark:border-slate-600 focus:ring-primary-500"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {ims.ccdId}
                            </span>
                            <span className={`badge badge-${ims.status.toLowerCase().replace('_', '-')}`}>
                              {ims.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                            {ims.reportName}
                          </p>
                        </div>
                      </label>
                    ))
                  ) : (
                    <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                      No available IMS to merge
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setForm({ mergeName: '', description: '', reason: '', imsIds: [] });
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || form.imsIds.length < 2}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Creating...' : 'Create Merge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
