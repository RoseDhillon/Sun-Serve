// Advanced pagination middleware with sorting and filtering
const paginate = (model) => async (req, res, next) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const startIndex = (page - 1) * limit

    // Ensure reasonable limits
    const maxLimit = 100
    const effectiveLimit = Math.min(limit, maxLimit)

    // Sorting
    const sortBy = req.query.sortBy || "createdAt"
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1
    const sort = { [sortBy]: sortOrder }

    // Filtering (passed from controller)
    const filter = req.paginationFilter || {}

    // Field selection
    const select = req.query.select ? req.query.select.split(",").join(" ") : ""

    // Population (if needed)
    const populate = req.paginationPopulate || ""

    // Execute query
    let query = model.find(filter)

    if (select) {
      query = query.select(select)
    }

    if (populate) {
      query = query.populate(populate)
    }

    const results = await query
      .sort(sort)
      .limit(effectiveLimit)
      .skip(startIndex)
      .exec()

    // Get total count
    const total = await model.countDocuments(filter)

    // Pagination metadata
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / effectiveLimit),
      totalItems: total,
      itemsPerPage: effectiveLimit,
      hasNextPage: startIndex + effectiveLimit < total,
      hasPrevPage: page > 1,
    }

    // Add next and previous page numbers
    if (pagination.hasNextPage) {
      pagination.nextPage = page + 1
    }
    if (pagination.hasPrevPage) {
      pagination.prevPage = page - 1
    }

    // Attach results to response
    res.paginatedResults = {
      success: true,
      pagination,
      data: results,
    }

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = paginate
