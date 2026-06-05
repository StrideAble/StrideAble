/* ============================================================
   StrideAble — script.js
   Handles: navbar, scroll reveal, counters, theme toggle,
   hamburger menu, feature cards, phone demo, AI chat panel
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. NAVBAR — shrink on scroll
  // ============================================================
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });


  // ============================================================
  // 2. HAMBURGER MENU
  // ============================================================
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });


  // ============================================================
  // 3. DARK / LIGHT THEME TOGGLE
  // ============================================================
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');
  let isDark = true;

  themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeIcon.textContent = isDark ? '☀️' : '🌙';
  });


  // ============================================================
  // 4. SCROLL REVEAL — Intersection Observer
  // ============================================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger children within the same parent
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        let delay = 0;
        siblings.forEach((el, i) => {
          if (el === entry.target) delay = i * 80;
        });
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ============================================================
  // 5. ANIMATED STAT COUNTERS
  // ============================================================
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000;
    const start = performance.now();

    function update(timestamp) {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }


  // ============================================================
  // 6. FEATURE CARDS — click to toggle active
  // ============================================================
  const featureCards = document.querySelectorAll('.feature-card');

  featureCards.forEach(card => {
    card.addEventListener('click', () => {
      const isActive = card.classList.contains('active');
      // Close all others
      featureCards.forEach(c => c.classList.remove('active'));
      if (!isActive) card.classList.add('active');
    });

    // Keyboard support
    card.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });


  // ============================================================
  // 7. PHONE MOCK CHAT DEMO
  // ============================================================
  const phoneInput = document.getElementById('phoneInput');
  const phoneSend = document.getElementById('phoneSend');
  const chatMessages = document.getElementById('chatMessages');
  const typingIndicator = document.getElementById('typingIndicator');

  const aiResponses = [
    "Great! Let's review your morning routine. Would you like me to set medication reminders?",
    "I noticed you've been moving well today — 847 steps so far. Keep it up!",
    "Remember to stay hydrated. Should I remind you every 2 hours?",
    "Your caregiver was just updated with your activity summary for today.",
    "I'm detecting good movement patterns. Your mobility score is 8.2/10 today!",
    "Would you like tips on moving safely around uneven surfaces?",
    "All systems are running smoothly. Your device battery is at 84%."
  ];

  let aiIndex = 0;

  function sendPhoneMessage() {
    const text = phoneInput.value.trim();
    if (!text) return;

    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg user';
    userMsg.innerHTML = `<div class="chat-bubble">${escapeHtml(text)}</div>`;
    chatMessages.insertBefore(userMsg, typingIndicator);
    phoneInput.value = '';

    // Show typing, then AI response
    typingIndicator.style.display = 'flex';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      typingIndicator.style.display = 'none';
      const aiMsg = document.createElement('div');
      aiMsg.className = 'chat-msg ai';
      aiMsg.innerHTML = `
        <div class="chat-avatar">🤖</div>
        <div class="chat-bubble">${aiResponses[aiIndex % aiResponses.length]}</div>
      `;
      chatMessages.insertBefore(aiMsg, typingIndicator);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      aiIndex++;
    }, 1500);
  }

  if (phoneSend) phoneSend.addEventListener('click', sendPhoneMessage);
  if (phoneInput) phoneInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendPhoneMessage();
  });


  // ============================================================
  // 8. CAREGIVER ALERT POPUP DISMISS
  // ============================================================
  const alertClose = document.getElementById('alertClose');
  const alertPopup = document.getElementById('alertPopup');

  if (alertClose && alertPopup) {
    alertClose.addEventListener('click', () => {
      alertPopup.style.opacity = '0';
      alertPopup.style.transform = 'translateX(20px)';
      setTimeout(() => alertPopup.style.display = 'none', 400);
    });

    // Re-show alert every 30 seconds for demo effect
    setInterval(() => {
      if (alertPopup.style.display === 'none') {
        alertPopup.style.display = 'flex';
        alertPopup.style.opacity = '0';
        alertPopup.style.transform = 'translateX(20px)';
        requestAnimationFrame(() => {
          alertPopup.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          alertPopup.style.opacity = '1';
          alertPopup.style.transform = 'translateX(0)';
        });
      }
    }, 30000);
  }


  // ============================================================
  // 9. FLOATING AI CHAT PANEL
  // ============================================================
  const aiBubble = document.getElementById('aiBubble');
  const aiChatPanel = document.getElementById('aiChatPanel');
  const aiPanelClose = document.getElementById('aiPanelClose');
  const aiInput = document.getElementById('aiInput');
  const aiSend = document.getElementById('aiSend');
  const aiPanelMessages = document.getElementById('aiPanelMessages');

  const aiPanelResponses = [
    "StrideAble clips onto your existing mobility device — no replacement required! It takes under 60 seconds to attach.",
    "The device should face forward so the AI camera can scan the path ahead and detect obstacles before you reach them.",
    "When the camera detects an obstacle, the hand pads vibrate to alert you. The closer the obstacle, the stronger the vibration.",
    "Caregivers receive real-time alerts through the StrideAble app, including fall notifications, location, and activity insights.",
    "StrideAble works with walkers, canes, crutches, wheelchairs, and scooters — any standard mobility device.",
    "The AI companion chatbot can set reminders, answer questions, provide movement tips, and offer emotional support.",
    "StrideAble is available as a direct purchase with an optional monthly subscription for advanced caregiver features.",
    "The built-in flashlight activates automatically in low-light areas to improve visibility and safety.",
    "Fall detection AI analyzes motion patterns in real time. If a fall is detected, your caregivers are immediately notified."
  ];

  let panelIndex = 0;
  let panelOpen = false;

  function toggleAIPanel() {
    panelOpen = !panelOpen;
    aiChatPanel.classList.toggle('open', panelOpen);
    aiChatPanel.setAttribute('aria-hidden', (!panelOpen).toString());
    if (panelOpen && aiInput) setTimeout(() => aiInput.focus(), 300);
  }

  if (aiBubble) aiBubble.addEventListener('click', toggleAIPanel);
  if (aiPanelClose) aiPanelClose.addEventListener('click', toggleAIPanel);

  function sendAIMessage() {
    if (!aiInput || !aiPanelMessages) return;
    const text = aiInput.value.trim();
    if (!text) return;

    // User message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg user';
    userMsg.innerHTML = `<div class="chat-bubble">${escapeHtml(text)}</div>`;
    aiPanelMessages.appendChild(userMsg);
    aiInput.value = '';
    aiPanelMessages.scrollTop = aiPanelMessages.scrollHeight;

    // Typing
    const typingMsg = document.createElement('div');
    typingMsg.className = 'chat-msg ai';
    typingMsg.innerHTML = `<div class="chat-avatar">🤖</div><div class="chat-bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
    aiPanelMessages.appendChild(typingMsg);
    aiPanelMessages.scrollTop = aiPanelMessages.scrollHeight;

    setTimeout(() => {
      typingMsg.remove();
      const aiMsg = document.createElement('div');
      aiMsg.className = 'chat-msg ai';
      aiMsg.innerHTML = `
        <div class="chat-avatar">🤖</div>
        <div class="chat-bubble">${aiPanelResponses[panelIndex % aiPanelResponses.length]}</div>
      `;
      aiPanelMessages.appendChild(aiMsg);
      aiPanelMessages.scrollTop = aiPanelMessages.scrollHeight;
      panelIndex++;
    }, 1200);
  }

  if (aiSend) aiSend.addEventListener('click', sendAIMessage);
  if (aiInput) aiInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendAIMessage();
  });


  // ============================================================
  // 10. SMOOTH SCROLL for nav links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // ============================================================
  // 11. ACTIVE NAV LINK highlight on scroll
  // ============================================================
  const sections = document.querySelectorAll('section[id]');
  const navAnchorLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchorLinks.forEach(link => {
          link.classList.toggle('active-nav', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sectionObserver.observe(s));


  // ============================================================
  // UTILITY
  // ============================================================
  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

}); // end DOMContentLoaded
