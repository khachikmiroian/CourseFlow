const toCurrency = (price) => {
  return new Intl.NumberFormat("ru-RU", {
    currency: "rub",
    style: "currency",
  }).format(price);
};

const toDate = (date) => {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(date));
};

// Преобразуем все элементы с классом .price в человекочитаемый формат
document.querySelectorAll(".price").forEach((node) => {
  node.textContent = toCurrency(node.textContent);
});

// Преобразуем все элементы с классом .date в формат даты
document.querySelectorAll(".date").forEach((node) => {
  node.textContent = toDate(node.textContent);
});

// Логика для корзины (карточки)
const $card = document.querySelector("#card");

if ($card) {
  $card.addEventListener("click", (event) => {
    if (event.target.classList.contains("js-remove")) {
      const id = event.target.dataset.id;
      const csrf = event.target.dataset.csrf;

      fetch("/card/remove/" + id, {
        method: "delete",
        headers: {
          "X-XSRF-TOKEN": csrf,
        },
      })
        .then((res) => res.json())
        .then((card) => {
          if (card.courses.length) {
            const html = card.courses
              .map((c) => {
                return `
                  <tr>
                    <td>${c.title}</td>
                    <td>${c.count}</td>
                    <td>
                      <button
                        class="btn btn-small js-remove"
                        data-id="${c.id}"
                        data-csrf="${csrf}"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                `;
              })
              .join("");
            $card.querySelector("tbody").innerHTML = html;
            $card.querySelector(".price").textContent = toCurrency(card.price);
          } else {
            $card.innerHTML = "<p>Card is empty</p>";
          }
        });
    }
  });
}

// Инициализация вкладок (MaterializeCSS)
M.Tabs.init(document.querySelectorAll(".tabs"));
