// Плавная прокрутка
document.querySelectorAll('.nav-links a, .cta-button').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Burger menu
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
if (burger) {
    burger.addEventListener('click', () => navLinks.classList.toggle('active'));
}

// Слайдер
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const slider = document.querySelector('.slider');

function updateSlider() {
    if (slider) {
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
}

document.querySelector('.prev')?.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
});
document.querySelector('.next')?.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
});

// Анимация появления
const sections = document.querySelectorAll('.section');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.2 });
sections.forEach(section => {
    section.classList.add('fade-section');
    observer.observe(section);
});

// Отправка формы (сбор всех данных)
const form = document.getElementById('ai-feedback-form');
const messageDiv = document.getElementById('form-message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const usage = document.querySelector('input[name="usage_frequency"]:checked');
    const future = document.querySelector('input[name="future_fears"]:checked');
    const impactArea = document.querySelector('select[name="impact_area"]').value;
    const ageGroup = document.querySelector('select[name="age_group"]').value;
    
    const tools = Array.from(document.querySelectorAll('input[name="ai_tools"]:checked')).map(cb => cb.value);
    
    if (!usage) {
        messageDiv.textContent = 'Пожалуйста, выберите частоту использования ИИ.';
        messageDiv.style.color = '#ffaa88';
        return;
    }
    if (!future) {
        messageDiv.textContent = 'Пожалуйста, выберите, что вас беспокоит в будущем ИИ.';
        messageDiv.style.color = '#ffaa88';
        return;
    }
    
    const payload = {
        usage_frequency: usage.value,
        ai_tools: tools.join(', '),
        impact_area: impactArea,
        future_fears: future.value,
        age_group: ageGroup
    };
    
    try {
        const response = await fetch('/submit-feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (response.ok) {
            messageDiv.textContent = result.message;
            messageDiv.style.color = '#a0ffc0';
            form.reset();
        } else {
            messageDiv.textContent = 'Ошибка: ' + result.message;
        }
    } catch (err) {
        messageDiv.textContent = 'Ошибка соединения с сервером.';
    }
    setTimeout(() => { messageDiv.textContent = ''; }, 4000);
});