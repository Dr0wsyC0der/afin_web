// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function () {
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Обработка форм
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Здесь будет отправка данных в CRM
            console.log('Данные формы:', data);

            // Показываем сообщение об успехе
            showSuccessMessage('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
            this.reset();
        });
    });

    // Мобильное меню
    createMobileMenu();

    // Активная навигация при скролле
    window.addEventListener('scroll', updateActiveNav);

    // Инициализация табов на странице решений
    initIndustryTabs();
});

// Функция для мобильного меню
function createMobileMenu() {
    const nav = document.querySelector('.nav-menu');
    const navContainer = document.querySelector('.nav');
    if (!nav || !navContainer) return;

    // Удаляем старый toggle
    document.querySelectorAll('.mobile-toggle').forEach(el => el.remove());

    const toggle = document.createElement('button');
    toggle.className = 'mobile-toggle';
    toggle.setAttribute('aria-label', 'Меню');
    toggle.innerHTML = `
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
    `;
    navContainer.appendChild(toggle);

    // Клик по бургеру
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        document.body.classList.toggle('menu-open');
        nav.classList.toggle('active');
        toggle.classList.toggle('open');
    });

    // Закрытие при клике вне
    document.addEventListener('click', (e) => {
        if (!navContainer.contains(e.target)) {
            closeMenu();
        }
    });

    // Закрытие по ссылкам
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    function closeMenu() {
        document.body.classList.remove('menu-open');
        nav.classList.remove('active');
        toggle.classList.remove('open');
    }

    // Ресайз
    function handleResize() {
        if (window.innerWidth > 900) {
            closeMenu();
            toggle.style.display = 'none';
        } else {
            toggle.style.display = 'flex';
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize();
}

// Обновление активной навигации
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    let current = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${current}` || (current === '' && href === '#home')) {
            link.classList.add('active');
        }
    });
}

// Инициализация табов для отраслей
function initIndustryTabs() {
    const industryTabs = document.querySelectorAll('.industry-tab');
    if (industryTabs.length === 0) return;

    industryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Удаляем активный класс со всех табов и контента
            document.querySelectorAll('.industry-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.industry-content').forEach(c => c.classList.remove('active'));
            document.querySelectorAll('.industry-form').forEach(f => f.classList.remove('active'));

            // Добавляем активный класс к clicked табу
            tab.classList.add('active');

            // Показываем соответствующий контент
            const industry = tab.dataset.industry;
            const content = document.getElementById(industry);
            const form = document.getElementById(industry + '-form');

            if (content) content.classList.add('active');
            if (form) form.classList.add('active');
        });
    });
}

// Показ сообщений
function showSuccessMessage(message) {
    // Создаем элемент сообщения
    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 300px;
    `;
    messageEl.textContent = message;

    document.body.appendChild(messageEl);

    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        messageEl.remove();
    }, 5000);
}

// Трекинг событий для аналитики
function trackEvent(eventName, data = {}) {
    // Интеграция с Яндекс.Метрикой
    if (window.ym) {
        window.ym(XXXXXX, 'reachGoal', eventName, data); // Замените XXXXXX на ID вашей метрики
    }

    // Интеграция с Google Analytics
    if (window.gtag) {
        window.gtag('event', eventName, data);
    }

    console.log(`Tracking: ${eventName}`, data);
}

// Трекинг кликов по CTA кнопкам
document.addEventListener('click', function (e) {
    if (e.target.matches('.btn-demo, .btn-primary, .btn-secondary')) {
        trackEvent('cta_click', {
            button_text: e.target.textContent,
            button_type: e.target.className,
            page: window.location.pathname
        });
    }
});

// Трекинг отправки форм
document.addEventListener('submit', function (e) {
    if (e.target.matches('form')) {
        trackEvent('form_submit', {
            form_id: e.target.id || 'unknown',
            form_type: 'lead_capture',
            page: window.location.pathname
        });
    }
});

// Обработка ошибок
window.addEventListener('error', function (e) {
    console.error('JavaScript Error:', e.error);
    trackEvent('javascript_error', {
        message: e.error?.message,
        file: e.filename,
        line: e.lineno
    });
});
// Оптимизация для мобильных устройств
function optimizeForMobile() {
    // Предотвращение двойного тапа для увеличения
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Улучшение скролла на iOS
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    window.addEventListener('resize', () => {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    });
}

// Оптимизация загрузки изображений для мобильных
function optimizeImages() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Обновленный createMobileMenu с оптимизациями
function createMobileMenu() {
    // ... существующий код ...
    
    // Добавьте это в конец функции:
    
    // Предотвращение скролла при открытом меню
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = document.body.classList.toggle('menu-open');
        
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
    });
    
    // Закрытие меню при повороте устройства
    window.addEventListener('orientationchange', closeMenu);
}

// Вызовите эти функции при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // ... существующий код ...
    
    optimizeForMobile();
    optimizeImages();
});