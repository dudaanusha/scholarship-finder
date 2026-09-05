import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Building2,
  Coins,
  Calendar,
  AlertTriangle,
  User,
  Filter,
} from 'lucide-react';
import {
  fetchScholarships,
  createScholarship,
  updateScholarship,
  deleteScholarship,
  fetchAdminApplications,
  updateAppStatus,
} from '../services/api';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';

const ScholarshipManagementPage = () => {
  const [activeTab, setActiveTab] = useState('scholarships'); // 'scholarships' | 'applications'
  const [scholarships, setScholarships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form Data
  const defaultForm = {
    scholarshipName: '',
    providerOrganization: '',
    description: '',
    eligibilityCriteria: '',
    minimumCGPA: 6.0,
    maximumFamilyIncome: 500000,
    applicableCategories: 'All',
    applicableStates: 'All India',
    eligibleCourses: 'All Courses',
    scholarshipAmount: 50000,
    amountType: 'Per Annum',
    deadline: '',
    applicationLink: '',
    scholarshipType: 'Government',
    requiredDocuments: 'Marksheets, Income Certificate, College Bonafide',
  };
  const [formData, setFormData] = useState(defaultForm);
  const [formSaving, setFormSaving] = useState(false);

  // Load Scholarships
  const loadScholarships = async () => {
    try {
      setLoading(true);
      const res = await fetchScholarships({ limit: 50 });
      if (res.data.success) {
        setScholarships(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching scholarships for admin:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load Applications
  const loadApplications = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminApplications();
      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'scholarships') {
      loadScholarships();
    } else {
      loadApplications();
    }
  }, [activeTab]);

  const handleOpenCreate = () => {
    setEditingScholarship(null);
    setFormData(defaultForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sch) => {
    setEditingScholarship(sch);
    setFormData({
      scholarshipName: sch.scholarshipName || '',
      providerOrganization: sch.providerOrganization || '',
      description: sch.description || '',
      eligibilityCriteria: sch.eligibilityCriteria || '',
      minimumCGPA: sch.minimumCGPA !== undefined ? sch.minimumCGPA : 6.0,
      maximumFamilyIncome: sch.maximumFamilyIncome !== undefined ? sch.maximumFamilyIncome : 500000,
      applicableCategories: sch.applicableCategories?.join(', ') || 'All',
      applicableStates: sch.applicableStates?.join(', ') || 'All India',
      eligibleCourses: sch.eligibleCourses?.join(', ') || 'All Courses',
      scholarshipAmount: sch.scholarshipAmount || 50000,
      amountType: sch.amountType || 'Per Annum',
      deadline: sch.deadline ? sch.deadline.split('T')[0] : '',
      applicationLink: sch.applicationLink || '',
      scholarshipType: sch.scholarshipType || 'Government',
      requiredDocuments: sch.requiredDocuments?.join(', ') || 'Marksheets, Income Certificate',
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSaving(true);

    try {
      const payload = {
        ...formData,
        minimumCGPA: Number(formData.minimumCGPA),
        maximumFamilyIncome: Number(formData.maximumFamilyIncome),
        scholarshipAmount: Number(formData.scholarshipAmount),
        applicableCategories: formData.applicableCategories.split(',').map((s) => s.trim()),
        applicableStates: formData.applicableStates.split(',').map((s) => s.trim()),
        eligibleCourses: formData.eligibleCourses.split(',').map((s) => s.trim()),
        requiredDocuments: formData.requiredDocuments.split(',').map((s) => s.trim()),
      };

      if (editingScholarship) {
        await updateScholarship(editingScholarship._id, payload);
      } else {
        await createScholarship(payload);
      }

      setIsModalOpen(false);
      loadScholarships();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving scholarship');
    } finally {
      setFormSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteScholarship(id);
      setDeleteConfirmId(null);
      loadScholarships();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting scholarship');
    }
  };

  const handleAdminUpdateStatus = async (appId, newStatus) => {
    try {
      await updateAppStatus(appId, { status: newStatus });
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const filteredScholarships = scholarships.filter((s) =>
    s.scholarshipName?.toLowerCase().includes(search.toLowerCase()) ||
    s.providerOrganization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center">
              <Layers className="w-6 h-6 mr-2 text-indigo-600" />
              Scholarship Operations & Control
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Create, update, or remove scholarship offerings and review student application queues.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-200 transition-all flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Scholarship</span>
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center space-x-2 mb-6 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('scholarships')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'scholarships'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Scholarships Catalog ({scholarships.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'applications'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Review Applicant Submissions ({applications.length})
          </button>
        </div>

        {activeTab === 'scholarships' ? (
          /* Scholarships CRUD Table */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter by scholarship title or provider..."
                  className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
                    <th className="p-4">Scholarship Name</th>
                    <th className="p-4">Provider</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Deadline</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredScholarships.map((sch) => (
                    <tr key={sch._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-900 max-w-xs truncate">
                        {sch.scholarshipName}
                      </td>
                      <td className="p-4 text-slate-600 max-w-xs truncate">{sch.providerOrganization}</td>
                      <td className="p-4 font-semibold text-indigo-600">
                        ₹{sch.scholarshipAmount?.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          {sch.scholarshipType}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">
                        {new Date(sch.deadline).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(sch)}
                          className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(sch._id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Applications Management Table */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
                    <th className="p-4">Applicant</th>
                    <th className="p-4">Scholarship</th>
                    <th className="p-4">Applied Date</th>
                    <th className="p-4">Current Status</th>
                    <th className="p-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{app.userId?.name || 'Applicant'}</div>
                        <div className="text-[11px] text-slate-400">{app.userId?.email}</div>
                      </td>
                      <td className="p-4 max-w-xs truncate font-medium text-slate-800">
                        {app.scholarshipId?.scholarshipName || 'Scholarship'}
                      </td>
                      <td className="p-4 text-slate-500">
                        {new Date(app.appliedDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                            app.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : app.status === 'Under Review'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : app.status === 'Rejected'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={app.status}
                          onChange={(e) => handleAdminUpdateStatus(app._id, e.target.value)}
                          className="px-2.5 py-1 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:outline-none"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingScholarship ? 'Edit Scholarship' : 'Add New Scholarship'}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleFormSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Scholarship Title</label>
                <input
                  type="text"
                  required
                  value={formData.scholarshipName}
                  onChange={(e) => setFormData({ ...formData, scholarshipName: e.target.value })}
                  placeholder="e.g. Tata Trusts Higher Education Grant"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Provider Organization</label>
                <input
                  type="text"
                  required
                  value={formData.providerOrganization}
                  onChange={(e) => setFormData({ ...formData, providerOrganization: e.target.value })}
                  placeholder="e.g. Tata Trusts"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Scholarship Type</label>
                <select
                  value={formData.scholarshipType}
                  onChange={(e) => setFormData({ ...formData, scholarshipType: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
                >
                  <option value="Government">Government</option>
                  <option value="Merit-based">Merit-based</option>
                  <option value="Need-based">Need-based</option>
                  <option value="Private">Private</option>
                  <option value="Minority">Minority</option>
                  <option value="Special Category">Special Category</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₹ INR)</label>
                <input
                  type="number"
                  required
                  value={formData.scholarshipAmount}
                  onChange={(e) => setFormData({ ...formData, scholarshipAmount: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Application Deadline</label>
                <input
                  type="date"
                  required
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Application Link</label>
                <input
                  type="url"
                  required
                  value={formData.applicationLink}
                  onChange={(e) => setFormData({ ...formData, applicationLink: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Minimum CGPA</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.minimumCGPA}
                  onChange={(e) => setFormData({ ...formData, minimumCGPA: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Max Annual Family Income (₹)</label>
                <input
                  type="number"
                  step="10000"
                  value={formData.maximumFamilyIncome}
                  onChange={(e) => setFormData({ ...formData, maximumFamilyIncome: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Applicable Categories (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.applicableCategories}
                  onChange={(e) => setFormData({ ...formData, applicableCategories: e.target.value })}
                  placeholder="All, General, OBC, SC, ST, EWS"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Eligible Courses (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.eligibleCourses}
                  onChange={(e) => setFormData({ ...formData, eligibleCourses: e.target.value })}
                  placeholder="All Courses, B.Tech, MBBS, B.Sc"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows="2"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
                ></textarea>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Eligibility Criteria Description</label>
                <textarea
                  rows="2"
                  required
                  value={formData.eligibilityCriteria}
                  onChange={(e) => setFormData({ ...formData, eligibilityCriteria: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formSaving}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
              >
                {formSaving ? 'Saving...' : 'Save Scholarship'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={!!deleteConfirmId}
          onClose={() => setDeleteConfirmId(null)}
          title="Confirm Scholarship Deletion"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Are you sure you want to remove this scholarship from the directory? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
              >
                Delete Scholarship
              </button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default ScholarshipManagementPage;
