document.addEventListener('DOMContentLoaded', () => {

  // Smooth scroll for links with [data-scroll]
  document.querySelectorAll('[data-scroll]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const targetHash = (el.getAttribute('href') || '').split('#')[1];
      if (!targetHash) return;
      const target = document.getElementById(targetHash);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Move focus for accessibility
        const focusable = target.querySelector('input, textarea, select, button, [tabindex]:not([tabindex="-1"])');
        if (focusable) setTimeout(() => focusable.focus(), 400);
      }
    });
  });

  initContactForm();
  initBranchSelector();

  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const fields = {
      name: {
        input: document.getElementById('name'),
        error: document.getElementById('name-error'),
        validate: (value) => {
          const v = value.trim();
          if (v.length === 0) return 'Este campo es obligatorio.';
          if (v.length < 3) return 'Debe tener al menos 3 caracteres.';
          return '';
        }
      },
      email: {
        input: document.getElementById('email'),
        error: document.getElementById('email-error'),
        validate: (value) => {
          const v = value.trim();
          if (v.length === 0) return 'Este campo es obligatorio.';
          const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
          if (!emailRe.test(v)) return 'Ingresá un email válido.';
          return '';
        }
      },
      areaCode: {
        input: document.getElementById('area-code'),
        error: document.getElementById('area-code-error'),
        validate: (value) => {
          const v = value.trim();
          if (v.length === 0) return 'Este campo es obligatorio.';
          if (!/^\d{2,5}$/.test(v)) return 'Ingresá un código válido.';
          return '';
        }
      },
      phone: {
        input: document.getElementById('phone'),
        error: document.getElementById('phone-error'),
        validate: (value) => {
          const v = value.trim();
          if (v.length === 0) return 'Este campo es obligatorio.';
          const phoneRe = /^[0-9+()\s-]+$/;
          if (!phoneRe.test(v)) return 'Solo dígitos, +, (), espacios y guiones.';
          return '';
        }
      },
      city: {
        input: document.getElementById('city'),
        error: document.getElementById('city-error'),
        validate: (value) => {
          if (!value) return 'Seleccioná una ciudad.';
          return '';
        }
      },
      birthdate: {
        input: document.getElementById('birthdate'),
        error: document.getElementById('birthdate-error'),
        validate: (value) => {
          if (!value) return '';
          const date = new Date(value);
          if (Number.isNaN(date.getTime())) return 'Ingresá una fecha válida.';
          if (date > new Date()) return 'La fecha no puede ser futura.';
          return '';
        }
      },
      message: {
        input: document.getElementById('message'),
        error: document.getElementById('message-error'),
        validate: (value) => {
          const v = value.trim();
          if (v.length > 500) return 'Máximo 500 caracteres.';
          return '';
        }
      },
      privacy: {
        input: document.getElementById('privacy'),
        error: document.getElementById('privacy-error'),
        validate: () => {
          const input = document.getElementById('privacy');
          if (!input || input.checked) return '';
          return 'Debés aceptar la Política de Privacidad.';
        }
      }
    };

    const successBanner = document.getElementById('success-banner');
    const messageCount = document.getElementById('message-count');

    function showError(key, msg) {
      const { input, error } = fields[key];
      if (!input || !error) return;
      error.textContent = msg;
      error.classList.toggle('hidden', !msg);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (msg) {
        input.setAttribute('aria-describedby', error.id);
        if (input.type !== 'checkbox') {
          input.classList.add('border-rose-500', 'focus:ring-rose-500');
        }
      } else {
        input.removeAttribute('aria-describedby');
        if (input.type !== 'checkbox') {
          input.classList.remove('border-rose-500', 'focus:ring-rose-500');
        }
      }
    }

    function validateField(key) {
      const { input, validate } = fields[key];
      if (!input) return true;
      const message = validate(input.value ?? '');
      showError(key, message);
      return !message;
    }

    Object.keys(fields).forEach((key) => {
      const { input } = fields[key];
      if (!input) return;
      const handler = () => {
        validateField(key);
        if (key === 'message' && messageCount) {
          messageCount.textContent = `${fields.message.input.value.length} / 500`;
        }
      };
      const eventName = input.type === 'checkbox' || input.tagName === 'SELECT' ? 'change' : 'input';
      input.addEventListener(eventName, handler);
    });

    if (fields.message.input && messageCount) {
      messageCount.textContent = `${fields.message.input.value.length} / 500`;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const results = Object.keys(fields).map((k) => validateField(k));
      const valid = results.every(Boolean);

      if (!valid) {
        for (const key of Object.keys(fields)) {
          const { input } = fields[key];
          if (input && input.getAttribute('aria-invalid') === 'true') {
            input.focus();
            break;
          }
        }
        return;
      }

      if (successBanner) {
        successBanner.classList.remove('hidden');
        successBanner.focus();
      }
      form.reset();
      Object.keys(fields).forEach((k) => showError(k, ''));
      if (messageCount) messageCount.textContent = '0 / 500';
    });
  }

  function initBranchSelector() {
    const select = document.getElementById('branch-select');
    const image = document.getElementById('branch-image');
    const title = document.getElementById('branch-title');
    const address = document.getElementById('branch-address');
    const schedule = document.getElementById('branch-schedule');
    const link = document.getElementById('branch-link');
    if (!select || !image || !title || !address || !schedule || !link) return;

    const branches = {
      'santa-fe': {
        title: 'Sede Central Sunchales',
        address: '25 de Mayo 201',
        schedule: 'Horarios de atención: 9.00 a 17.00',
        image: './assets/location_image_1.jpg',
        link: 'https://goo.gl/maps/abc123'
      },
      cordoba: {
        title: 'Centro Córdoba Capital',
        address: 'Bv. Illia 356',
        schedule: 'Horarios de atención: 8.30 a 16.30',
        image: './assets/location_image_1.jpg',
        link: 'https://goo.gl/maps/def456'
      },
      'buenos-aires': {
        title: 'Sucursal Buenos Aires',
        address: 'Av. Santa Fe 1234',
        schedule: 'Horarios de atención: 9.30 a 18.00',
        image: './assets/image_1.webp',
        link: 'https://goo.gl/maps/ghi789'
      }
    };

    const renderBranch = (key) => {
      const branch = branches[key] ?? branches['santa-fe'];
      title.textContent = branch.title;
      address.textContent = branch.address;
      schedule.textContent = branch.schedule;
      image.src = branch.image;
      image.alt = `Centro de atención ${branch.title}`;
      link.href = branch.link;
    };

    select.addEventListener('change', () => renderBranch(select.value));
    renderBranch(select.value);
  }
});

// Toggle menú mobile
const btn = document.getElementById("menu-toggle");
const menu = document.getElementById("mobile-menu");

if (btn && menu) {
  btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");

    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!expanded));
  });
}
