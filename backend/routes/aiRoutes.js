const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const Request = require('../models/ServiceRequest'); // Adjust path if needed
const ProviderProfile = require('../models/ProviderProfile'); // Adjust path to your provider profile model
const { protect } = require('../middleware/authMiddleware');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// @desc    Classify request and rank suitable providers (Capstone Requirement)
// @route   POST /api/ai/classify
// @access  Private
// @desc    Classify request and rank suitable providers
// @route   POST /api/ai/classify
// @access  Private
router.post('/classify', protect, async (req, res, next) => {
  try {
    console.log("📍 STEP 1: Hit classify route. Request ID:", req.body.requestId);
    const { requestId } = req.body;
    
    const request = await Request.findById(requestId);
    console.log("📍 STEP 2: Request found in DB?", request ? "YES" : "NO");

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    console.log("📍 STEP 3: Fetching providers from DB...");
    // Added optional chaining here in case your Provider schema differs slightly
    const providers = await ProviderProfile.find().populate('user', 'name email');
    console.log(`📍 STEP 4: Found ${providers.length} providers.`);

    const providerContext = providers.map(p => ({
      id: p.user?._id || p._id,
      name: p.user?.name || 'Unknown Provider',
      experience: p.experienceYears,
      bio: p.bio,
      areas: p.serviceAreas
    }));

    const prompt = `
      Analyze the following home service request: "${request.description}".
      Address: "${request.address}".
      
      Task 1: Classify this request into exactly ONE of these categories: Plumbing, Electrical, Cleaning, Appliance Repair, Maintenance.
      Task 2: Review the following list of available providers and RANK the top 3 best matches based on their bio, experience, and service areas.
      Providers: ${JSON.stringify(providerContext)}

      Respond strictly in this JSON format:
      {
        "category": "Selected Category",
        "rankedProviders": ["provider_id_1", "provider_id_2"],
        "reasoning": "Brief explanation"
      }
    `;

    console.log("📍 STEP 5: Sending prompt to Groq AI...");
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'openai/gpt-oss-20b', // <--- VALID GROQ MODEL
      temperature: 0.2,
      response_format: { type: "json_object" }
    });
    console.log("📍 STEP 6: Groq AI responded successfully.");

    const aiResponse = JSON.parse(completion.choices[0]?.message?.content);
    console.log("📍 STEP 7: Parsed JSON successfully. Category:", aiResponse.category);

    request.status = 'classified';
    request.aiInsights = {
      category: aiResponse.category,
      rankedProviders: aiResponse.rankedProviders,
      reasoning: aiResponse.reasoning
    };
    
    await request.save();
    console.log("📍 STEP 8: Saved to DB. DONE!");

    res.status(200).json({ 
      success: true, 
      data: request,
      aiAnalysis: aiResponse
    });
  } catch (error) {
    // THIS WILL FORCE THE ERROR INTO YOUR TERMINAL
    console.error("🔥 CRITICAL CLASSIFY ERROR:", error);
    res.status(500).json({ message: error.message || 'Server Error in AI Classification' });
  }
});

// @desc    Assistant Chatbot for platform queries
// @route   POST /api/ai/chat
// @access  Public
router.post('/chat', async (req, res, next) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400);
      return next(new Error('Messages array is required'));
    }

    const systemPrompt = {
      role: 'system',
      content: `You are ConnectBot, the AI support assistant for CareConnect—a home services platform in India.
- Services: Appliance Repair, Plumbing, Electrical, Cleaning.
- Currency: INR (₹).
- Flow: Request -> AI Classifies -> Providers Quote -> Customer Accepts -> Scheduled -> On The Way -> Arrived -> In Progress -> Completed.
Provide direct, warm, concise answers (under 3 sentences).`,
    };

   const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'openai/gpt-oss-20b', // <--- VALID GROQ MODEL
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    res.status(200).json({ success: true, reply: completion.choices[0]?.message?.content });
  } catch (error) {
    next(error);
  }
});

module.exports = router;