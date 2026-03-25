// Білоус Владислав - main.js
// Курсова робота: Розробка вебсайту послуг з дизайну інтер'єру
// Лабораторна робота №13-14: JavaScript, DOM маніпуляції, обробники подій

'use strict';

/* =========================================================
   1. ХЕДЕР: фіксований з тінню при прокрутці
   ========================================================= */
const header = document.getElementById('header');

// Обробник події scroll (ЛР №13-14: addEventListener)
window.addEventListener('scroll', function () {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

/* =========================================================
   2. ГАМБУРГЕР-МЕНЮ (ЛР №13-14: маніпуляція DOM, toggle)
   ========================================================= */
const burger = document.getElementById('burger');
const nav    = document.getElementById('nav');

// Обробник кліку на кнопку бургер
burger.addEventListener('click', function () {
  // Перемикаємо клас (ЛР №13-14: classList.toggle)
  burger.classList.toggle('open');
  nav.classList.toggle('open');

  // Aria-атрибут для доступності
  const isOpen = nav.classList.contains('open');
  burger.setAttribute('aria-expanded', isOpen);
});

// Закриваємо меню при кліку на посилання
const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(function (link) {
  link.addEventListener('click', function () {
    burger.classList.remove('open');
    nav.classList.remove('open');
  });
});

// Закриваємо меню при кліку за межами
document.addEventListener('click', function (event) {
  if (!nav.contains(event.target) && !burger.contains(event.target)) {
    burger.classList.remove('open');
    nav.classList.remove('open');
  }
});

/* =========================================================
   3. ACTIVE NAVIGATION (підсвічення активного пункту)
   ========================================================= */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__link').forEach(function (link) {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});

/* =========================================================
   4. SMOOTH SCROLL для якірних посилань
   ========================================================= */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (event) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const targetId = href.substring(1);
    const targetEl = document.getElementById(targetId);

    if (targetEl) {
      event.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

      // Плавна прокрутка (ЛР №13-14: window.scrollTo)
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  });
});

/* =========================================================
   5. ВАЛІДАЦІЯ ФОРМ (ЛР №6, ЛР №11-12: JavaScript валідація)
   ========================================================= */

// --- Допоміжні функції валідації ---

/**
 * Перевіряє чи поле не порожнє
 * @param {string} value
 * @param {number} minLen
 * @returns {boolean}
 */
function isNotEmpty(value, minLen = 1) {
  return value.trim().length >= minLen;
}

/**
 * Перевіряє формат email
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  // Регулярний вираз для перевірки email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Перевіряє формат телефону (мінімум 10 цифр)
 * @param {string} phone
 * @returns {boolean}
 */
function isValidPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10;
}

/**
 * Показує помилку для поля
 * @param {HTMLElement} input
 * @param {HTMLElement} errorEl
 * @param {string} message
 */
function showError(input, errorEl, message) {
  input.classList.remove('success');
  input.classList.add('error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
}

/**
 * Показує успіх для поля
 * @param {HTMLElement} input
 * @param {HTMLElement} errorEl
 */
function showSuccess(input, errorEl) {
  input.classList.remove('error');
  input.classList.add('success');
  if (errorEl) {
    errorEl.classList.remove('visible');
  }
}

/**
 * Очищає стан поля
 * @param {HTMLElement} input
 * @param {HTMLElement} errorEl
 */
function clearState(input, errorEl) {
  input.classList.remove('error', 'success');
  if (errorEl) {
    errorEl.classList.remove('visible');
  }
}

/* =========================================================
   5a. ФОРМА НА ГОЛОВНІЙ СТОРІНЦІ
   ========================================================= */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  const fields = {
    firstName: {
      input:  document.getElementById('firstName'),
      error:  document.getElementById('firstNameError'),
      validate: function (val) {
        if (!isNotEmpty(val, 2)) return "Вкажіть ваше ім'я (мінімум 2 символи)";
        return null;
      }
    },
    email: {
      input:  document.getElementById('email'),
      error:  document.getElementById('emailError'),
      validate: function (val) {
        if (!isNotEmpty(val)) return "Вкажіть email адресу";
        if (!isValidEmail(val)) return "Вкажіть коректний email (наприклад: name@mail.com)";
        return null;
      }
    },
    message: {
      input:  document.getElementById('message'),
      error:  document.getElementById('messageError'),
      validate: function (val) {
        if (!isNotEmpty(val, 10)) return "Напишіть повідомлення (мінімум 10 символів)";
        return null;
      }
    }
  };

  // Валідація в реальному часі (ЛР №13-14: addEventListener 'input')
  Object.keys(fields).forEach(function (key) {
    const field = fields[key];
    if (!field.input) return;

    field.input.addEventListener('input', function () {
      const error = field.validate(this.value);
      if (error) {
        showError(field.input, field.error, error);
      } else {
        showSuccess(field.input, field.error);
      }
    });

    // Скидаємо при фокусі якщо тільки порожнє
    field.input.addEventListener('focus', function () {
      if (!this.value) {
        clearState(field.input, field.error);
      }
    });
  });

  // Відправка форми (ЛР №13-14: submit event)
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Запобігаємо стандартному відправленню

    let isFormValid = true;

    // Перевіряємо всі поля
    Object.keys(fields).forEach(function (key) {
      const field = fields[key];
      if (!field.input) return;

      const error = field.validate(field.input.value);
      if (error) {
        showError(field.input, field.error, error);
        isFormValid = false;
      } else {
        showSuccess(field.input, field.error);
      }
    });

    // Перевірка чекбоксу
    const privacyCheckbox = document.getElementById('privacy');
    if (privacyCheckbox && !privacyCheckbox.checked) {
      isFormValid = false;
      privacyCheckbox.style.outline = '2px solid #E74C3C';
    } else if (privacyCheckbox) {
      privacyCheckbox.style.outline = 'none';
    }

    if (isFormValid) {
      // Показуємо модальне вікно при успіху
      showModal();
      // Очищаємо форму
      contactForm.reset();
      // Скидаємо стилі полів
      Object.keys(fields).forEach(function (key) {
        const field = fields[key];
        if (field.input) clearState(field.input, field.error);
      });
    } else {
      // Прокрутка до першого поля з помилкою
      const firstError = contactForm.querySelector('.form__input.error, .form__select.error, .form__textarea.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
    }
  });
}

/* =========================================================
   5b. ПОВНА ФОРМА НА СТОРІНЦІ КОНТАКТІВ
   ========================================================= */
const contactFormFull = document.getElementById('contactFormFull');

if (contactFormFull) {
  // Мапа полів для повної форми
  const fullFields = [
    {
      id: 'cf_firstName',
      errorId: 'cf_firstNameError',
      validate: function (val) {
        if (!isNotEmpty(val, 2)) return "Вкажіть ваше ім'я (мінімум 2 символи)";
        return null;
      }
    },
    {
      id: 'cf_email',
      errorId: 'cf_emailError',
      validate: function (val) {
        if (!isNotEmpty(val)) return "Вкажіть email";
        if (!isValidEmail(val)) return "Некоректний формат email";
        return null;
      }
    },
    {
      id: 'cf_phone',
      errorId: 'cf_phoneError',
      validate: function (val) {
        if (!isNotEmpty(val)) return "Вкажіть номер телефону";
        if (!isValidPhone(val)) return "Мінімум 10 цифр (наприклад: +38 099 123 45 67)";
        return null;
      }
    },
    {
      id: 'cf_service',
      errorId: 'cf_serviceError',
      validate: function (val) {
        if (!val) return "Оберіть тип послуги";
        return null;
      }
    },
    {
      id: 'cf_message',
      errorId: 'cf_messageError',
      validate: function (val) {
        if (!isNotEmpty(val, 10)) return "Опишіть проект детальніше (мінімум 10 символів)";
        return null;
      }
    }
  ];

  // Додаємо валідацію в реальному часі для кожного поля
  fullFields.forEach(function (fieldDef) {
    const input = document.getElementById(fieldDef.id);
    const error = document.getElementById(fieldDef.errorId);
    if (!input) return;

    const eventType = input.tagName === 'SELECT' ? 'change' : 'input';

    input.addEventListener(eventType, function () {
      const err = fieldDef.validate(this.value);
      if (err) {
        showError(input, error, err);
      } else {
        showSuccess(input, error);
      }
    });
  });

  // Відправка повної форми
  contactFormFull.addEventListener('submit', function (event) {
    event.preventDefault();

    let isFormValid = true;

    // Валідуємо всі поля
    fullFields.forEach(function (fieldDef) {
      const input = document.getElementById(fieldDef.id);
      const error = document.getElementById(fieldDef.errorId);
      if (!input) return;

      const err = fieldDef.validate(input.value);
      if (err) {
        showError(input, error, err);
        isFormValid = false;
      } else {
        showSuccess(input, error);
      }
    });

    // Перевіряємо чекбокс згоди
    const privacy = document.getElementById('cf_privacy');
    const privacyError = document.getElementById('cf_privacyError');
    if (privacy && !privacy.checked) {
      isFormValid = false;
      if (privacyError) privacyError.classList.add('visible');
    } else if (privacy && privacyError) {
      privacyError.classList.remove('visible');
    }

    if (isFormValid) {
      showModal();
      contactFormFull.reset();
      // Скидаємо стилі полів
      fullFields.forEach(function (fieldDef) {
        const input = document.getElementById(fieldDef.id);
        const error = document.getElementById(fieldDef.errorId);
        if (input) clearState(input, error);
      });
    } else {
      // Фокус на перше поле з помилкою
      const firstError = contactFormFull.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
    }
  });
}

/* =========================================================
   6. МОДАЛЬНЕ ВІКНО (ЛР №13-14: показ / приховання, DOM)
   ========================================================= */
const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');

/**
 * Показує модальне вікно
 */
function showModal() {
  if (!modalOverlay) return;
  // Додаємо клас active через маніпуляцію DOM
  modalOverlay.classList.add('active');
  // Блокуємо прокрутку сторінки
  document.body.style.overflow = 'hidden';
}

/**
 * Приховує модальне вікно
 */
function hideModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('active');
  // Відновлюємо прокрутку
  document.body.style.overflow = '';
}

// Закриття по кнопці
if (modalClose) {
  modalClose.addEventListener('click', hideModal);
}

// Закриття по кліку на overlay
if (modalOverlay) {
  modalOverlay.addEventListener('click', function (event) {
    if (event.target === modalOverlay) {
      hideModal();
    }
  });
}

// Закриття по клавіші Escape
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    hideModal();
  }
});

/* =========================================================
   7. ФІЛЬТР ПОРТФОЛІО (ЛР №13-14: DOM, classList, filter)
   ========================================================= */
const filterButtons  = document.querySelectorAll('.portfolio__filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio__item');

filterButtons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    // Знімаємо active з усіх кнопок
    filterButtons.forEach(function (b) { b.classList.remove('active'); });
    // Додаємо active до натиснутої
    this.classList.add('active');

    const filter = this.getAttribute('data-filter');

    // Фільтруємо елементи (ЛР №13-14: DOM маніпуляції)
    portfolioItems.forEach(function (item) {
      const categories = item.getAttribute('data-category') || '';

      if (filter === 'all' || categories.includes(filter)) {
        item.style.display = '';
        // Анімація появи
        item.style.opacity = '0';
        setTimeout(function () { item.style.opacity = '1'; }, 50);
        item.style.transition = 'opacity 0.4s ease';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

/* =========================================================
   8. АНІМАЦІЯ ПРИ ПРОКРУТЦІ (Intersection Observer API)
   ========================================================= */
// Intersection Observer для плавної появи елементів
const animatedElements = document.querySelectorAll(
  '.service-card, .testimonial-card, .portfolio__item, .about__stat, .contact-page__info-card'
);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target); // Спостерігаємо лише один раз
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(function (el) {
    // Початковий стан
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

/* =========================================================
   9. ЛІЧИЛЬНИК АНІМАЦІЇ ДЛЯ СТАТИСТИКИ
   ========================================================= */
const statNumbers = document.querySelectorAll('.about__stat-number');

/**
 * Анімує число від 0 до кінцевого значення
 * @param {HTMLElement} el
 * @param {number} target
 * @param {string} suffix
 * @param {number} duration
 */
function animateCounter(el, target, suffix, duration) {
  let start = 0;
  const step = target / (duration / 16);

  const timer = setInterval(function () {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(start) + suffix;
  }, 16);
}

// Запускаємо лічильники при появі секції "Про нас"
const aboutSection = document.getElementById('about');
if (aboutSection && statNumbers.length > 0 && 'IntersectionObserver' in window) {
  let countersStarted = false;

  const statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        // 240+ проектів, 98% задоволених, 12 нагород
        const data = [
          { target: 240, suffix: '+' },
          { target: 98,  suffix: '%' },
          { target: 12,  suffix: ''  }
        ];
        statNumbers.forEach(function (el, index) {
          if (data[index]) {
            animateCounter(el, data[index].target, data[index].suffix, 1500);
          }
        });
      }
    });
  }, { threshold: 0.5 });

  statsObserver.observe(aboutSection);
}

/* =========================================================
   10. ТЕЛЕФОННА МАСКА ДЛЯ ПОЛЯ ТЕЛЕФОНУ
   ========================================================= */
const phoneInputs = document.querySelectorAll('input[type="tel"]');

phoneInputs.forEach(function (input) {
  input.addEventListener('input', function () {
    // Залишаємо тільки цифри та +
    let value = this.value.replace(/[^\d+]/g, '');

    // Форматуємо якщо починається з 38 або 0
    if (value.startsWith('380') && value.length > 3) {
      value = '+38 (0' + value.slice(3, 5) + ') ' +
              value.slice(5, 8) + '-' +
              value.slice(8, 10) + '-' +
              value.slice(10, 12);
    }
    this.value = value;
  });
});

/* =========================================================
   11. КОНСОЛЬ-ЛОГ ДЛЯ ПЕРЕВІРКИ (використовується при відлагодженні)
   ========================================================= */
console.log('%c Interior Studio — Білоус Владислав, К-31 ', 'background: #C4703F; color: white; padding: 4px 12px; border-radius: 4px;');
console.log('%c Курсова робота з WEB-технологій та WEB-дизайну ', 'color: #C4703F; font-style: italic;');
