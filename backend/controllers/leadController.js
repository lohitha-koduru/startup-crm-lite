import Lead from '../models/Lead.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

/**
 * Helper to log operations when running in development mode.
 * @param {string} message - Context information message.
 * @param {any} [data=''] - Optional associated data.
 */
const devLog = (message, data = '') => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Lead Controller] ${message}`, data);
  }
};

/**
 * @desc    Retrieve leads list with pagination, search, status, source, and date range filters
 * @route   GET /api/leads
 * @access  Private
 * @param {Object} req - Express request object.
 * @param {Object} req.query - Query params:
 *   - page {number} (default 1)
 *   - limit {number} (default 20)
 *   - sortBy {string} (default 'createdAt')
 *   - sortOrder {string} ('asc'|'desc', default 'desc')
 *   - status {string} ('All'|'New'|'Contacted'|etc.)
 *   - source {string} ('Website'|'Referral'|etc.)
 *   - search {string} (matches name, company, or email)
 *   - dateFrom {string} (ISO date string)
 *   - dateTo {string} (ISO date string)
 * @returns {Promise<Object>} Standard paginated response payload.
 */
export const getLeads = async (req, res, next) => {
  try {
    devLog('Executing getLeads with queries:', req.query);
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      source,
      search,
      dateFrom,
      dateTo,
    } = req.query;

    // 1. Base ownership filter
    const filter = { owner: req.user._id };

    // 2. Add status filter if provided and not equal to wildcard 'All'
    if (status && status !== 'All') {
      filter.status = status;
    }

    // 3. Add source filter if provided and not equal to wildcard 'All'
    if (source && source !== 'All') {
      filter.source = source;
    }

    // 4. Add search query match (case-insensitive regex on name, company, email)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // 5. Add date range filter on createdAt
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.createdAt.$lte = new Date(dateTo);
      }
    }

    const parsedPage = Math.max(1, parseInt(page, 10));
    const parsedLimit = Math.max(1, parseInt(limit, 10));
    const skip = (parsedPage - 1) * parsedLimit;

    // Sort order definition (-1 for desc, 1 for asc)
    const direction = sortOrder === 'desc' ? -1 : 1;
    const sortParams = { [sortBy]: direction };

    // 6. Fetch query list and total counts in parallel
    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort(sortParams)
        .skip(skip)
        .limit(parsedLimit),
      Lead.countDocuments(filter),
    ]);

    const pages = Math.ceil(total / parsedLimit);
    const hasNext = parsedPage < pages;
    const hasPrev = parsedPage > 1;

    devLog(`Parsed results page ${parsedPage}/${pages} - Total leads: ${total}`);

    // Return custom paginated response wrapped with additional flags
    return res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        pages,
        hasNext,
        hasPrev,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new lead under active user ownership
 * @route   POST /api/leads
 * @access  Private
 */
export const createLead = async (req, res, next) => {
  try {
    devLog('Executing createLead with body:', req.body);

    const newLead = await Lead.create({
      ...req.body,
      owner: req.user._id,
    });

    devLog('Lead registered:', newLead._id);
    return successResponse(res, newLead, 'Lead created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single lead by ID verifying user ownership
 * @route   GET /api/leads/:id
 * @access  Private
 */
export const getLeadById = async (req, res, next) => {
  try {
    devLog('Executing getLeadById for:', req.params.id);

    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, lead, 'Lead retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a lead's parameters, restricting owner modification
 * @route   PUT /api/leads/:id
 * @access  Private
 */
export const updateLead = async (req, res, next) => {
  try {
    devLog('Executing updateLead for:', req.params.id);

    const updateData = { ...req.body };
    delete updateData.owner;

    const updatedLead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    devLog('Lead updated:', updatedLead._id);
    return successResponse(res, updatedLead, 'Lead updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Fast path status patching of a lead, securing ownership validation
 * @route   PATCH /api/leads/:id/status
 * @access  Private
 */
export const updateLeadStatus = async (req, res, next) => {
  try {
    devLog('Executing updateLeadStatus for:', req.params.id);
    const { status } = req.body;

    const updatedLead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    devLog('Lead status updated:', updatedLead.status);
    return successResponse(res, updatedLead, 'Lead status updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Permanently delete a lead record verifying ownership constraints
 * @route   DELETE /api/leads/:id
 * @access  Private
 */
export const deleteLead = async (req, res, next) => {
  try {
    devLog('Executing deleteLead for:', req.params.id);

    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    await lead.deleteOne();
    devLog('Lead deleted successfully');

    return successResponse(res, null, 'Lead deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Quick autocomplete search returning minimal projections for efficiency
 * @route   GET /api/leads/search
 * @access  Private
 * @param {Object} req - Express request object.
 * @param {string} req.query.q - Auto-complete search text query.
 * @param {number} [req.query.limit=5] - Limit of autocomplete suggestions.
 * @returns {Promise<Object>} List of matched leads containing limited projection fields.
 */
export const searchLeads = async (req, res, next) => {
  try {
    const { q, limit = 5 } = req.query;
    devLog('Executing autocomplete searchLeads with query:', q);

    if (!q) {
      return successResponse(res, [], 'Search query is empty');
    }

    const searchRegex = new RegExp(q, 'i');
    const parsedLimit = Math.min(20, Math.max(1, parseInt(limit, 10)));

    const leads = await Lead.find({
      owner: req.user._id,
      $or: [
        { name: searchRegex },
        { company: searchRegex },
        { email: searchRegex },
      ],
    })
      .select('_id name company email status')
      .limit(parsedLimit);

    devLog(`Autocomplete returned ${leads.length} matches`);
    return successResponse(res, leads, 'Autocomplete matches retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get aggregate lead statistics inside a single MongoDB aggregation query
 * @route   GET /api/leads/stats
 * @access  Private
 *
 * Outputs: stats object detailing totals, statuses, sources, and growth metrics.
 */
export const getLeadStats = async (req, res, next) => {
  try {
    devLog('Executing getLeadStats aggregate facet for owner:', req.user._id);

    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonthIndex = now.getMonth() + 1; // MongoDB month operator yields 1-12

    const lastMonthDate = new Date();
    lastMonthDate.setMonth(now.getMonth() - 1);
    const lastMonthYear = lastMonthDate.getFullYear();
    const lastMonthIndex = lastMonthDate.getMonth() + 1;

    // Single facet query processing status breakdowns, source breakdowns, and monthly stats
    const statsResult = await Lead.aggregate([
      { $match: { owner: req.user._id } },
      {
        $facet: {
          totalStats: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                won: { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] } },
                lost: { $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] } },
              },
            },
          ],
          statusCounts: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
              },
            },
          ],
          sourceCounts: [
            {
              $group: {
                _id: '$source',
                count: { $sum: 1 },
              },
            },
          ],
          monthlyCounts: [
            {
              $project: {
                isThisMonth: {
                  $and: [
                    { $eq: [{ $year: '$createdAt' }, thisYear] },
                    { $eq: [{ $month: '$createdAt' }, thisMonthIndex] },
                  ],
                },
                isLastMonth: {
                  $and: [
                    { $eq: [{ $year: '$createdAt' }, lastMonthYear] },
                    { $eq: [{ $month: '$createdAt' }, lastMonthIndex] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                thisMonthCount: { $sum: { $cond: ['$isThisMonth', 1, 0] } },
                lastMonthCount: { $sum: { $cond: ['$isLastMonth', 1, 0] } },
              },
            },
          ],
        },
      },
    ]);

    const facet = statsResult[0] || {};

    // 1. Process Total count and conversion rate
    const totalData = facet.totalStats?.[0] || { total: 0, won: 0, lost: 0 };
    const totalLeads = totalData.total;
    const wonLeads = totalData.won;
    const lostLeads = totalData.lost;

    // Handle edge-case: Division by zero when user has no leads registered
    const conversionRate = totalLeads > 0
      ? parseFloat(((wonLeads / totalLeads) * 100).toFixed(1))
      : 0.0;

    // 2. Format status breakdown map
    const statusBreakdown = {
      New: 0,
      Contacted: 0,
      'Meeting Scheduled': 0,
      'Proposal Sent': 0,
      Won: 0,
      Lost: 0,
    };
    if (facet.statusCounts) {
      facet.statusCounts.forEach((item) => {
        if (item._id in statusBreakdown) {
          statusBreakdown[item._id] = item.count;
        }
      });
    }

    // 3. Format source breakdown map
    const sourceBreakdown = {
      Website: 0,
      Referral: 0,
      LinkedIn: 0,
      'Cold Call': 0,
      'Email Campaign': 0,
      Other: 0,
    };
    if (facet.sourceCounts) {
      facet.sourceCounts.forEach((item) => {
        if (item._id in sourceBreakdown) {
          sourceBreakdown[item._id] = item.count;
        }
      });
    }

    // 4. Calculate monthly totals and growth comparisons
    const monthlyData = facet.monthlyCounts?.[0] || { thisMonthCount: 0, lastMonthCount: 0 };
    const thisMonthLeads = monthlyData.thisMonthCount;
    const lastMonthLeads = monthlyData.lastMonthCount;

    // Handle edge case division by zero for growthRate calculations
    let growthRate = 0.0;
    if (lastMonthLeads > 0) {
      growthRate = parseFloat((((thisMonthLeads - lastMonthLeads) / lastMonthLeads) * 100).toFixed(1));
    } else if (thisMonthLeads > 0) {
      growthRate = 100.0; // 100% growth if starting from 0
    }

    const payload = {
      totalLeads,
      wonLeads,
      lostLeads,
      conversionRate,
      statusBreakdown,
      sourceBreakdown,
      thisMonthLeads,
      lastMonthLeads,
      growthRate,
    };

    devLog('Facet aggregation complete. Yielded statistics payload:', payload);
    return successResponse(res, payload, 'Lead statistics aggregated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Aggregate chronological monthly metrics over the trailing 6 months
 * @route   GET /api/leads/monthly-stats
 * @access  Private
 *
 * Outputs: Chronological monthly total, won, lost, and conversion rate array.
 */
export const getMonthlyStats = async (req, res, next) => {
  try {
    devLog('Retrieving getMonthlyStats for owner:', req.user._id);

    // 1. Establish the date bound for the trailing 6 months (inclusive of current month)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // 2. Perform aggregation grouping by Year and Month
    const dbStats = await Lead.aggregate([
      {
        $match: {
          owner: req.user._id,
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: 1 },
          won: { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] } },
          lost: { $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] } },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    // Short month lookup mapping table
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Map database results to a map for easy indexing
    const statsMap = new Map();
    dbStats.forEach((stat) => {
      const key = `${stat._id.year}-${stat._id.month - 1}`;
      statsMap.set(key, { total: stat.total, won: stat.won, lost: stat.lost });
    });

    // 3. Format result, filling in missing months with 0s
    const monthlyTrend = [];
    const tempDate = new Date(sixMonthsAgo);

    for (let i = 0; i < 6; i++) {
      const year = tempDate.getFullYear();
      const monthIdx = tempDate.getMonth();
      const key = `${year}-${monthIdx}`;

      const data = statsMap.get(key) || { total: 0, won: 0, lost: 0 };

      // Calculate conversion rate, rounding to 1 decimal place. Prevent division by zero.
      const conversionRate = data.total > 0
        ? parseFloat(((data.won / data.total) * 100).toFixed(1))
        : 0.0;

      monthlyTrend.push({
        month: `${months[monthIdx]} ${year}`,
        total: data.total,
        won: data.won,
        lost: data.lost,
        conversionRate,
      });

      // Move forward one month
      tempDate.setMonth(tempDate.getMonth() + 1);
    }

    devLog('Computed trailing 6 months trend:', monthlyTrend);
    return successResponse(res, monthlyTrend, 'Monthly statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};
