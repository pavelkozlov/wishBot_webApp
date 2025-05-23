document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('giftForm');
    const fields = {
        title: {
            element: document.getElementById('title'),
            error: document.getElementById('titleError'),
            validate: val => val && val.length <= 500
        },
        description: {
            element: document.getElementById('description'),
            error: document.getElementById('descriptionError'),
            validate: val => val.length <= 1000
        },
        price: {
            element: document.getElementById('price'),
            error: document.getElementById('priceError'),
            validate: val => !val || (!isNaN(val) && BigInt(val) <= BigInt('9223372036854775807'))
        },
        link: {
            element: document.getElementById('link'),
            error: document.getElementById('linkError'),
            validate: val => !val || /^https?:\/\/.+\..+/.test(val)
        }
    };

    let currency = '';
    const currencyButtons = document.querySelectorAll('.currency');
    const currencyError = document.getElementById('currencyError');

    currencyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currencyButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            currency = btn.dataset.value;
        });
    });

    const imageInput = document.getElementById('image');
    const imagePreview = document.getElementById('imagePreview');
    imageInput.addEventListener('change', () => {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        let isValid = true;
        for (let key in fields) {
            const { element, error, validate } = fields[key];
            const value = element.value.trim();
            const valid = validate(value);
            error.textContent = valid ? '' : 'Неверное значение';
            isValid &= valid;
        }

        if (!currency) {
            currencyError.textContent = 'Выберите валюту';
            isValid = false;
        } else {
            currencyError.textContent = '';
        }

        if (!isValid) return;

        const data = {
            title: fields.title.element.value.trim(),
            description: fields.description.element.value.trim(),
            price: fields.price.element.value.trim(),
            currency: currency,
            link: fields.link.element.value.trim(),
            image: imageInput.files[0] ? imageInput.files[0].name : null // Сохраняем только имя файла
        };

        const jsonData = JSON.stringify(data);

        try {
            // const response = await fetch('/upload', {
            //     method: 'POST',
            //     body: data
            // });
            // const result = await response.json();
            if (window.Telegram.WebApp) {
                // alert(window.Telegram.WebApp.initData)
                alert("data:",jsonData)
                window.Telegram.WebApp.sendData(jsonData);
            } else {
                alert('Telegram API недоступен');
            }
        } catch (err) {
            alert('Ошибка отправки: ' + err.message);
        }
    });
});