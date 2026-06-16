/*
 * Orchids High School - Interactive Script
 * Author: Senior Frontend Architect
 * Description: Clean, modular Vanilla JS logic with animations & state management
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. Toast Notification System
  // ==========================================
  const toastContainer = document.getElementById('toast-container');

  function showToast(title, message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    
    let iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'error') iconClass = 'fa-triangle-exclamation';

    toast.innerHTML = `
      <i class="fa-solid ${iconClass}"></i>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <i class="fa-solid fa-xmark toast-close" aria-label="Close Notification"></i>
    `;
    
    toastContainer.appendChild(toast);

    // Close on click
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      removeToast(toast);
    });

    // Auto remove
    const timer = setTimeout(() => {
      removeToast(toast);
    }, duration);

    toast.dataset.timerId = timer;
  }

  function removeToast(toast) {
    clearTimeout(parseInt(toast.dataset.timerId));
    toast.style.transform = 'translateY(20px) scale(0.95)';
    toast.style.opacity = '0';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }


  // ==========================================
  // 2. Preloader Animation
  // ==========================================
  const preloader = document.getElementById('preloader');
  const loaderPercentage = document.getElementById('loader-percentage');
  let currentLoadPercent = 0;
  
  const simulatedLoad = setInterval(() => {
    currentLoadPercent += Math.floor(Math.random() * 12) + 5;
    if (currentLoadPercent >= 100) {
      currentLoadPercent = 100;
      clearInterval(simulatedLoad);
      
      // Fade out preloader
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        document.body.style.overflowY = 'initial'; // Allow scroll
        showToast('Welcome!', 'Explore the premium campus of Orchids High School.', 'success');
      }, 400);
    }
    loaderPercentage.textContent = `${currentLoadPercent}%`;
  }, 45);


  // ==========================================
  // 3. Live Clock and Current Date
  // ==========================================
  const liveClockEl = document.getElementById('live-clock');
  const currentDateEl = document.getElementById('current-date');

  function updateClock() {
    const now = new Date();
    
    // Time Format: HH:MM:SS AM/PM
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    const formattedHours = String(hours).padStart(2, '0');
    
    if (liveClockEl) {
      liveClockEl.textContent = `${formattedHours}:${minutes}:${seconds} ${ampm}`;
    }

    // Date Format: Monday, June 15, 2026
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    if (currentDateEl) {
      currentDateEl.textContent = now.toLocaleDateString('en-US', options);
    }
  }

  // Initial call and set interval
  updateClock();
  setInterval(updateClock, 1000);


  // ==========================================
  // 4. Dark Mode Settings & Persistent State
  // ==========================================
  const themeBtn = document.getElementById('theme-mode-btn');
  const htmlRoot = document.documentElement;

  // Retrieve setting or fallback to auto
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    htmlRoot.setAttribute('data-theme', 'dark');
    updateThemeIcon(true);
  } else {
    htmlRoot.setAttribute('data-theme', 'light');
    updateThemeIcon(false);
  }

  themeBtn.addEventListener('click', () => {
    const isDark = htmlRoot.getAttribute('data-theme') === 'dark';
    if (isDark) {
      htmlRoot.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      updateThemeIcon(false);
      showToast('Theme Changed', 'Light mode styling applied.', 'info');
    } else {
      htmlRoot.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      updateThemeIcon(true);
      showToast('Theme Changed', 'Dark mode styling applied.', 'info');
    }
  });

  function updateThemeIcon(isDark) {
    const icon = themeBtn.querySelector('i');
    if (isDark) {
      icon.className = 'fa-solid fa-sun';
    } else {
      icon.className = 'fa-solid fa-moon';
    }
  }


  // ==========================================
  // 5. Scroll Progress Bar & Sticky Nav Shadows
  // ==========================================
  const scrollProgress = document.getElementById('scroll-progress');
  const mainHeader = document.getElementById('header');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    // 5.1 Progress Bar
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const scrolled = (window.scrollY / totalHeight) * 100;
      scrollProgress.style.width = `${scrolled}%`;
    }

    // 5.2 Header Shrink / Shadow Toggle
    if (window.scrollY > 50) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }

    // 5.3 Back to Top Visibility
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    // 5.4 Update Active Nav Link on Scroll
    updateActiveNavLink();
  });

  // Back to Top Click
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });


  // ==========================================
  // 6. Navigation Search Box Toggle
  // ==========================================
  const searchToggle = document.getElementById('search-toggle-btn');
  const searchDropdown = document.getElementById('search-dropdown');
  const searchClose = document.getElementById('search-close-btn');
  const searchInput = document.getElementById('search-input');

  searchToggle.addEventListener('click', () => {
    searchDropdown.classList.toggle('active');
    if (searchDropdown.classList.contains('active')) {
      searchInput.focus();
    }
  });

  searchClose.addEventListener('click', () => {
    searchDropdown.classList.remove('active');
    searchInput.value = '';
  });

  // Handle Search Queries
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query !== '') {
        showToast('Searching...', `Query: "${query}" - Redirecting to details.`, 'info');
        searchDropdown.classList.remove('active');
        searchInput.value = '';
        
        // Simple client-side search simulation: scroll to section if matched
        const sections = ['about', 'academics', 'admissions', 'facilities', 'gallery', 'achievements', 'contact'];
        const matched = sections.find(s => s.toLowerCase().includes(query.toLowerCase()));
        if (matched) {
          const el = document.getElementById(matched);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    }
  });

  // Close Search on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchDropdown.classList.remove('active');
    }
  });


  // ==========================================
  // 7. Mobile Hamburger Menu Drawer
  // ==========================================
  const menuHamburger = document.getElementById('menu-hamburger');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('mobile-drawer-backdrop');
  const mobileLinks = mobileDrawer.querySelectorAll('a');

  function toggleMenu() {
    menuHamburger.classList.toggle('open');
    mobileDrawer.classList.toggle('open');
    drawerBackdrop.classList.toggle('active');
    
    // Toggle scroll freeze on body
    if (mobileDrawer.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  menuHamburger.addEventListener('click', toggleMenu);
  drawerBackdrop.addEventListener('click', toggleMenu);
  
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Close drawer and navigate
      menuHamburger.classList.remove('open');
      mobileDrawer.classList.remove('open');
      drawerBackdrop.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  });


  // ==========================================
  // 8. Active Nav Link on Scroll Highlight
  // ==========================================
  const navItems = document.querySelectorAll('.nav-links a');
  const scrollSections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    let currentId = '';
    const scrollPos = window.scrollY + 120; // offset

    scrollSections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentId}`) {
        item.classList.add('active');
      }
    });

    mobileLinks.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentId}`) {
        item.classList.add('active');
      }
    });
  }


  // ==========================================
  // 9. Hero Section Typewriter Text Effect
  // ==========================================
  const typewriterText = document.getElementById('typewriter-text');
  const phrases = [
    "Inspiring Excellence in Education, Character, and Innovation.",
    "Empowering Global Citizens of Tomorrow.",
    "Modern Smart Classrooms & Elite Sports Arena.",
    "Holistic Arts Hub & High-Safety Campus Fleet."
  ];
  
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 50;

  function type() {
    const currentPhrase = phrases[phraseIdx];
    
    if (isDeleting) {
      typewriterText.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 20; // delete faster
    } else {
      typewriterText.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 50;
    }

    if (!isDeleting && charIdx === currentPhrase.length) {
      // Pause at full word
      isDeleting = true;
      typingSpeed = 3000; // delay before erase
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingSpeed = 500; // delay before typing next
    }

    setTimeout(type, typingSpeed);
  }

  if (typewriterText) {
    type();
  }


  // ==========================================
  // 10. Scroll-Reveal Animation Engine (Intersection Observer)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal-element');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });


  // ==========================================
  // 11. Statistics Animated Counters
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.8
  });

  statNumbers.forEach(num => {
    statsObserver.observe(num);
  });

  function animateCounter(element) {
    const targetValue = parseInt(element.getAttribute('data-target'));
    let currentValue = 0;
    const duration = 2000; // 2 seconds
    const increment = Math.ceil(targetValue / (duration / 30)); // ticks every 30ms

    const counterInterval = setInterval(() => {
      currentValue += increment;
      if (currentValue >= targetValue) {
        element.textContent = targetValue + '+';
        clearInterval(counterInterval);
      } else {
        element.textContent = currentValue + '+';
      }
    }, 30);
  }


  // ==========================================
  // 12. Academics Cards Detail Accordion
  // ==========================================
  const academicButtons = document.querySelectorAll('.academic-expand-btn');

  academicButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const moreContent = btn.nextElementSibling;
      const isExpanded = moreContent.classList.contains('expanded');
      
      // Close all other expansions for clean UX
      document.querySelectorAll('.academics-more-content').forEach(content => {
        content.classList.remove('expanded');
        const prevBtn = content.previousElementSibling;
        if (prevBtn) {
          prevBtn.innerHTML = `Learn More <i class="fa-solid fa-plus" style="margin-left: 5px;"></i>`;
        }
      });

      if (!isExpanded) {
        moreContent.classList.add('expanded');
        btn.innerHTML = `Hide Info <i class="fa-solid fa-minus" style="margin-left: 5px;"></i>`;
        showToast('Academic Details', 'Scroll down inside the card for curriculum particulars.', 'info');
      } else {
        moreContent.classList.remove('expanded');
        btn.innerHTML = `Learn More <i class="fa-solid fa-plus" style="margin-left: 5px;"></i>`;
      }
    });
  });


  // ==========================================
  // 13. Gallery Categorized Filters & Lightbox
  // ==========================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let activeGalleryArr = [];
  let currentLightboxIdx = 0;

  // 13.1 Filter logic
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-filter');
      
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          item.classList.remove('hidden');
          item.style.animation = 'zoomIn 0.35s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
      
      // Update active array for lightbox carousel
      updateActiveGalleryArr();
    });
  });

  function updateActiveGalleryArr() {
    activeGalleryArr = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
  }
  updateActiveGalleryArr(); // Run initially

  // 13.2 Lightbox functionality
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      openLightbox(item);
    });
    
    // Keyboard accessibility support
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        openLightbox(item);
      }
    });
  });

  function openLightbox(clickedItem) {
    currentLightboxIdx = activeGalleryArr.indexOf(clickedItem);
    updateLightboxContent();
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Freeze background
  }

  function updateLightboxContent() {
    const item = activeGalleryArr[currentLightboxIdx];
    if (item) {
      const img = item.querySelector('img');
      const title = item.querySelector('h4').textContent;
      const cat = item.querySelector('span').textContent;
      
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = `${title} (${cat})`;
    }
  }

  // Close Lightbox
  lightboxClose.addEventListener('click', () => {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  // Prev / Next arrow controls
  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    currentLightboxIdx = (currentLightboxIdx - 1 + activeGalleryArr.length) % activeGalleryArr.length;
    updateLightboxContent();
  });

  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    currentLightboxIdx = (currentLightboxIdx + 1) % activeGalleryArr.length;
    updateLightboxContent();
  });

  // Lightbox keyboard arrows support
  document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'flex') {
      if (e.key === 'ArrowRight') {
        currentLightboxIdx = (currentLightboxIdx + 1) % activeGalleryArr.length;
        updateLightboxContent();
      } else if (e.key === 'ArrowLeft') {
        currentLightboxIdx = (currentLightboxIdx - 1 + activeGalleryArr.length) % activeGalleryArr.length;
        updateLightboxContent();
      } else if (e.key === 'Escape') {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    }
  });


  // ==========================================
  // 14. Modals Controller
  // ==========================================
  // General close helper
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  // 14.1 Admission Application Modal triggers
  const applyBtnHero = document.getElementById('hero-apply-btn');
  const applyBtnCta = document.getElementById('admissions-apply-btn');
  const admissionModal = document.getElementById('admission-modal');
  const admissionModalClose = document.getElementById('admission-modal-close');

  if (applyBtnHero) applyBtnHero.addEventListener('click', () => openModal('admission-modal'));
  if (applyBtnCta) applyBtnCta.addEventListener('click', () => openModal('admission-modal'));
  
  if (admissionModalClose) {
    admissionModalClose.addEventListener('click', () => closeModal('admission-modal'));
  }
  
  // Close modals on overlay backdrop clicks
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });

  // ==========================================
  // 15. Form Submission Interceptors & Validations
  // ==========================================
  
  // Helper for dynamic loading button state
  function setSubmitting(form, isSubmitting, btnText = 'Submit') {
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      if (isSubmitting) {
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting...`;
      } else {
        btn.disabled = false;
        btn.innerHTML = btnText;
      }
    }
  }

  // 15.1 Admission Form → WhatsApp
  const admissionForm = document.getElementById('admission-application-form');
  admissionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const childName   = document.getElementById('child-name').value.trim();
    const childDob    = document.getElementById('child-dob').value;
    const grade       = document.getElementById('admission-grade').value;
    const parentName  = document.getElementById('parent-name').value.trim();
    const parentEmail = document.getElementById('parent-email').value.trim();
    const parentPhone = document.getElementById('parent-phone').value.trim();
    const parentMsg   = document.getElementById('parent-msg').value.trim();

    if (parentPhone.length < 8) {
      showToast('Validation Error', 'Please enter a valid phone number.', 'error');
      return;
    }

    setSubmitting(admissionForm, true, `Submit Application <i class="fa-solid fa-circle-check"></i>`);

    const waMessage =
      `🏫 *Orchids High School – Admission Application*\n\n` +
      `👦 *Child's Name:* ${childName}\n` +
      `📅 *Date of Birth:* ${childDob}\n` +
      `🎓 *Grade Applying For:* ${grade}\n` +
      `👨‍👩‍👦 *Parent/Guardian:* ${parentName}\n` +
      `📧 *Email:* ${parentEmail}\n` +
      `📞 *Phone:* ${parentPhone}\n` +
      (parentMsg ? `📝 *Additional Info:* ${parentMsg}\n` : '') +
      `\nKindly confirm receipt and next steps. Thank you!`;

    setTimeout(() => {
      setSubmitting(admissionForm, false, `Submit Application <i class="fa-solid fa-circle-check"></i>`);
      closeModal('admission-modal');
      showToast(
        'Redirecting to WhatsApp!',
        `Your application for ${childName} is being sent via WhatsApp.`,
        'success'
      );
      admissionForm.reset();
      // Open WhatsApp with pre-filled message
      window.open(
        `https://wa.me/919948641567?text=${encodeURIComponent(waMessage)}`,
        '_blank'
      );
    }, 1000);
  });

  // 15.3 Contact Inquiry Form → WhatsApp
  const contactForm = document.getElementById('main-contact-form');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('contact-name').value.trim();
    const email   = document.getElementById('contact-email').value.trim();
    const phone   = document.getElementById('contact-phone').value.trim();
    const subject = document.getElementById('contact-query').value;
    const message = document.getElementById('contact-message').value.trim();

    if (phone.length < 8) {
      showToast('Validation Error', 'Please enter a valid phone number.', 'error');
      return;
    }

    setSubmitting(contactForm, true, `Send Message <i class="fa-solid fa-paper-plane"></i>`);

    const waMessage =
      `📩 *Orchids High School – Contact Inquiry*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📧 *Email:* ${email}\n` +
      `📞 *Phone:* ${phone}\n` +
      `📋 *Subject:* ${subject}\n` +
      `💬 *Message:* ${message}\n\n` +
      `Kindly respond at your earliest convenience. Thank you!`;

    setTimeout(() => {
      setSubmitting(contactForm, false, `Send Message <i class="fa-solid fa-paper-plane"></i>`);
      showToast(
        'Redirecting to WhatsApp!',
        `Your message from ${name} is being sent via WhatsApp.`,
        'success'
      );
      contactForm.reset();
      window.open(
        `https://wa.me/919948641567?text=${encodeURIComponent(waMessage)}`,
        '_blank'
      );
    }, 1000);
  });

  // 15.4 Newsletter Subscription → WhatsApp
  const newsletterForm = document.getElementById('newsletter-subscription-form');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value.trim();

    const subBtn = newsletterForm.querySelector('button');
    subBtn.disabled = true;
    subBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;

    const waMessage =
      `📰 *Orchids High School – Newsletter Subscription*\n\n` +
      `📧 *Email:* ${email}\n\n` +
      `Please add me to the newsletter mailing list for event listings, calendar notifications, and academic updates. Thank you!`;

    setTimeout(() => {
      subBtn.disabled = false;
      subBtn.innerHTML = `Subscribe <i class="fa-brands fa-whatsapp"></i>`;
      showToast(
        'Redirecting to WhatsApp!',
        `Your newsletter subscription request is being sent via WhatsApp.`,
        'success'
      );
      newsletterForm.reset();
      window.open(
        `https://wa.me/919948641567?text=${encodeURIComponent(waMessage)}`,
        '_blank'
      );
    }, 1000);
  });

  // 15.5 Brochure Download Simulation
  const downloadBrochureBtn = document.getElementById('download-brochure-btn');
  downloadBrochureBtn.addEventListener('click', () => {
    downloadBrochureBtn.disabled = true;
    downloadBrochureBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Generating PDF...`;
    showToast('Download Started', 'Preparing Orchids High School prospectus 2026-27 brochure.', 'info');

    setTimeout(() => {
      downloadBrochureBtn.disabled = false;
      downloadBrochureBtn.innerHTML = `Download Brochure <i class="fa-solid fa-file-pdf" style="margin-left: 5px;"></i>`;
      showToast('Download Finished', 'The OHS Prospectus has downloaded successfully.', 'success');
      
      // Simulate file download by opening raw placeholder file URL
      window.open('data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDMwMzQ1UFJQUFBwVEBRADG1DE2NEs3NTCwSzdSMzSwSjdSUDFQSDdWMzc1NTJSUDA0A1uYKdgplbmRzdHJlYW0KZW5kb2JqCgo=', '_blank');
    }, 2000);
  });


  // ==========================================
  // 17. FAQ Accordion Dropdowns
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other FAQs
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      }
    });
  });


  // ==========================================
  // 18. Floating Widgets & Interactive Features
  // ==========================================
  
  // 18.1 WhatsApp Chat Widget Toggle
  const waBtn = document.getElementById('whatsapp-toggle-btn');
  const waDrawer = document.getElementById('whatsapp-drawer-panel');

  waBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    waDrawer.classList.toggle('active');
  });

  // Close WA widget when clicking outside
  document.addEventListener('click', (e) => {
    if (!waDrawer.contains(e.target) && e.target !== waBtn) {
      waDrawer.classList.remove('active');
    }
  });

  // 18.2 Button Ripple Effects handler
  const ripples = document.querySelectorAll('.ripple-trigger');
  
  ripples.forEach(button => {
    button.addEventListener('click', function (e) {
      // Create element
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;
      
      const rippleSpan = document.createElement('span');
      rippleSpan.className = 'ripple';
      rippleSpan.style.left = `${x}px`;
      rippleSpan.style.top = `${y}px`;
      
      this.appendChild(rippleSpan);
      
      // Remove element
      setTimeout(() => {
        rippleSpan.remove();
      }, 600);
    });
  });

  // Footer dynamic year update
  const footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

});