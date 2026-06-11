const FORMSPREE_URL = 'https://formspree.io/f/mzdqdyey';
const WEB3FORMS_URL = 'https://api.web3forms.com/submit';
const WEB3FORMS_KEY = 'fc58081d-f44a-427f-b0e0-0a213da0ea25';

// ====== MARKET RESEARCH SURVEY ======
const questions = [
  {
    q: "How interested are you in using GEMI when it launches?",
    options: [
      { text: "Very interested — I'd use it right away", value: 5 },
      { text: "Interested — I'd try it out", value: 4 },
      { text: "Somewhat interested — Maybe", value: 3 },
      { text: "Not very interested", value: 2 },
      { text: "Not interested at all", value: 1 }
    ]
  },
  {
    q: "What appeals to you most about GEMI?",
    options: [
      { text: "Small group format (3-5 people)", value: "group_size" },
      { text: "Personality-based matching", value: "matching" },
      { text: "Anonymous trial period", value: "anonymous" },
      { text: "AI activity coordination", value: "ai_coordination" },
      { text: "Chemistry-first approach (no swiping)", value: "chemistry" }
    ]
  },
  {
    q: "How often do you struggle to find genuine friendships?",
    options: [
      { text: "Very often — it's a real challenge", value: 5 },
      { text: "Often — more than I'd like", value: 4 },
      { text: "Sometimes — here and there", value: 3 },
      { text: "Rarely — I have enough friends", value: 2 },
      { text: "Never — I'm satisfied socially", value: 1 }
    ]
  },
  {
    q: "Would you recommend GEMI to a friend based on what you've seen?",
    options: [
      { text: "Definitely — I'd tell everyone", value: 5 },
      { text: "Probably — sounds promising", value: 4 },
      { text: "Maybe — need to see more", value: 3 },
      { text: "Probably not", value: 2 },
      { text: "Definitely not", value: 1 }
    ]
  },
  {
    q: "Our pricing: Basic $0 • Pro $9.99/mo • Elite $29.99/mo • Business $99.99+/mo. Is this fair?",
    options: [
      { text: "Yes, fair pricing", value: "fair" },
      { text: "Too expensive", value: "too_expensive" },
      { text: "Too cheap (I'd pay more)", value: "too_cheap" }
    ]
  },
  {
    q: "What would YOU pay monthly for GEMI Pro tier features?",
    type: "text",
    placeholder: "e.g., $5, $15, $20..."
  },
  {
    q: "What's your age range?",
    options: [
      { text: "Under 18", value: "under-18" },
      { text: "18-24", value: "18-24" },
      { text: "25-34", value: "25-34" },
      { text: "35-44", value: "35-44" },
      { text: "45-54", value: "45-54" },
      { text: "55+", value: "55+" }
    ]
  },
  {
    q: "What apps do you currently use for meeting people or socializing?",
    type: "text",
    placeholder: "e.g., Bumble BFF, Meetup, Discord, Facebook Groups..."
  }
];

let currentQ = 0;
let answers = [];

/**
 * Renders the current quiz question
 */
function renderQuestion() {
  const q = questions[currentQ];
  document.getElementById('quizQuestion').textContent = q.q;
  const optsEl = document.getElementById('quizOptions');
  optsEl.innerHTML = '';
  
  if (q.type === 'text') {
    // Text input question
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'quiz-text-input';
    input.placeholder = q.placeholder || 'Your answer...';
    input.style.cssText = 'width: 100%; padding: 0.85rem 1.1rem; border: 1px solid var(--border); border-radius: 12px; font-size: 0.95rem; font-family: inherit; margin-bottom: 0.8rem;';
    optsEl.appendChild(input);
    
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = 'Continue';
    btn.onclick = () => {
      const value = input.value.trim() || 'No answer';
      selectOption({ value });
    };
    optsEl.appendChild(btn);
  } else {
    // Multiple choice question
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt.text;
      btn.onclick = () => selectOption(opt);
      optsEl.appendChild(btn);
    });
  }
  
  // Update progress bars
  for (let i = 1; i <= 8; i++) {
    document.getElementById('bar' + i).classList.toggle('active', i <= currentQ + 1);
  }
}

/**
 * Handles quiz option selection
 */
function selectOption(opt) {
  answers.push(opt.value);
  currentQ++;
  if (currentQ < questions.length) {
    renderQuestion();
  } else {
    showResult();
  }
}

/**
 * Shows the quiz result
 */
function showResult() {
  document.getElementById('quizQuestions').style.display = 'none';
  document.getElementById('quizResult').classList.add('show');
  
  // Calculate interest score
  const interestScore = answers[0] || 3;
  const painPoint = answers[2] || 3;
  const nps = answers[3] || 3;
  const pricingFairness = answers[4] || 'unknown';
  const customPrice = answers[5] || 'No answer';
  const ageRange = answers[6] || 'unknown';
  const favoriteApps = answers[7] || 'No answer';
  
  let emoji = "🎉";
  let message = "Thank you for your feedback!";
  let desc = "Your input helps us build a better GEMI. Join the waitlist to be notified when we launch.";
  
  if (interestScore >= 4) {
    emoji = "🚀";
    message = "You're going to love GEMI!";
    desc = "Based on your answers, GEMI is exactly what you're looking for. Join the waitlist to get early access.";
  } else if (interestScore === 3) {
    emoji = "💭";
    message = "We'd love to win you over!";
    desc = "Your feedback helps us improve. Join the waitlist to see how GEMI evolves.";
  }
  
  document.getElementById('resultEmoji').textContent = emoji;
  document.getElementById('resultType').textContent = message;
  document.getElementById('resultDesc').textContent = desc;
  
  // Store survey results for form submit
  window._quizResult = { 
    surveyResults: {
      interestLevel: interestScore,
      topFeature: answers[1],
      painPoint: painPoint,
      nps: nps,
      pricingFairness: pricingFairness,
      customPrice: customPrice,
      ageRange: ageRange,
      favoriteApps: favoriteApps
    },
    rawAnswers: answers 
  };
}

// ====== FORM HANDLING ======
/**
 * Submits form data to multiple services
 */
async function submitForm(email, source, extraData = {}) {
  const signup = { email, source, timestamp: new Date().toISOString(), ...extraData };

  // Submit to both Web3Forms and Formspree for redundancy
  const results = await Promise.allSettled([
    // Submit to Web3Forms
    (async () => {
      const formData = new FormData();
      formData.append('access_key', WEB3FORMS_KEY);
      formData.append('email', email);
      formData.append('source', source);
      formData.append('timestamp', signup.timestamp);
      
      // Add extra data fields
      if (extraData.message) {
        formData.append('message', extraData.message);
      }
      if (extraData.surveyResults) {
        formData.append('surveyResults', JSON.stringify(extraData.surveyResults));
      }
      if (extraData.rawAnswers) {
        formData.append('rawAnswers', JSON.stringify(extraData.rawAnswers));
      }
      
      const response = await fetch(WEB3FORMS_URL, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Web3Forms submission failed');
      }
      return response.json();
    })(),
    
    // Submit to Formspree
    fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(signup)
    })
  ]);
  
  // Log results for debugging
  results.forEach((result, index) => {
    const service = index === 0 ? 'Web3Forms' : 'Formspree';
    if (result.status === 'fulfilled') {
      console.log(`${service}: Success`);
    } else {
      console.error(`${service}: Failed -`, result.reason);
    }
  });
  
  return true;
}

/**
 * Attaches form submission handler
 */
function attachForm(formId, successId, source) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!email) return;
    
    let extra = {};
    if (source === 'quiz') {
      extra = window._quizResult || {};
    } else if (source === 'founding' && form.message) {
      extra.message = form.message.value.trim();
    }
    
    await submitForm(email, source, extra);
    form.style.display = 'none';
    document.getElementById(successId).classList.add('show');
  });
}

/**
 * Initialize form handlers
 */
function initForms() {
  attachForm('heroForm', 'heroSuccess', 'founding');
  attachForm('finalForm', 'finalSuccess', 'final');
  attachForm('quizForm', 'quizSuccess', 'quiz');
}

// ====== FAQ TOGGLE ======
/**
 * Initialize FAQ accordion
 */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question').addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });
}

// ====== INITIALIZATION ======
/**
 * Initialize the app when DOM is ready
 */
function init() {
  renderQuestion();
  initForms();
  initFAQ();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
