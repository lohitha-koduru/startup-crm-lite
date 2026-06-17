/**
 * @file LeadForm.jsx
 * @description Controlled form component for creating and editing leads.
 *
 * Works in two modes:
 *  - CREATE: no `initialData` prop → blank form, submit calls onSubmit with new lead data.
 *  - EDIT:   `initialData` prop provided → pre-filled fields, submit calls onSubmit with
 *             merged/updated lead data.
 *
 * Validation is client-side only (required fields: Name, Company, Email).
 */

import { useState } from 'react';
import { User, Building2, Mail, Phone, Tag, Globe, X, Save } from 'lucide-react';

/** All available status options for the pipeline stage dropdown. */
const STATUS_OPTIONS = [
  'New',
  'Contacted',
  'Meeting Scheduled',
  'Proposal Sent',
  'Won',
  'Lost',
];

/** All available lead source options. */
const SOURCE_OPTIONS = [
  'Website',
  'Referral',
  'LinkedIn',
  'Cold Call',
  'Email Campaign',
  'Other',
];

/**
 * @typedef {Object} LeadFormData
 * @property {string} name        - Lead contact full name (required).
 * @property {string} company     - Company/startup name (required).
 * @property {string} email       - Contact email address (required).
 * @property {string} phone       - Contact phone number (optional).
 * @property {string} status      - Pipeline stage (defaults to "New").
 * @property {string} source      - Lead acquisition channel (defaults to "Website").
 */

/**
 * @typedef {Object} LeadFormProps
 * @property {LeadFormData} [initialData]   - Pre-populated data when editing an existing lead.
 * @property {function(LeadFormData): void} onSubmit  - Called with validated form data on save.
 * @property {function(): void}             onCancel  - Called when the user dismisses the form.
 */

/**
 * LeadForm Component
 * Renders a labelled, validated form for creating or editing a CRM lead.
 *
 * @param {LeadFormProps} props
 * @returns {JSX.Element}
 */
const LeadForm = ({ initialData, onSubmit, onCancel }) => {
  const isEditMode = Boolean(initialData);

  // ─── Form state ──────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    name:    initialData?.name    ?? '',
    company: initialData?.company ?? '',
    email:   initialData?.email   ?? '',
    phone:   initialData?.phone   ?? '',
    status:  initialData?.status  ?? 'New',
    source:  initialData?.source  ?? 'Website',
  });

  /** Field-level validation error messages (keyed by field name). */
  const [errors, setErrors] = useState({});

  // ─── Handlers ────────────────────────────────────────────────────────────

  /**
   * Updates a single field in `formData` and clears its validation error.
   *
   * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement>} e
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Validates required fields and returns true if the form is valid.
   *
   * @returns {boolean}
   */
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim())    newErrors.name    = 'Contact name is required.';
    if (!formData.company.trim()) newErrors.company = 'Company name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission: validates then delegates to parent's `onSubmit`.
   *
   * @param {React.FormEvent<HTMLFormElement>} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  // ─── Field helper ─────────────────────────────────────────────────────────

  /**
   * Shared Tailwind classes for text inputs.
   *
   * @param {string} fieldName - Used to apply error ring when field has a validation error.
   * @returns {string}
   */
  const inputClass = (fieldName) =>
    `block w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border outline-none transition-all
     bg-slate-50/50 dark:bg-slate-900/40 dark:text-white
     ${errors[fieldName]
       ? 'border-danger ring-2 ring-danger/20 focus:border-danger focus:ring-danger/30'
       : 'border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20'}`;

  return (
    <form onSubmit={handleSubmit} noValidate aria-label={isEditMode ? 'Edit lead form' : 'Add lead form'}>
      <div className="space-y-5">

        {/* ── Name ── */}
        <div>
          <label htmlFor="lead-name" className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Full Name <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              id="lead-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sarah Connor"
              autoComplete="name"
              className={inputClass('name')}
            />
          </div>
          {errors.name && <p role="alert" className="mt-1.5 text-xs text-danger font-medium">{errors.name}</p>}
        </div>

        {/* ── Company ── */}
        <div>
          <label htmlFor="lead-company" className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Company <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              id="lead-company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Skynet Corp"
              className={inputClass('company')}
            />
          </div>
          {errors.company && <p role="alert" className="mt-1.5 text-xs text-danger font-medium">{errors.company}</p>}
        </div>

        {/* ── Email ── */}
        <div>
          <label htmlFor="lead-email" className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Email Address <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              id="lead-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. sarah@skynet.io"
              autoComplete="email"
              className={inputClass('email')}
            />
          </div>
          {errors.email && <p role="alert" className="mt-1.5 text-xs text-danger font-medium">{errors.email}</p>}
        </div>

        {/* ── Phone ── */}
        <div>
          <label htmlFor="lead-phone" className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Phone <span className="text-slate-400 font-normal normal-case">(optional)</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              id="lead-phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +1 (555) 000-0000"
              autoComplete="tel"
              className={inputClass('phone')}
            />
          </div>
        </div>

        {/* ── Status & Source (side-by-side on sm+) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Status */}
          <div>
            <label htmlFor="lead-status" className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
              Pipeline Status
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <select
                id="lead-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="block w-full pl-10 pr-8 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Source */}
          <div>
            <label htmlFor="lead-source" className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
              Lead Source
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <select
                id="lead-source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="block w-full pl-10 pr-8 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
              >
                {SOURCE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all active:scale-95"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-md shadow-primary/20 transition-all active:scale-95"
          >
            <Save className="h-4 w-4" />
            {isEditMode ? 'Save Changes' : 'Add Lead'}
          </button>
        </div>

      </div>
    </form>
  );
};

export default LeadForm;
