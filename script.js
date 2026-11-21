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

// АДРЕС, КУДА ОТПРАВЛЯТЬ ЗАЯВКИ.
// Это ссылка на твой Cloudflare Worker (см. папку telegram-worker).
// Пока строка пустая, сайт работает в демо-режиме: заявка никуда не уходит.
// Пример: const FORM_ENDPOINT = 'https://barber-form.legion1302.workers.dev';
const FORM_ENDPOINT = 'https://barber-form.mborisovic66.workers.dev';

const form = document.getElementById('booking-form');
const message = document.getElementById('form-message');
const button = document.getElementById('form-button');

// Нельзя выбрать прошедшую дату
form.date.min = new Date().toISOString().split('T')[0];

// Показ сообщения под формой (isError — красным цветом)
function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle('form__message--error', isError);
}

// async — функция умеет «ждать» ответа от сервера через await
form.addEventListener('submit', async (e) => {
  e.preventDefault(); // не перезагружаем страницу

  // Если бот заполнил скрытое поле-ловушку — молча ничего не делаем
  if (form.website.value) return;

  // Проверяем телефон: оставляем только цифры, их должно быть 10–12
  const digits = form.phone.value.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 12) {
    showMessage('Проверь номер телефона: например, +380 67 123 45 67', true);
    form.phone.focus();
    return;
  }

  // Собираем данные формы в объект
  const data = {
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    address: form.address.value.trim(),
    date: new Date(form.date.value).toLocaleDateString('ru-RU'),
    time: form.time.value,
    service: form.service.value,
  };

  // Демо-режим: адрес не указан
  if (!FORM_ENDPOINT) {
    showMessage(`Спасибо, ${data.name}! (Демо-режим: заявка не отправлена — подключи Telegram в script.js)`);
    form.reset();
    return;
  }

  // Блокируем кнопку, чтобы заявку не отправили дважды
  button.disabled = true;
  button.textContent = 'Отправляем…';

  try {
    // fetch отправляет данные на сервер, await ждёт ответа
    const response = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Сервер ответил ошибкой');

    showMessage(`Спасибо, ${data.name}! Заявка на ${data.date} в ${data.time} принята. Скоро перезвоню.`);
    form.reset();
  } catch (error) {
    // Сюда попадаем, если нет интернета или сервер не ответил
    showMessage('Не получилось отправить заявку. Позвони или напиши в Telegram.', true);
  } finally {
    // finally выполняется в любом случае — возвращаем кнопку
    button.disabled = false;
    button.textContent = 'Отправить заявку';
  }
});


// ===== 4.1 ГАЛЕРЕЯ — ПРОСМОТР ФОТО КРУПНО =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

document.querySelectorAll('.gallery__item').forEach((item) => {
  item.addEventListener('click', () => {
    // Берём большую версию фото из атрибута data-full
    lightboxImg.src = item.dataset.full;
    lightboxImg.alt = item.querySelector('img').alt;
    lightbox.showModal(); // открываем окно
  });
});

// Закрываем по крестику или по клику на тёмный фон вокруг фото
lightbox.addEventListener('click', (e) => {
  if (e.target !== lightboxImg) lightbox.close();
});


// ===== 5. ГОД В ПОДВАЛЕ =====
document.getElementById('year').textContent = new Date().getFullYear();
