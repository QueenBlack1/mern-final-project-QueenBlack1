/**
 * Standardized API response helper
 */
class ResponseHelper {
  /**
   * Success response
   */
  static success(data = null, message = '', meta = null) {
    const response = {
      success: true,
    };

    if (message) response.message = message;
    if (data !== null) response.data = data;
    if (meta) response.meta = meta;

    return response;
  }

  /**
   * Error response
   */
  static error(error, code = 'SERVER_ERROR', details = null) {
    const response = {
      success: false,
      error: error,
      code: code,
    };

    if (details) response.details = details;

    return response;
  }

  /**
   * Pagination meta data
   */
  static paginationMeta(page, limit, total, filters = {}) {
    return {
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
      filters,
    };
  }

  /**
   * List response with pagination
   */
  static list(data, paginationMeta, message = '') {
    return this.success(data, message, paginationMeta);
  }
}

module.exports = ResponseHelper;