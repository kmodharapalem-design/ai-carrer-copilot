/**
 * AI Career Copilot — Serverless Vercel Function
 * Secure backend endpoint to communicate with Google Gemini API.
 * Keeps GEMINI_API_KEY secure in server environment variables.
 */

const SYSTEM_PROMPT = `You are a Senior Technical Recruiter, ATS (Applicant Tracking System) Specialist, and University Career Coach with over 12 years of experience reviewing resumes for tech internships, junior engineering roles, and professional career transitions.

ROLE & OBJECTIVE:
Analyze the candidate's resume strictly and honestly against the provided job description. Produce an objective, supportive, and highly actionable diagnostic report formatted as a single JSON object.

CRITICAL INSTRUCTIONS & INTEGRITY RULES:
1. DO NOT INVENT or hallucinate skills, qualifications, work history, or coursework that the candidate did not mention.
2. DO NOT make false promises or fabricate keyword matches.
3. Be HONEST, REALISTIC, and ENCOURAGING. Frame feedback constructively, especially for students and early-career applicants.
4. Calculate a realistic ATS Match Score (0 to 100):
   - 85-100: Exceptional alignment across core skills, experience, and domain.
   - 70-84: Strong foundational match with minor keyword or project scope gaps.
   - 50-69: Moderate match; possesses transferrable basics but lacks key tech stack items.
   - Below 50: Significant misalignment; needs major tailoring or prerequisite skills.
5. Identify MISSING KEYWORDS and EXPLAIN WHY each matters from the recruiter's and ATS perspective.
6. Provide PRACTICAL SUGGESTIONS tailored for students and freshers (e.g., highlighting academic capstones, framing existing coursework, building targeted open-source/demo projects).

OUTPUT SPECIFICATION:
You MUST respond with ONLY a valid, parseable JSON object matching this exact structure:
{
  "ats_score": <number between 0 and 100>,
  "match_tier": "<Exceptional Match | Strong Match | Moderate Match | Needs Optimization>",
  "summary": "<3-4 sentence holistic executive summary assessing fit, strengths, and primary opportunity for improvement>",
  "matching_skills": [
    "<skill or technology found in BOTH resume and job description>"
  ],
  "missing_keywords": [
    {
      "keyword": "<critical technology or skill requested in job description but absent in resume>",
      "importance": "<High | Medium | Recommended>",
      "reason": "<1-2 sentence explanation of why recruiters and ATS filters prioritize this keyword for this specific role>"
    }
  ],
  "relevant_experience_assessment": "<2-3 sentence honest evaluation of candidate's relevant project work, internships, or academic experience relative to the job duties>",
  "strengths": [
    "<specific strength 1 with evidence from resume>",
    "<specific strength 2 with evidence from resume>",
    "<specific strength 3 with evidence from resume>"
  ],
  "areas_for_improvement": [
    "<constructive critique 1 regarding missing metrics, clarity, or depth>",
    "<constructive critique 2 regarding resume formatting or phrasing>",
    "<constructive critique 3 regarding skill demonstration>"
  ],
  "actionable_suggestions": [
    "<concrete recommendation 1 for students/early career>",
    "<concrete recommendation 2 for students/early career>",
    "<concrete recommendation 3 for students/early career>",
    "<concrete recommendation 4 for students/early career>"
  ]
}`;

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only POST requests are supported.'
    });
  }

  // 1. Check API Key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_API_KEY_HERE') {
    return res.status(500).json({
      error: 'API Key Configuration Missing',
      message: 'The GEMINI_API_KEY environment variable is not configured on the server. Please set GEMINI_API_KEY in your Vercel Project Settings (Environment Variables) or local .env file.'
    });
  }

  // 2. Parse and Validate Request Body
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({
        error: 'Invalid JSON',
        message: 'Malformed request payload. JSON format required.'
      });
    }
  }

  const resume = (body?.resume || '').trim();
  const jobDescription = (body?.jobDescription || '').trim();

  // Validate Situations:
  // Situation 1: Both empty
  if (!resume && !jobDescription) {
    return res.status(400).json({
      error: 'Missing Input',
      message: 'Both the resume and job description fields are empty. Please provide both to run the analysis.'
    });
  }

  // Situation 2: Resume entered, job description empty
  if (resume && !jobDescription) {
    return res.status(400).json({
      error: 'Missing Job Description',
      message: 'Job description is empty. Please paste the job description to evaluate your resume match.'
    });
  }

  // Situation 3: Job description entered, resume empty
  if (!resume && jobDescription) {
    return res.status(400).json({
      error: 'Missing Resume',
      message: 'Resume text is empty. Please paste your resume content to proceed.'
    });
  }

  // Situation 5: Resume or Job description too short (< 50 characters)
  if (resume.length < 50) {
    return res.status(400).json({
      error: 'Resume Too Short',
      message: `Your resume content is too short (${resume.length} characters). Please provide a comprehensive resume (at least 50 characters) with your skills, projects, and education for meaningful analysis.`
    });
  }

  if (jobDescription.length < 50) {
    return res.status(400).json({
      error: 'Job Description Too Short',
      message: `The job description is too short (${jobDescription.length} characters). Please provide a detailed job description (at least 50 characters) including required skills and responsibilities.`
    });
  }

  // 3. Prepare Gemini API Request
  const userPrompt = `CANDIDATE RESUME:\n${resume}\n\nTARGET JOB DESCRIPTION:\n${jobDescription}\n\nPlease analyze this resume against the job description strictly according to your system instructions and return the JSON analysis.`;

  // Model list to attempt in order of preference
  const models = ['gemini-3.8-flash'];
  let lastError = null;

  for (const model of models) {
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${SYSTEM_PROMPT}\n\n${userPrompt}` }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 3500,
            responseMimeType: 'application/json'
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data?.error?.message || `Google Gemini API returned status ${response.status}`;
        lastError = new Error(errorMsg);
        // If error is model not found (404), continue to next model in loop
        if (response.status === 404) {
          continue;
        }
        // If auth or rate limit error, throw directly
        throw lastError;
      }

      const rawAiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawAiText) {
        throw new Error('Gemini API returned an empty response. Please try again.');
      }

      // 4. Parse JSON
      let parsed;
      try {
        parsed = JSON.parse(rawAiText);
      } catch {
        // Fallback: extract JSON substring if wrapped in markdown formatting
        const match = rawAiText.match(/\{[\s\S]*\}/);
        if (match) {
          parsed = JSON.parse(match[0]);
        } else {
          throw new Error('AI response could not be parsed as valid JSON.');
        }
      }

      // Normalize and sanitize fields
      const sanitizedResponse = {
        ats_score: typeof parsed.ats_score === 'number' ? Math.max(0, Math.min(100, Math.round(parsed.ats_score))) : 65,
        match_tier: parsed.match_tier || (parsed.ats_score >= 85 ? 'Exceptional Match' : parsed.ats_score >= 70 ? 'Strong Match' : parsed.ats_score >= 50 ? 'Moderate Match' : 'Needs Optimization'),
        summary: parsed.summary || 'Analysis completed successfully.',
        matching_skills: Array.isArray(parsed.matching_skills) ? parsed.matching_skills : [],
        missing_keywords: Array.isArray(parsed.missing_keywords) ? parsed.missing_keywords.map(k => {
          if (typeof k === 'string') return { keyword: k, importance: 'High', reason: 'Critical keyword identified in the job requirements.' };
          return {
            keyword: k.keyword || 'Required Skill',
            importance: k.importance || 'High',
            reason: k.reason || 'Appears prominently in the job posting.'
          };
        }) : [],
        relevant_experience_assessment: parsed.relevant_experience_assessment || 'Experience aligns with fundamental job requirements.',
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        areas_for_improvement: Array.isArray(parsed.areas_for_improvement) ? parsed.areas_for_improvement : [],
        actionable_suggestions: Array.isArray(parsed.actionable_suggestions) ? parsed.actionable_suggestions : []
      };

      return res.status(200).json(sanitizedResponse);

    } catch (err) {
      lastError = err;
      // If authentication or quota error, do not retry further models
      if (err.message && (err.message.includes('API key') || err.message.includes('quota') || err.message.includes('403') || err.message.includes('429'))) {
        break;
      }
    }
  }

  // If all attempts failed
  const errorMessage = lastError?.message || 'Failed to complete resume analysis with Gemini API.';
  let userFriendlyMessage = errorMessage;

  if (errorMessage.toLowerCase().includes('api key not valid') || errorMessage.toLowerCase().includes('api_key_invalid')) {
    userFriendlyMessage = 'Your Gemini API Key is invalid or expired. Please check the GEMINI_API_KEY set in Vercel or your .env file.';
  } else if (errorMessage.toLowerCase().includes('quota') || errorMessage.toLowerCase().includes('resource has been exhausted')) {
    userFriendlyMessage = 'Gemini API free tier rate limit reached. Please wait 60 seconds and submit again, or check your Google AI Studio quota.';
  } else if (errorMessage.toLowerCase().includes('fetch failed') || errorMessage.toLowerCase().includes('enotfound') || errorMessage.toLowerCase().includes('econnrefused')) {
    userFriendlyMessage = 'Network connection to Google Gemini API failed. Please ensure your server has internet access to generativelanguage.googleapis.com.';
  }

  return res.status(502).json({
    error: 'Gemini API Error',
    message: userFriendlyMessage,
    technicalDetails: process.env.NODE_ENV === 'development' ? errorMessage : undefined
  });
}
