// ========================
// НАВИГАЦИЯ
// ========================

// Активная ссылка при скролле
const updateActiveLink = () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
};

// Мобильное меню
const initMobileMenu = () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navItems = document.querySelectorAll('.nav-item');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '60px';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.flexDirection = 'column';
        navMenu.style.gap = '0';
        navMenu.style.background = 'white';
        navMenu.style.zIndex = '999';
        navMenu.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.style.display = 'none';
        });
    });
};

// Плавная прокрутка при клике на ссылку навигации
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

// Функция для скролла к секции (используется в кнопке)
const scrollToSection = (id) => {
    const target = document.querySelector(`#${id}`);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
};

// ========================
// ФОРМА КОНТАКТОВ
// ========================

const initContactForm = () => {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Получаем данные формы
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');

        // Валидация
        if (!validateForm(name, email, message)) {
            return;
        }

        // Отправка (в реальном проекте здесь будет запрос на сервер)
        try {
            // Имитация отправки
            await simulateFormSubmit();

            // Успешно
            formMessage.textContent = '✓ Сообщение отправлено успешно! Спасибо за обращение.';
            formMessage.classList.add('success');
            formMessage.classList.remove('error');

            // Очистка формы
            contactForm.reset();
            clearFormErrors();

            // Скрытие сообщения через 5 секунд
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.classList.remove('success');
            }, 5000);

        } catch (error) {
            formMessage.textContent = '✗ Ошибка при отправке. Пожалуйста, попробуйте позже.';
            formMessage.classList.add('error');
            formMessage.classList.remove('success');
        }
    });
};

// Валидация формы
const validateForm = (nameInput, emailInput, messageInput) => {
    let isValid = true;

    // Очистка предыдущих ошибок
    clearFormErrors();

    // Проверка имени
    if (nameInput.value.trim() === '') {
        showError(nameInput, 'Пожалуйста, введите ваше имя');
        isValid = false;
    } else if (nameInput.value.trim().length < 2) {
        showError(nameInput, 'Имя должно содержать минимум 2 символа');
        isValid = false;
    }

    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value.trim() === '') {
        showError(emailInput, 'Пожалуйста, введите ваш email');
        isValid = false;
    } else if (!emailRegex.test(emailInput.value)) {
        showError(emailInput, 'Пожалуйста, введите корректный email');
        isValid = false;
    }

    // Проверка сообщения
    if (messageInput.value.trim() === '') {
        showError(messageInput, 'Пожалуйста, введите сообщение');
        isValid = false;
    } else if (messageInput.value.trim().length < 10) {
        showError(messageInput, 'Сообщение должно содержать минимум 10 символов');
        isValid = false;
    }

    return isValid;
};

// Показать ошибку
const showError = (input, message) => {
    input.classList.add('error');
    const errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
    }
};

// Очистить ошибки
const clearFormErrors = () => {
    const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
    inputs.forEach(input => {
        input.classList.remove('error');
        const errorElement = input.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
        }
    });
};

// Имитация отправки формы (в реальном проекте используется fetch или XMLHttpRequest)
const simulateFormSubmit = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
};

// ========================
// АНИМАЦИЯ ПРОГРЕСС-БАРОВ
// ========================

const initProgressBars = () => {
    const progressBars = document.querySelectorAll('.progress');
    
    const animateProgressBars = () => {
        progressBars.forEach(bar => {
            const rect = bar.parentElement.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !bar.classList.contains('animated')) {
                bar.classList.add('animated');
            }
        });
    };

    window.addEventListener('scroll', animateProgressBars);
    animateProgressBars(); // Запуск при загрузке страницы
};

// ========================
// АНИМАЦИЯ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ
// ========================

const initScrollAnimation = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Наблюдение за карточками
    document.querySelectorAll('.achievement-card, .project-card, .timeline-item').forEach(el => {
        observer.observe(el);
    });
};

// ========================
// ИНИЦИАЛИЗАЦИЯ
// ========================

document.addEventListener('DOMContentLoaded', () => {
    updateActiveLink();
    initMobileMenu();
    initSmoothScroll();
    initContactForm();
    initProgressBars();
    initScrollAnimation();

    // Добавляем слушатель на input для очистки ошибок
    const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.classList.remove('error');
            const errorElement = input.parentElement.querySelector('.error-message');
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
    });
});

// ========================
// ТЕМНАЯ ТЕМА (опционально)
// ========================

const initThemeToggle = () => {
    // Проверяем предпочтение пользователя
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-theme');
    }

    // Слушаем изменение предпочтений
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (e.matches) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    });
};

// Инициализация темы
window.addEventListener('load', initThemeToggle);

// ========================
// ДОПОЛНИТЕЛЬНЫЕ УТИЛИТЫ
// ========================

// Прокрутка до верхней части страницы
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.style.display = 'flex';
    }
});

// Отслеживание видимости элементов для lazy loading
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
};

// Инициализация lazy loading при загрузке
window.addEventListener('load', lazyLoadImages);

// ========================
// КОНСОЛЬ
// ========================

console.log('%c🚀 Портфолио загружено успешно!', 'color: #4F46E5; font-size: 14px; font-weight: bold;');
console.log('%cТехнологии: HTML5 | CSS3 | JavaScript ES6', 'color: #06B6D4; font-size: 12px;');
