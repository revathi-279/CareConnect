const advancedResults = (model, populate, baseMatch = {}) => async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude from the standard MongoDB filter matching
  const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string to handle MongoDB operators ($gt, $gte,$lt, $lte,$in)
  // E.g., ?price[lte]=50 becomes { "price": { "$lte": "50" } }
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Parse string back to JSON and merge with our baseMatch (e.g., { isActive: true })
  let parsedQuery = { ...JSON.parse(queryStr), ...baseMatch };

  // Text search functionality (simplistic regex search)
  if (req.query.search) {
    parsedQuery = {
      ...parsedQuery,
      $or: [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { bio: { $regex: req.query.search, $options: 'i' } }
      ]
    };
  }

  // Find resource
  query = model.find(parsedQuery);

  // Select Fields (e.g., ?select=name,description)
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort (e.g., ?sort=-price for descending, ?sort=price for ascending)
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt'); // Default sort: newest first
  }

  // Pagination (e.g., ?page=2&limit=5)
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const total = await model.countDocuments(parsedQuery);
  query = query.skip(startIndex).limit(limit);

  // Populate related fields
  if (populate) {
    query = query.populate(populate);
  }

  // Execute query
  const results = await query;

  // Pagination Result Object
  const pagination = {};
  if (endIndex < total) {
    pagination.next = { page: page + 1, limit };
  }
  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit };
  }

  // Attach the final results to the response object so the controller can use it
  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    total,
    data: results
  };

  next();
};

module.exports = advancedResults;