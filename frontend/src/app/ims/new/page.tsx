'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { IMSStatus, PriorityLevel, User, Tag } from '@/types';
import toast from 'react-hot-toast';

export default function CreateIMSPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [analysts, setAnalysts] = useState<User[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    ccdId: '',
    reportName: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    linkOpenCTI: '',
    linkDocIntel: '',
    comments: '',
    status: IMSStatus.DRAFT,
    priority: PriorityLevel.MEDIUM,
    analystId: '',
  });

  useEffect(() => {
    fetchAnalysts();
    fetchTags();
  }, []);

  const fetchAnalysts = async () => {
    try {
      const response = await api.get('/users/analysts');
      setAnalysts(response.data);
    } catch (error) {
      console.error('Failed to fetch analysts:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await api.get('/tags');
      setTags(response.data);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        ccdId: formData.ccdId || undefined,
        date: new Date(formData.date).toISOString(),
        analystId: formData.analystId || undefined,
        linkOpenCTI: formData.linkOpenCTI || undefined,
        linkDocIntel: formData.linkDocIntel || undefined,
        comments: formData.comments || undefined,
        tagIds: selectedTags.length > 0 ? selectedTags : undefined,
      };

      const response = await api.post('/ims', data);
      toast.success('IMS created successfully!');
      router.push(`/ims/${response.data.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create IMS');
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/ims"
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            ← Back to IMS List
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-2">
            Create New IMS
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Add a new Information Manipulation Set to the system
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
            Basic Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="label">
                CCD ID
              </label>
              <input
                type="text"
                value={formData.ccdId}
                onChange={(e) =>
                  setFormData({ ...formData, ccdId: e.target.value })
                }
                className="input"
                placeholder="Leave empty for auto-generation (e.g., CCD-1)"
              />
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Optional: Specify custom CCD-ID or leave empty to auto-generate
              </p>
            </div>

            <div>
              <label className="label">
                Report Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.reportName}
                onChange={(e) =>
                  setFormData({ ...formData, reportName: e.target.value })
                }
                className="input"
                placeholder="e.g., Russian Disinformation Campaign Q1 2025"
              />
            </div>

            <div>
              <label className="label">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={6}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="input"
                placeholder="Detailed description of the IMS..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="input"
                />
              </div>

              <div>
                <label className="label">Analyst</label>
                <select
                  value={formData.analystId}
                  onChange={(e) =>
                    setFormData({ ...formData, analystId: e.target.value })
                  }
                  className="input"
                >
                  <option value="">Unassigned</option>
                  {analysts.map((analyst) => (
                    <option key={analyst.id} value={analyst.id}>
                      {analyst.fullName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as IMSStatus,
                    })
                  }
                  className="input"
                >
                  {Object.values(IMSStatus).map((status) => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as PriorityLevel,
                    })
                  }
                  className="input"
                >
                  {Object.values(PriorityLevel).map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
            External Links
          </h2>

          <div className="space-y-4">
            <div>
              <label className="label">OpenCTI Link</label>
              <input
                type="url"
                value={formData.linkOpenCTI}
                onChange={(e) =>
                  setFormData({ ...formData, linkOpenCTI: e.target.value })
                }
                className="input"
                placeholder="https://opencti.example.com/report/123"
              />
            </div>

            <div>
              <label className="label">DocIntel Link</label>
              <input
                type="url"
                value={formData.linkDocIntel}
                onChange={(e) =>
                  setFormData({ ...formData, linkDocIntel: e.target.value })
                }
                className="input"
                placeholder="https://docintel.example.com/doc/456"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
            Tags
          </h2>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagToggle(tag.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  selectedTags.includes(tag.id)
                    ? 'ring-2 ring-primary-500 scale-105'
                    : 'hover:scale-105'
                }`}
                style={{
                  backgroundColor: tag.color || '#e5e7eb',
                  color: '#1f2937',
                }}
              >
                {tag.name}
                {selectedTags.includes(tag.id) && ' ✓'}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
            Additional Comments
          </h2>

          <textarea
            rows={4}
            value={formData.comments}
            onChange={(e) =>
              setFormData({ ...formData, comments: e.target.value })
            }
            className="input"
            placeholder="Any additional notes or comments..."
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex-1"
          >
            {loading ? 'Creating...' : 'Create IMS'}
          </button>
          <Link href="/ims" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
