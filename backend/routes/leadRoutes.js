import { Router } from 'express';
import { body } from 'express-validator';
import * as leadController from '../controllers/leadController.js';
import protect from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

// Apply the authentication protection middleware to all lead endpoints
router.use(protect);

// ── VALIDATION RULES ──────────────────────────────────────────────────────────

/**
 * Validation rules for creating a new lead or updating an existing lead.
 */
const leadValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Lead name is required')
    .isLength({ min: 2 })
    .withMessage('Lead name must be at least 2 characters long'),
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address'),
  body('phone')
    .optional()
    .trim(),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'])
    .withMessage('Status must be one of: New, Contacted, Meeting Scheduled, Proposal Sent, Won, Lost'),
  body('source')
    .optional()
    .isIn(['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'])
    .withMessage('Source must be one of: Website, Referral, LinkedIn, Cold Call, Email Campaign, Other'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
];

/**
 * Validation rule specifically for updating only the lead status.
 */
const statusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status value is required')
    .isIn(['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'])
    .withMessage('Status must be one of: New, Contacted, Meeting Scheduled, Proposal Sent, Won, Lost'),
];

// ── ROUTE ENDPOINTS ───────────────────────────────────────────────────────────

// 1. GET /api/leads/stats — Retrieve aggregated dashboard key metrics (MUST run before /:id)
router.get('/stats', leadController.getLeadStats);

// 2. GET /api/leads/monthly-stats — Retrieve chronological 6-month trends (MUST run before /:id)
router.get('/monthly-stats', leadController.getMonthlyStats);

// 3. GET /api/leads/search — Autocomplete quick search (MUST run before /:id)
router.get('/search', leadController.searchLeads);

// 4. GET /api/leads — Retrieve filtered and paginated sales leads list
router.get('/', leadController.getLeads);

// 4. POST /api/leads — Create a new sales lead
router.post('/', validate(leadValidation), leadController.createLead);

// 5. GET /api/leads/:id — Retrieve detailed lead information by database identifier
router.get('/:id', leadController.getLeadById);

// 6. PUT /api/leads/:id — Update all fields of an existing lead
router.put('/:id', validate(leadValidation), leadController.updateLead);

// 7. PATCH /api/leads/:id/status — Fast path update for only the lead status field
router.patch('/:id/status', validate(statusValidation), leadController.updateLeadStatus);

// 8. DELETE /api/leads/:id — Permanently delete a lead record
router.delete('/:id', leadController.deleteLead);

export default router;
