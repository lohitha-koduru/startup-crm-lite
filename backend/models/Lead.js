import mongoose from 'mongoose';

/**
 * Mongoose schema definition for the Lead model.
 */
const leadSchema = new mongoose.Schema(
  {
    /**
     * The full name of the lead contact person.
     * Must be between 2 and 100 characters long and will be trimmed.
     * @type {String}
     */
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Lead name must be at least 2 characters long'],
      maxlength: [100, 'Lead name cannot exceed 100 characters'],
    },
    /**
     * The name of the organization or startup the lead represents.
     * Required field and will be trimmed.
     * @type {String}
     */
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    /**
     * The primary email address of the lead.
     * Required, trimmed, and validated against standard email format.
     * @type {String}
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Email must be a valid email address',
      ],
    },
    /**
     * The phone number of the lead.
     * Optional field and will be trimmed.
     * @type {String}
     */
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    /**
     * Current status of the lead in the sales pipeline.
     * Restrained to specific values.
     * @type {String}
     */
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'],
        message: 'Status must be one of: New, Contacted, Meeting Scheduled, Proposal Sent, Won, Lost',
      },
      default: 'New',
    },
    /**
     * Source through which the lead was acquired.
     * Restrained to specific values.
     * @type {String}
     */
    source: {
      type: String,
      enum: {
        values: ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'],
        message: 'Source must be one of: Website, Referral, LinkedIn, Cold Call, Email Campaign, Other',
      },
      default: 'Website',
    },
    /**
     * Additional notes, background information, or context about the lead.
     * Optional field, capped at 1000 characters.
     * @type {String}
     */
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      trim: true,
      default: '',
    },
    /**
     * Reference to the User (owner/manager) who owns/created this lead.
     * Required field referencing the User model.
     * @type {mongoose.Schema.Types.ObjectId}
     */
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Lead must have an owner reference'],
    },
  },
  {
    timestamps: true,
    // Enable virtuals to be included when converting to JSON or Object
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ──────────────────────────────────────────────────────────────────

// Compound index for fast queries filtering by owner, status, and sorted by date
leadSchema.index({ owner: 1, status: 1, createdAt: -1 });

// Compound index for fast queries filtering by owner, source, and sorted by date
leadSchema.index({ owner: 1, source: 1, createdAt: -1 });

// Compound index for queries filtering by owner and sorted by date
leadSchema.index({ owner: 1, createdAt: -1 });

// Compound index on owner and email for scoped lookups
leadSchema.index({ owner: 1, email: 1 });

// ── Virtuals ─────────────────────────────────────────────────────────────────

/**
 * Virtual field to compute the age of the lead in days.
 * Calculates days elapsed since the lead's creation timestamp.
 * @name age
 * @type {Number}
 */
leadSchema.virtual('age').get(function () {
  if (!this.createdAt) {
    return 0;
  }
  const diffInMs = Date.now() - this.createdAt.getTime();
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor(diffInMs / msPerDay);
});

const Lead = mongoose.model('Lead', leadSchema);

export { leadSchema };
export default Lead;
