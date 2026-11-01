/**
 * AI Career Copilot — Frontend Application Logic
 * Modern, accessible, secure UI controller.
 * Communicates with serverless endpoint: /api/analyze
 */

import { SAMPLES } from './samples.js';

// DOM Element References
const resumeInput = document.getElementById('resumeInput');
const jobDescInput = document.getElementById('jobDescInput');
const resumeCounter = document.getElementById('resumeCounter');
const jobDescCounter = document.getElementById('jobDescCounter');

const analyzeBtn = document.getElementById('analyzeBtn');
const alertBox = document.getElementById('alertBox');
const alertIcon = document.getElementById('alertIcon');
const alertTitle = document.getElementById('alertTitle');
const alertMessage = document.getElementById('alertMessage');

const loadingWrapper = document.getElementById('loadingWrapper');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');

const resultsSection = document.getElementById('resultsSection');
const gaugeCircle = document.getElementById('gaugeCircle');
const scoreDisplay = document.getElementById('scoreDisplay');
const matchTierBadge = document.getElementById('matchTierBadge');
const scorecardSummary = document.getElementById('scorecardSummary');
const experienceAssessmentText = document.getElementById('experienceAssessmentText');

const matchedCount = document.getElementById('matchedCount');
const matchedChips = document.getElementById('matchedChips');
const missingCount = document.getElementById('missingCount');
const missingKeywordsList = document.getElementById('missingKeywordsList');

const strengthsList = document.getElementById('strengthsList');
const improvementsList = document.getElementById('improvementsList');
const suggestionsList = document.getElementById('suggestionsList');

const copyReportBtn = document.getElementById('copyReportBtn');
const printReportBtn = document.getElementById('printReportBtn');
const newAnalysisBtn = document.getElementById('newAnalysisBtn');
const toastNotice = document.getElementById('toastNotice');
const toastText = document.getElementById('toastText');

// Sample Buttons
const loadSampleInternship = document.getElementById('loadSampleInternship');
const loadSampleJunior = document.getElementById('loadSampleJunior');
const clearInputs = document.getElementById('clearInputs');

// Paste & Clear Helpers
const pasteResumeBtn = document.getElementById('pasteResumeBtn');
const clearResumeBtn = document.getElementById('clearResumeBtn');
const pasteJobBtn = document.getElementById('pasteJobBtn');
const clearJobBtn = document.getElementById('clearJobBtn');

// SVG Gauge Circumference: 2 * Math.PI * 68 ≈ 427.26
const GAUGE_CIRCUMFERENCE = 427.26;

// Cache latest analysis for copying
let currentAnalysis = null;
let stepInterval = null;

/* ═══════════════════════════════════════════════════════════════════
   UTILITY & HELPER FUNCTIONS
   ═══════════════════════════════════════════════════════════════════ */

function countWords(str) {
  const trimmed = str.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function updateCounters() {
  const resumeText = resumeInput.value;
  const jobText = jobDescInput.value;

  const resumeWords = countWords(resumeText);
  const resumeChars = resumeText.length;
  resumeCounter.textContent = `${resumeWords} words | ${resumeChars} chars`;

  const jobWords = countWords(jobText);
  const jobChars = jobText.length;
  jobDescCounter.textContent = `${jobWords} words | ${jobChars} chars`;
}

function showAlert(title, message, icon = '⚠️', type = 'warning') {
  alertTitle.textContent = title;
  alertMessage.textContent = message;
  alertIcon.textContent = icon;
  alertBox.className = `alert-box show ${type === 'error' ? 'alert-error' : 'alert-warning'}`;
  alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideAlert() {
  alertBox.className = 'alert-box';
}

function showToast(message) {
  toastText.textContent = message;
  toastNotice.classList.add('show');
  setTimeout(() => {
    toastNotice.classList.remove('show');
  }, 3000);
}

/* ═══════════════════════════════════════════════════════════════════
   SAMPLE LOADER & CLIPBOARD HANDLERS
   ═══════════════════════════════════════════════════════════════════ */

loadSampleInternship.addEventListener('click', () => {
  resumeInput.value = SAMPLES.internship.resume;
  jobDescInput.value = SAMPLES.internship.jobDescription;
  updateCounters();
  hideAlert();
  showToast('Loaded: Tech Internship Sample');
});

loadSampleJunior.addEventListener('click', () => {
  resumeInput.value = SAMPLES.backendJunior.resume;
  jobDescInput.value = SAMPLES.backendJunior.jobDescription;
  updateCounters();
  hideAlert();
  showToast('Loaded: Junior Backend Sample');
});

clearInputs.addEventListener('click', () => {
  resumeInput.value = '';
  jobDescInput.value = '';
  updateCounters();
  hideAlert();
  resultsSection.classList.remove('active');
  showToast('Inputs cleared');
});

clearResumeBtn.addEventListener('click', () => {
  resumeInput.value = '';
  updateCounters();
  resumeInput.focus();
});

clearJobBtn.addEventListener('click', () => {
  jobDescInput.value = '';
  updateCounters();
  jobDescInput.focus();
});

pasteResumeBtn.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      resumeInput.value = text;
      updateCounters();
      showToast('Resume pasted from clipboard');
    }
  } catch {
    showAlert('Clipboard Permission Denied', 'Please use Ctrl+V to paste your resume into the textarea.', 'ℹ️');
  }
});

pasteJobBtn.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      jobDescInput.value = text;
      updateCounters();
      showToast('Job description pasted');
    }
  } catch {
    showAlert('Clipboard Permission Denied', 'Please use Ctrl+V to paste the job description into the textarea.', 'ℹ️');
  }
});

// Real-time counter listeners
resumeInput.addEventListener('input', updateCounters);
jobDescInput.addEventListener('input', updateCounters);

// Keyboard shortcut: Ctrl + Enter / Cmd + Enter
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    analyzeResume();
  }
});

/* ═══════════════════════════════════════════════════════════════════
   CORE ANALYSIS WORKFLOW & VALIDATION
   ═══════════════════════════════════════════════════════════════════ */

async function analyzeResume() {
  const resume = resumeInput.value.trim();
  const jobDescription = jobDescInput.value.trim();

  hideAlert();

  // Situation 1: Resume and job description are both empty
  if (!resume && !jobDescription) {
    showAlert(
      'Both Fields Empty',
      'Please paste your resume and the target job description to run the AI Career Copilot evaluation.',
      '⚠️',
      'warning'
    );
    resumeInput.focus();
    return;
  }

  // Situation 2: Resume entered, but job description empty
  if (resume && !jobDescription) {
    showAlert(
      'Target Job Description Missing',
      'Please provide the job description so we can compare your qualifications, match scores, and keywords against it.',
      '💼',
      'warning'
    );
    jobDescInput.focus();
    return;
  }

  // Situation 3: Job description entered, but resume empty
  if (!resume && jobDescription) {
    showAlert(
      'Resume Content Missing',
      'Please paste your resume text to analyze it against the target job posting.',
      '📄',
      'warning'
    );
    resumeInput.focus();
    return;
  }

  // Situation 5: Resume or Job description too short (< 50 characters)
  if (resume.length < 50) {
    showAlert(
      'Resume Content Too Short',
      `Your resume is only ${resume.length} characters long. Please provide your full resume (including skills, education, and projects) for an accurate ATS review (minimum 50 characters required).`,
      '⚠️',
      'warning'
    );
    resumeInput.focus();
    return;
  }

  if (jobDescription.length < 50) {
    showAlert(
      'Job Description Too Short',
      `The job description is only ${jobDescription.length} characters long. Please include the key requirements, duties, and qualifications (minimum 50 characters required).`,
      '⚠️',
      'warning'
    );
    jobDescInput.focus();
    return;
  }

  // Situation 6: Valid Inputs -> Start Analysis
  startLoading();

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        resume,
        jobDescription
      })
    });

    const data = await response.json();

    // Situation 4: API or Server Error
    if (!response.ok) {
      const errorTitle = data.error || `HTTP ${response.status} Error`;
      const errorMessage = data.message || 'The server encountered an error while analyzing your resume.';
      throw new Error(`${errorTitle}: ${errorMessage}`);
    }

    // Success: Render results
    currentAnalysis = data;
    renderResults(data);

  } catch (err) {
    console.error('Resume Analysis Error:', err);
    showAlert(
      'Analysis Failed',
      err.message || 'Unable to connect to the analysis engine. If running locally, make sure you ran `npm start` and set GEMINI_API_KEY in `.env`. If on Vercel, ensure GEMINI_API_KEY is configured in Environment Variables.',
      '❌',
      'error'
    );
  } finally {
    stopLoading();
  }
}

/* ═══════════════════════════════════════════════════════════════════
   LOADING ANIMATION CONTROLLER
   ═══════════════════════════════════════════════════════════════════ */

function startLoading() {
  analyzeBtn.disabled = true;
  analyzeBtn.querySelector('.btn-text').textContent = 'Analyzing Profile...';
  analyzeBtn.querySelector('.btn-icon').textContent = '⏳';
  
  resultsSection.classList.remove('active');
  loadingWrapper.classList.add('active');

  // Reset steps
  step1.className = 'step-item active';
  step2.className = 'step-item';
  step3.className = 'step-item';

  let currentStep = 1;
  stepInterval = setInterval(() => {
    currentStep++;
    if (currentStep === 2) {
      step1.className = 'step-item';
      step2.className = 'step-item active';
    } else if (currentStep === 3) {
      step2.className = 'step-item';
      step3.className = 'step-item active';
    }
  }, 1800);
}

function stopLoading() {
  if (stepInterval) {
    clearInterval(stepInterval);
    stepInterval = null;
  }
  loadingWrapper.classList.remove('active');
  analyzeBtn.disabled = false;
  analyzeBtn.querySelector('.btn-text').textContent = 'Analyze Resume Match';
  analyzeBtn.querySelector('.btn-icon').textContent = '🚀';
}

/* ═══════════════════════════════════════════════════════════════════
   RESULTS RENDERING
   ═══════════════════════════════════════════════════════════════════ */

function renderResults(analysis) {
  const score = Math.max(0, Math.min(100, Math.round(analysis.ats_score || 0)));

  // 1. Animate circular gauge
  const offset = GAUGE_CIRCUMFERENCE - (score / 100) * GAUGE_CIRCUMFERENCE;
  gaugeCircle.style.strokeDashoffset = offset;

  // Color coordinate gauge stroke & match badge
  let tierText = analysis.match_tier || 'Match Assessment';
  let badgeClass = 'badge-strong';
  let strokeColor = '#3b82f6'; // default blue

  if (score >= 85) {
    badgeClass = 'badge-exceptional';
    strokeColor = '#10b981'; // emerald
    if (!analysis.match_tier) tierText = 'Exceptional Match';
  } else if (score >= 70) {
    badgeClass = 'badge-strong';
    strokeColor = '#3b82f6'; // blue
    if (!analysis.match_tier) tierText = 'Strong Match';
  } else if (score >= 50) {
    badgeClass = 'badge-moderate';
    strokeColor = '#f59e0b'; // amber
    if (!analysis.match_tier) tierText = 'Moderate Match';
  } else {
    badgeClass = 'badge-needs-opt';
    strokeColor = '#f43f5e'; // rose
    if (!analysis.match_tier) tierText = 'Needs Optimization';
  }

  gaugeCircle.style.stroke = strokeColor;
  matchTierBadge.className = `score-badge ${badgeClass}`;
  matchTierBadge.textContent = tierText;

  // Animate numeric score counter
  animateScoreCounter(score);

  // Summary & Experience Assessment
  scorecardSummary.textContent = analysis.summary || 'Summary unavailable.';
  experienceAssessmentText.textContent = analysis.relevant_experience_assessment || 'Experience assessment provided.';

  // 2. Render Matched Skills
  const matched = Array.isArray(analysis.matching_skills) ? analysis.matching_skills : [];
  matchedCount.textContent = `${matched.length} Matched`;
  matchedChips.innerHTML = '';

  if (matched.length === 0) {
    matchedChips.innerHTML = '<span style="font-size: 0.85rem; color: var(--primary-500); font-style: italic;">No direct skill matches detected. Focus on adding foundational keywords listed on the right.</span>';
  } else {
    matched.forEach(skill => {
      const chip = document.createElement('div');
      chip.className = 'skill-chip skill-chip-matched';
      chip.innerHTML = `<span class="icon">✓</span> <span>${escapeHTML(skill)}</span>`;
      matchedChips.appendChild(chip);
    });
  }

  // 3. Render Missing Technical Keywords with Reasons
  const missing = Array.isArray(analysis.missing_keywords) ? analysis.missing_keywords : [];
  missingCount.textContent = `${missing.length} Missing`;
  missingKeywordsList.innerHTML = '';

  if (missing.length === 0) {
    missingKeywordsList.innerHTML = '<p style="font-size: 0.85rem; color: var(--emerald-600); font-weight: 600;">Outstanding! No critical technical keyword gaps identified.</p>';
  } else {
    missing.forEach(item => {
      const kw = typeof item === 'string' ? { keyword: item, importance: 'High', reason: 'Explicit requirement in job description.' } : item;
      const card = document.createElement('div');
      card.className = 'keyword-item';
      card.innerHTML = `
        <div class="keyword-item-header">
          <span class="keyword-item-name">⚠️ ${escapeHTML(kw.keyword)}</span>
          <span class="importance-pill importance-${escapeHTML(kw.importance || 'High')}">${escapeHTML(kw.importance || 'High')}</span>
        </div>
        <p class="keyword-item-reason">${escapeHTML(kw.reason || 'Requested skill in the job description.')}</p>
      `;
      missingKeywordsList.appendChild(card);
    });
  }

  // 4. Render Strengths
  const strengths = Array.isArray(analysis.strengths) ? analysis.strengths : [];
  strengthsList.innerHTML = strengths.length ? strengths.map(s => `<li class="bullet-item bullet-strength">${escapeHTML(s)}</li>`).join('') : '<li class="bullet-item">Strong foundation detected.</li>';

  // 5. Render Areas for Improvement
  const improvements = Array.isArray(analysis.areas_for_improvement) ? analysis.areas_for_improvement : [];
  improvementsList.innerHTML = improvements.length ? improvements.map(i => `<li class="bullet-item bullet-improvement">${escapeHTML(i)}</li>`).join('') : '<li class="bullet-item">Keep refining quantitative impact metrics.</li>';

  // 6. Render Student & Internship Actionable Suggestions
  const suggestions = Array.isArray(analysis.actionable_suggestions) ? analysis.actionable_suggestions : [];
  suggestionsList.innerHTML = suggestions.length ? suggestions.map(s => `<li class="bullet-item bullet-suggestion">${escapeHTML(s)}</li>`).join('') : '<li class="bullet-item">Demonstrate skills via targeted class projects.</li>';

  // Reveal results section & smooth scroll
  resultsSection.classList.add('active');
  setTimeout(() => {
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function animateScoreCounter(targetScore) {
  let current = 0;
  scoreDisplay.textContent = '0';
  if (targetScore === 0) return;

  const duration = 1000;
  const frameRate = 30;
  const totalFrames = Math.round(duration / frameRate);
  const increment = targetScore / totalFrames;

  const timer = setInterval(() => {
    current += increment;
    if (current >= targetScore) {
      scoreDisplay.textContent = targetScore;
      clearInterval(timer);
    } else {
      scoreDisplay.textContent = Math.round(current);
    }
  }, frameRate);
}

function escapeHTML(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ═══════════════════════════════════════════════════════════════════
   ACTION TOOLBAR: COPY, PRINT, RESET
   ═══════════════════════════════════════════════════════════════════ */

copyReportBtn.addEventListener('click', () => {
  if (!currentAnalysis) return;

  const report = `======================================================
AI CAREER COPILOT — RESUME ANALYSIS REPORT
======================================================
ATS Match Score: ${currentAnalysis.ats_score} / 100 (${currentAnalysis.match_tier})

EXECUTIVE SUMMARY:
${currentAnalysis.summary}

RELEVANT EXPERIENCE & PROJECT ALIGNMENT:
${currentAnalysis.relevant_experience_assessment}

MATCHING SKILLS (${currentAnalysis.matching_skills.length}):
${currentAnalysis.matching_skills.map(s => `• ${s}`).join('\n')}

MISSING TECHNICAL KEYWORDS (${currentAnalysis.missing_keywords.length}):
${currentAnalysis.missing_keywords.map(k => `• ${k.keyword} [${k.importance}]: ${k.reason}`).join('\n')}

RESUME STRENGTHS:
${currentAnalysis.strengths.map(s => `• ${s}`).join('\n')}

AREAS FOR IMPROVEMENT:
${currentAnalysis.areas_for_improvement.map(i => `• ${i}`).join('\n')}

STUDENT & EARLY-CAREER ACTION PLAN:
${currentAnalysis.actionable_suggestions.map(s => `• ${s}`).join('\n')}
======================================================`;

  navigator.clipboard.writeText(report).then(() => {
    showToast('Full analysis copied to clipboard!');
  }).catch(() => {
    showToast('Failed to copy to clipboard.');
  });
});

printReportBtn.addEventListener('click', () => {
  window.print();
});

newAnalysisBtn.addEventListener('click', () => {
  resumeInput.focus();
  resumeInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Event Listener for Analyze Button
analyzeBtn.addEventListener('click', analyzeResume);

// Initial counter update on page load
updateCounters();
