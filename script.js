// ===== 1. МОБИЛЬНОЕ МЕНЮ =====
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => nav.classList.toggle('nav--open'));
nav.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => nav.classList.remove('nav--open'))
);


// ===== 2. КАЛЬКУЛЯТОР СТОИМОСТИ =====
const serviceSelect = document.getElementById('calc-service');
const peopleInput = document.getElementById('calc-people');
const peopleValue = document.getElementById('calc-people-value');
const zoneSelect = document.getElementById('calc-zone');
const totalEl = document.getElementById('calc-total');
const noteEl = document.getElementById('calc-note');

function calculate() {
  // Number(...) превращает текст из поля в число
  const price = Number(serviceSelect.value);
  const people = Number(peopleInput.value);
  const zone = Number(zoneSelect.value);

  // Первые двое платят полную цену, с третьего — скидка 10%
  const fullPrice = Math.min(people, 2) * price;
  const discounted = Math.max(people - 2, 0) * price * 0.9;
  const total = Math.round(fullPrice + discounted + zone);

  peopleValue.textContent = people;
  // toLocaleString добавляет пробелы между тысячами: 2 500
  totalEl.textContent = total.toLocaleString('ru-RU') + ' ₴';

  // Показываем, сколько сэкономил клиент
  const saved = Math.round(price * people - fullPrice - discounted);
  noteEl.textContent = saved > 0 ? `Скидка за компанию: −${saved.toLocaleString('ru-RU')} ₴` : '';
}

// Пересчитываем при любом изменении полей
[serviceSelect, peopleInput, zoneSelect].forEach((el) =>
  el.addEventListener('input', calculate)
);
calculate(); // первый расчёт при загрузке страницы


// ===== 3. FAQ — РАСКРЫВАЮЩИЕСЯ ОТВЕТЫ =====
document.querySelectorAll('.faq__item').forEach((item) => {
  const question = item.querySelector('.faq__question');
  const answer = item.querySelector('.faq__answer');

  question.addEventListener('click', () => {
    const isOpen = item.classList.toggle('faq__item--open');
    // scrollHeight — полная высота содержимого. Плавно раскрываем до неё
    answer.style.maxHeight = isOpen ? answer.scrollHeight + 'px' : '0';
  });
});


// ===== 4. ФОРМА ЗАПИСИ =====
const form = document.getElementById('booking-form');
const message = document.getElementById('form-message');

// Нельзя выбрать прошедшую дату
form.date.min = new Date().toISOString().split('T')[0];

form.addEventListener('submit', (e) => {
  e.preventDefault(); // не перезагружаем страницу

  const name = form.name.value.trim();
  const date = new Date(form.date.value).toLocaleDateString('ru-RU');
  message.textContent = `Спасибо, ${name}! Заявка на ${date} в ${form.time.value} принята. Скоро свяжусь с тобой.`;

  // ВАЖНО: пока заявка никуда не отправляется.
  // Следующий шаг — отправка в Telegram-бот барбера.

  form.reset();
});


// ===== 5. ГОД В ПОДВАЛЕ =====
document.getElementById('year').textContent = new Date().getFullYear();
