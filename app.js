/* ================================================
   STRK — app.js
   Логика: товары, фильтрация, модальное окно,
           скролл-анимации, регистрация
   ================================================ */

/* ========================
   ДАННЫЕ ТОВАРОВ
   Чтобы добавить товар — просто добавь объект в массив.
   Поля:
     id       — уникальный номер
     name     — название
     category — 'shoes' | 'clothes'
     price    — цена (число)
     oldPrice — старая цена (число или null)
     badge    — 'NEW' | 'SALE' | null
     img      — URL картинки (можно Unsplash или свои)
   ======================== */
const products = [
  {
    id: 1,
    name: 'Air Phantom Run X',
    category: 'shoes',
    price: 12900,
    oldPrice: 15900,
    badge: 'SALE',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'
  },
  {
    id: 2,
    name: 'Urban Edge Mid',
    category: 'shoes',
    price: 9500,
    oldPrice: null,
    badge: 'NEW',
    img: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80'
  },
  {
    id: 3,
    name: 'Cloud Stride Pro',
    category: 'shoes',
    price: 14200,
    oldPrice: null,
    badge: null,
    img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80'
  },
  {
    id: 4,
    name: 'Strike Hoodie',
    category: 'clothes',
    price: 5900,
    oldPrice: 7500,
    badge: 'SALE',
    img: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80'
  },
  {
    id: 5,
    name: 'Oversize Tee STRK',
    category: 'clothes',
    price: 2900,
    oldPrice: null,
    badge: 'NEW',
    img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'
  },
  {
    id: 6,
    name: 'Track Pants Elite',
    category: 'clothes',
    price: 6400,
    oldPrice: null,
    badge: null,
    img: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4d04?w=600&q=80'
  },
  {
    id: 7,
    name: 'Boost Racer V2',
    category: 'shoes',
    price: 11100,
    oldPrice: 13000,
    badge: 'SALE',
    img: 'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?w=600&q=80'
  },
  {
    id: 8,
    name: 'Sport Zip Jacket',
    category: 'clothes',
    price: 8700,
    oldPrice: null,
    badge: 'NEW',
    img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80'
  }
];

/* ========================
   ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
   ======================== */

/** Форматирование цены: 12900 → "12 900 ₽" */
function formatPrice(n) {
  return n.toLocaleString('ru-RU') + ' ₽';
}

/** Создаёт HTML-строку одной карточки товара */
function createCardHTML(product) {
  const badgeHTML = product.badge
    ? `<span class="card__badge">${product.badge}</span>`
    : '';

  const oldPriceHTML = product.oldPrice
    ? `<span>${formatPrice(product.oldPrice)}</span>`
    : '';

  const catLabel = product.category === 'shoes' ? 'Кроссовки' : 'Одежда';

  return `
    <article class="card" data-category="${product.category}" data-id="${product.id}">
      <div class="card__img-wrap">
        ${badgeHTML}
        <img
          src="${product.img}"
          alt="${product.name}"
          loading="lazy"
        />
      </div>
      <div class="card__body">
        <p class="card__cat">${catLabel}</p>
        <h3 class="card__name">${product.name}</h3>
        <div class="card__footer">
          <p class="card__price">
            ${formatPrice(product.price)}
            ${oldPriceHTML}
          </p>
          <button class="card__btn" data-id="${product.id}">Купить</button>
        </div>
      </div>
    </article>
  `;
}

/* ========================
   РЕНДЕР ТОВАРОВ
   ======================== */
const grid = document.getElementById('productsGrid');
let currentFilter = 'all'; // активный фильтр

/** Рендерит карточки с учётом фильтра и запускает анимацию */
function renderProducts(filter) {
  currentFilter = filter;

  // Фильтруем
  const filtered = filter === 'all'
    ? products
    : products.filter(p => p.category === filter);

  // Вставляем HTML
  grid.innerHTML = filtered.map(createCardHTML).join('');

  // Запускаем анимацию появления с задержкой
  animateCards();
}

/** Добавляет класс .visible каждой карточке с небольшой задержкой */
function animateCards() {
  const cards = grid.querySelectorAll('.card');
  cards.forEach((card, i) => {
    // setTimeout — лёгкая анимация без IntersectionObserver на первом рендере
    setTimeout(() => card.classList.add('visible'), i * 80);
  });
}

// Первый рендер при загрузке страницы
renderProducts('all');

/* ========================
   ФИЛЬТРЫ
   ======================== */
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Переключаем активную кнопку
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Рендерим с нужным фильтром
    renderProducts(btn.dataset.filter);
  });
});

/* ========================
   СКРОЛЛ-АНИМАЦИЯ КАРТОЧЕК
   (IntersectionObserver — производительно, без scroll-слушателя)
   ======================== */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // больше не следим
        }
      });
    },
    { threshold: 0.15 }
  );

  // Наблюдаем за всеми текущими карточками
  document.querySelectorAll('.card').forEach(card => observer.observe(card));
}

// Запускаем после первого рендера
// (при рефильтрации animateCards() заменяет наблюдение)
initScrollAnimations();

/* ========================
   ХЕДЕР — эффект при скролле
   ======================== */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true }); // passive — не блокирует скролл

/* ========================
   МОБИЛЬНЫЙ БУРГЕР
   ======================== */
const burger   = document.getElementById('burger');
const navMobile = document.getElementById('navMobile');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navMobile.classList.toggle('open');
});

// Закрываем меню при клике на ссылку
navMobile.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navMobile.classList.remove('open');
  });
});

/* ========================
   МОДАЛЬНОЕ ОКНО
   ======================== */
const modalOverlay = document.getElementById('modalOverlay');
const modal        = document.getElementById('modal');
const btnOpenModal = document.getElementById('btnOpenModal');
const modalClose   = document.getElementById('modalClose');

// Открыть
function openModal() {
  showStep('stepForm');      // Всегда показываем форму
  regForm.reset();           // Сбрасываем поля
  clearErrors();             // Убираем ошибки
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden'; // Запрещаем скролл страницы
}

// Закрыть
function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

btnOpenModal.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);

// Закрыть по клику вне окна
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Закрыть по Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
    closeModal();
  }
});

/* ========================
   ПЕРЕКЛЮЧЕНИЕ ШАГОВ МОДАЛА
   ======================== */
function showStep(stepId) {
  // Скрываем все шаги
  modal.querySelectorAll('.modal__step').forEach(s => s.classList.add('hidden'));
  // Показываем нужный
  document.getElementById(stepId).classList.remove('hidden');
}

/* ========================
   ФОРМА РЕГИСТРАЦИИ — ВАЛИДАЦИЯ
   ======================== */
const regForm    = document.getElementById('regForm');
const regName    = document.getElementById('regName');
const regEmail   = document.getElementById('regEmail');
const regPassword = document.getElementById('regPassword');

/** Показывает ошибку под полем */
function setError(inputEl, errId, msg) {
  inputEl.classList.add('error');
  document.getElementById(errId).textContent = msg;
}

/** Убирает ошибку */
function clearError(inputEl, errId) {
  inputEl.classList.remove('error');
  document.getElementById(errId).textContent = '';
}

/** Сбрасывает все ошибки */
function clearErrors() {
  clearError(regName,     'errName');
  clearError(regEmail,    'errEmail');
  clearError(regPassword, 'errPassword');
}

/** Простая проверка email через регулярку */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Валидирует форму, возвращает true если всё ок */
function validateForm() {
  let valid = true;
  clearErrors();

  if (regName.value.trim().length < 2) {
    setError(regName, 'errName', 'Введите имя (минимум 2 символа)');
    valid = false;
  }
  if (!isValidEmail(regEmail.value.trim())) {
    setError(regEmail, 'errEmail', 'Введите корректный email');
    valid = false;
  }
  if (regPassword.value.length < 6) {
    setError(regPassword, 'errPassword', 'Пароль должен быть минимум 6 символов');
    valid = false;
  }

  return valid;
}

/* Отправка формы */
regForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  // 1. Показываем загрузку
  showStep('stepLoading');

  // 2. Имитируем запрос к серверу (1.5 сек)
  setTimeout(() => {
    // 3. Показываем успех
    showStep('stepSuccess');
  }, 1500);
});

/* ========================
   КНОПКА "НА ГЛАВНУЮ" (в success экране)
   ======================== */
document.getElementById('btnHome').addEventListener('click', closeModal);

/* ========================
   ПОКАЗАТЬ/СКРЫТЬ ПАРОЛЬ
   ======================== */
const togglePass = document.getElementById('togglePass');

togglePass.addEventListener('click', () => {
  const isPass = regPassword.type === 'password';
  regPassword.type = isPass ? 'text' : 'password';
  // Меняем прозрачность иконки
  togglePass.style.opacity = isPass ? '1' : '0.5';
});

/* ========================
   БАННЕР — кнопка
   ======================== */
document.getElementById('bannerBtn').addEventListener('click', () => {
  // При желании — открывает модал или ведёт на страницу
  openModal();
});

/* ========================
   КНОПКИ "КУПИТЬ" НА КАРТОЧКАХ
   (делегирование — один слушатель на весь grid)
   ======================== */
grid.addEventListener('click', (e) => {
  const btn = e.target.closest('.card__btn');
  if (!btn) return;

  const id = parseInt(btn.dataset.id);
  const product = products.find(p => p.id === id);
  if (!product) return;

  // Анимация нажатия
  btn.textContent = '✓ Добавлено';
  btn.style.background = '#22c55e';
  btn.style.borderColor = '#22c55e';

  setTimeout(() => {
    btn.textContent = 'Купить';
    btn.style.background = '';
    btn.style.borderColor = '';
  }, 1500);

  console.log(`Добавлен в корзину: ${product.name} — ${formatPrice(product.price)}`);
});
