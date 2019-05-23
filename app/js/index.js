import {fetch} from 'whatwg-fetch';

window.fetch = fetch;

// Скролл
var scrollButton = document.getElementById("scroll");

window.onscroll = function() {
  var y = window.pageYOffset;
  var minY = 800;
  if (y > minY) {
    scrollButton.style = "display: block";
  } else {
    scrollButton.style = "display: none";
  }
}

scrollButton.addEventListener("click", function() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
});
})

// Регулярное выражение для почты
var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Форма и элементы формы
var mailingForm = document.getElementsByClassName("mailing__form")[0];
var mailingInput = mailingForm.getElementsByClassName("mailing__form-input")[0];
var mailingCheckbox = mailingForm.getElementsByClassName("mailing__form-checkbox")[0];
var mailingButton = mailingForm.getElementsByClassName("mailing__form-submit")[0];

// Валидность
var isEmailValid = false;
var isChecked = false;

var isMessageShow = false;

// Валидация почты
function validateEmail(mailInput) {
  var value = mailInput.value;
  isEmailValid = emailPattern.test(value);
}

// Валидация чекбокса
function validateCheckbox(checkboxInput) {
  isChecked = checkboxInput.checked;
}

// Клик по кнопке
mailingButton.addEventListener("click", function(e) {
  e.preventDefault();

  validateEmail(mailingInput);
  validateCheckbox(mailingCheckbox);

  var isValid = isEmailValid && isChecked;

  if (isValid) {
    console.log("Рассылка на " + mailingInput.value + " подтверждена");
    var message = mailingForm.getElementsByClassName("invalid-form-message")[0];
    mailingButton.parentElement.removeChild(message);
    isMessageShow = false;

  } else {
    var message = "Введите корректую почту и согласитесь на рассылку"
    var messageContainer = document.createElement("article");
    messageContainer.classList.add("invalid-form-message");
    
    if (isMessageShow) {
    } else {
      messageContainer.innerHTML = message;
      mailingButton.parentElement.appendChild(messageContainer);
      isMessageShow = true;
    }
  }
});

// Сортировка
var sortByPriceLink = document.getElementById("by_price");

sortByPriceLink.addEventListener("click", function(e) {
  e.preventDefault();
  console.log(cardsData.sort(function(a, b) {
    if (a.price > b.price) {
      return 1;
    }
    if (a.price > b.price) {
      return -1;
    }
    return 0
  }));
})
// Контейнер карточек
var cardsWrapper = document.getElementsByClassName("cards__card-wrapper")[0];

function onFavBtnClick(btn) {
  btn.classList.toggle("cards__card-fav-button--fill");
}

// Отрисовка карточек
function showCards(cards) {
  cards.map(item => {
    var card = document.createElement("div");
    card.classList.add("cards__card");

    // Выбираем модификатор класса для обертки
    switch(item.status) {
      case "Свободно": {
        card.classList.add("cards__card--free");
        break
      }
      case "Продано": {
        card.classList.add("cards__card--saled");
        break
      }
      case "Забронировано": {
        card.classList.add("cards__card--booked");
      }
    }


    var imageWrapper = document.createElement("div");
    imageWrapper.classList.add("cards__card-image-wrapper");
    var image = document.createElement("img");
    image.classList.add("cards__card-img");
    image.setAttribute("src", item.img);
    image.setAttribute("alt", item.title);

    imageWrapper.appendChild(image);
    card.appendChild(imageWrapper);


    var title = document.createElement("h3");
    title.classList.add("cards__card-title");
    title.innerText = item.title;

    card.appendChild(title);


    var infoList = document.createElement("ul");
    infoList.classList.add("no-list", "x-list", "cards__card-list");
    var li1 = document.createElement("li");
    li1.classList.add("cards__card-list-item", "cards__card-list-item--blue");
    li1.innerText = item.info[0];
    var li2 = document.createElement("li");
    li2.classList.add("cards__card-list-item");
    li2.innerHTML = "<span class='f18'>"+item.info[1]+"<sup>2</sup></span><span class='f13'>площадь</span>"
    var li3 = document.createElement("li");
    li3.classList.add("cards__card-list-item");
    li3.innerHTML = "<span class='f18'>"+item.info[2]+"</span><span class='f13'>этаж</span>"
    infoList.appendChild(li1);
    infoList.appendChild(li2);
    infoList.appendChild(li3);

    card.appendChild(infoList);


    var price = document.createElement("span");
    price.classList.add("cards__card-price");
    price.innerText = item.price;

    card.appendChild(price);

    var status = document.createElement("span");
    status.classList.add("cards__card-status");
    status.innerText = item.status;

    card.appendChild(status);


    var offersList = document.createElement("ul");
    offersList.classList.add("cards__card-offer-list");
    if (item.offers.length > 0) {
      item.offers.map((offer) => {
        let offerLi = document.createElement("li");
        offerLi.innerText = offer;
        offersList.appendChild(offerLi);
      })
    }

    card.appendChild(offersList);

    var favBtn = document.createElement("button");
    favBtn.setAttribute("type", "button");
    favBtn.classList.add("cards__card-fav-button");
    if (item.favorite) {
      favBtn.classList.add("cards__card-fav-button--fill");
    }
    favBtn.addEventListener("click", function(e) { onFavBtnClick(e.target) });

    card.appendChild(favBtn);

    cardsWrapper.appendChild(card);
  })
}

// загружаем корректные карточки
cardsWrapper.innerHTML = "";
var cardsData = [];

fetch("/initialcards.json")
  .then(res => res.json())
  .then(data => {
    cardsData = data.cards;
    showCards(cardsData);
  })
  .catch(err => console.log(err));

// Кнопка загрузки карточек
var loadMoreCardsBtn = document.getElementsByClassName("cards__pagination-button")[0];

loadMoreCardsBtn.addEventListener("click", function(e) {
  e.preventDefault();
  fetch("/cards.json")
    .then((res) => res.json())
    .then(data => {
      cardsData = [...cardsData, ...data.cards];
      return data.cards
    })
    .then((cards) => {
      showCards(cards);
    })
    .catch(err => console.log(err));
})