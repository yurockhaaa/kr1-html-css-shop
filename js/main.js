// Получаем модальное окно по id.
// На страницах без модального окна (например, order.html) здесь будет null.
const orderDialog = document.getElementById('order-dialog');

// Получаем все кнопки заказа в карточках товаров.
const orderButtons = document.querySelectorAll('.product-card__button[data-product]');

// Получаем кнопку закрытия модального окна.
const closeDialogButton = document.getElementById('close-order-dialog');

// Получаем скрытое поле, в которое будет записан выбранный товар.
const selectedProductInput = document.getElementById('selected-product');

// Получаем форму заявки.
const orderForm = document.getElementById('order-form');

// Получаем сообщение об успешной отправке.
const successMessage = document.getElementById('success-message');

// Модальное окно настраиваем только если оно есть на странице.
if (orderDialog) {
  // Перебираем все кнопки «Заказать».
  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Получаем название товара из data-атрибута.
      const productName = button.dataset.product;

      // Записываем название товара в скрытое поле формы.
      if (selectedProductInput) {
        selectedProductInput.value = productName;
      }

      // Скрываем сообщение от предыдущей отправки.
      if (successMessage) {
        successMessage.hidden = true;
      }

      // Открываем модальное окно.
      orderDialog.showModal();
    });
  });

  // Закрываем модальное окно по кнопке «Закрыть».
  if (closeDialogButton) {
    closeDialogButton.addEventListener('click', () => {
      orderDialog.close();
    });
  }
}

// Обработку формы настраиваем только если форма есть на странице.
if (orderForm) {
  const formElements = Array.from(orderForm.elements);

  // Когда пользователь исправляет поле, убираем подсветку ошибки.
  formElements.forEach((element) => {
    element.addEventListener('input', () => {
      if (element.checkValidity()) {
        element.removeAttribute('aria-invalid');
      }
    });
  });

  // Обрабатываем отправку формы.
  orderForm.addEventListener('submit', (event) => {
    // Отменяем стандартную отправку формы,
    // потому что backend пока не подключён.
    event.preventDefault();

    // Сбрасываем предыдущие признаки ошибок.
    formElements.forEach((element) => {
      if (element.willValidate) {
        element.removeAttribute('aria-invalid');
      }
    });

    // Проверяем встроенные HTML-ограничения формы.
    if (!orderForm.checkValidity()) {
      formElements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          element.setAttribute('aria-invalid', 'true');
        }
      });

      // Показываем стандартные сообщения браузера.
      orderForm.reportValidity();
      return;
    }

    // Очищаем форму.
    orderForm.reset();

    // Закрываем модальное окно, если форма находится в нём.
    if (orderDialog) {
      orderDialog.close();
    }

    // Показываем сообщение об успешной отправке
    // и прокручиваем страницу к нему.
    if (successMessage) {
      successMessage.hidden = false;
      successMessage.scrollIntoView({ block: 'center' });
    }
  });
}
