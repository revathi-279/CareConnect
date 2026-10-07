const Service = require('../models/Service');

/**
 * Simulates AI classification by matching description keywords against our database.
 * @param {string} text - The customer's raw request description
 * @returns {object} - { categoryId, serviceId, confidence }
 */
const classifyRequestText = async (text) => {
  const lowerText = text.toLowerCase();
  
  // Fetch all active services and populate their categories
  const allServices = await Service.find({ isActive: true }).populate('category');
  
  let bestMatch = null;
  let highestScore = 0;

  for (const service of allServices) {
    let currentScore = 0;
    
    // Convert service name to lowercase words (e.g. "washing machine repair" -> ["washing", "machine", "repair"])
    const serviceWords = service.name.toLowerCase().split(' ');
    
    // Give points if words from the service name appear in the customer's text
    serviceWords.forEach(word => {
      if (lowerText.includes(word) && word.length > 2) {
        currentScore += 30; // Arbitrary weight for scoring
      }
    });

    if (currentScore > highestScore) {
      highestScore = currentScore;
      bestMatch = service;
    }
  }

  // If we found a reasonable match
  if (bestMatch && highestScore > 0) {
    // Cap confidence at 95%
    const confidence = Math.min(highestScore + 40, 95); 
    return {
      categoryId: bestMatch.category._id,
      serviceId: bestMatch._id,
      confidence: confidence
    };
  }

  // Fallback if AI/Logic cannot determine the service
  return {
    categoryId: null,
    serviceId: null,
    confidence: 0
  };
};

module.exports = { classifyRequestText };