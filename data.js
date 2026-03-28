/**
 * data.js
 * Central data store — all content lives here.
 * Other modules import from window.SL_DATA.
 */
window.SL_DATA = {

  stats: [
    { num: '99.9%', label: 'Uptime SLA' },
    { num: '<50ms', label: 'Latency Overhead' },
    { num: '100%',  label: 'Free Tech Stack' },
    { num: '2 wks', label: 'MVP Timeline' },
  ],

  splitCards: [
    {
      cls:   'problem',
      icon:  '⚠️',
      title: 'The Problem',
      body:  `AI systems generate incorrect, biased, or harmful outputs at scale.
              Companies lack real-time control, monitoring visibility, and compliance tools.
              A single unsafe AI response can damage brand trust, trigger legal liability,
              or cause real-world harm — and most teams won't know until it's too late.`,
    },
    {
      cls:   'solution',
      icon:  '🛡️',
      title: 'Our Solution',
      body:  `SafeLayer sits between your AI model and your users — intercepting every output,
              scoring it for risk, filtering unsafe responses, and logging everything for compliance.
              Real-time protection with zero changes to your existing AI infrastructure.
              Deploy in minutes, gain control instantly.`,
    },
  ],

  features: [
    { num: '01 / 05', icon: '🔍', title: 'Output Monitoring',        body: 'Intercept and inspect every AI response in real-time. Detect harmful, incorrect, or policy-violating content before it reaches end users.' },
    { num: '02 / 05', icon: '📊', title: 'Risk Scoring',             body: 'Every output is scored across three tiers — Safe, Risky, and Dangerous — using a combination of regex patterns, Detoxify, and spaCy NLP.' },
    { num: '03 / 05', icon: '🔧', title: 'Auto Filtering & Correction', body: 'Dangerous outputs are automatically blocked or corrected. Configurable thresholds let you tune the balance between safety and utility.' },
    { num: '04 / 05', icon: '📈', title: 'Analytics Dashboard',      body: 'A Grafana-powered dashboard gives you live metrics on output safety rates, risk trends, and model behavior over time.' },
    { num: '05 / 05', icon: '📋', title: 'Compliance Reporting',     body: 'Audit-ready reports with full output logs, risk scores, and filter decisions. Built for teams that need to demonstrate AI governance.' },
  ],

  archNodes: [
    { label: 'Origin',      name: 'User',          highlight: false },
    { label: 'Intake',      name: 'API Layer',      highlight: false },
    { label: 'Intelligence',name: 'AI Model',       highlight: false },
    { label: 'Protection',  name: 'Safety Engine',  highlight: true  },
    { label: 'Delivery',    name: 'Output',         highlight: false },
  ],

  stack: [
    { icon: '🤖', category: 'AI Model',    name: 'Ollama (Mistral / LLaMA)' },
    { icon: '⚡', category: 'Backend',     name: 'FastAPI + Python' },
    { icon: '⚛️', category: 'Frontend',    name: 'React.js + Vercel' },
    { icon: '🗄️', category: 'Database',    name: 'PostgreSQL' },
    { icon: '🧠', category: 'Vector DB',   name: 'ChromaDB / FAISS' },
    { icon: '🛡️', category: 'Safety',      name: 'Detoxify + spaCy + Regex' },
    { icon: '☁️', category: 'Hosting',     name: 'Render (free tier)' },
    { icon: '🔐', category: 'Auth',        name: 'JWT' },
    { icon: '📊', category: 'Monitoring',  name: 'Grafana + Prometheus' },
    { icon: '📬', category: 'Queue',       name: 'Redis + Celery' },
    { icon: '🔄', category: 'Automation',  name: 'n8n' },
  ],

  timeline: [
    {
      label: 'Week 1',
      dotClass: '',
      title: 'API Core + Safety Filters',
      tasks: [
        'FastAPI backend scaffolding with JWT auth',
        'Ollama integration (Mistral / LLaMA)',
        'Basic regex + Detoxify safety filters',
        'Risk scoring engine (Safe / Risky / Dangerous)',
        'PostgreSQL schema + logging pipeline',
      ],
    },
    {
      label: 'Week 2',
      dotClass: 'green',
      title: 'Dashboard + Deployment',
      tasks: [
        'React.js frontend dashboard',
        'Grafana + Prometheus monitoring integration',
        'Output logs & compliance report views',
        'Redis + Celery async queue setup',
        'Deploy to Render (free tier) + Vercel',
      ],
    },
  ],

  pricing: [
    {
      tier:     'Free Tier',
      price:    '$0',
      period:   '/mo',
      desc:     'For individuals and early-stage projects.',
      featured: false,
      features: [
        'Up to 10,000 requests/month',
        'Basic risk scoring (3 tiers)',
        'Output monitoring dashboard',
        '7-day log retention',
        'Community support',
      ],
    },
    {
      tier:     'Pro Tier',
      price:    '$49',
      period:   '/mo',
      desc:     'For teams that need reliability and compliance.',
      featured: true,
      features: [
        'Unlimited requests',
        'Advanced NLP safety filters',
        'Compliance reports (PDF export)',
        '90-day log retention',
        'Custom safety rules',
        'Priority support + SLA',
      ],
    },
  ],

  roadmap: [
    { icon: '🔭', title: 'AI Explainability',        body: 'Understand why an output was flagged. Per-token risk attribution and natural language explanations of every safety decision.' },
    { icon: '🌍', title: 'Multi-language Support',   body: 'Safety filters that work across languages. Detect harmful content in any language your AI operates in.' },
    { icon: '🏭', title: 'Industry-specific Rules',  body: 'Pre-built safety rulesets for healthcare, finance, legal, and education. Compliance out of the box for regulated industries.' },
  ],
};
