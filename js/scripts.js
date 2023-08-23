const API_URL = "https://workspace-methed.vercel.app/";
const LOCATION_URL = "api/locations";
const VACANCY_URL = "api/vacancy";

const cardsList = document.querySelector(".cards__list");

const getData = async (url, cbSuccess, cbError) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    cbSuccess(data);
  } catch (err) {
    cbError(err);
  }
};

const createCard = (vacancy) => `
  <article class="vacancy" tabindex="0" data-id="${vacancy.id}">
  <img src="${API_URL}${vacancy.logo}" alt="Логотоип компании ${
  vacancy.company
}" class="vacancy__img">
  <p class="vacancy__company">${vacancy.company}</p>
  <h3 class="vacancy__title">${vacancy.title}</h3>
  <ul class="vacancy__fields">
    <li class="vacancy__field">от ${parseInt(
      vacancy.salary
    ).toLocaleString()}₽</li>
    <li class="vacancy__field">${vacancy.type}</li>
    <li class="vacancy__field">${vacancy.format}</li>
    <li class="vacancy__field">${vacancy.experience}</li>
  </ul>
  </article>
`;

const createCards = (data) =>
  data.vacancies.map((vacancy) => {
    const li = document.createElement("li");
    li.classList.add("cards__item");
    li.insertAdjacentHTML("beforeend", createCard(vacancy));
    return li;
  });

const rebederVacancy = (data, cardsList) => {
  cardsList.textContent = "";
  const cards = createCards(data);
  cardsList.append(...cards);
};

const renderError = (err) => {
  console.warn(err);
};

const createDetailVacancy = ({
  id,
  company,
  description,
  email,
  experience,
  format,
  location,
  logo,
  salary,
  title,
  type,}) => `
  <article class="info">          
    <div class="info__top">
      <img src="${API_URL}${logo}" alt="Логотип компании ${company}" class="info__logo">
      <div class="info__wrapper-top">
        <p class="info__company">${company}</p>
        <h3 class="info__title">${title}</h3>
      </div>
    </div>
    <div class="info__main">
      <div class="info__texts">
        <p class="info__text">${description.replaceAll("\n", "<br>")}</p>  
      </div>
      <ul class="info__conditions">
        <li class="info__condition">от ${parseInt(salary).toLocaleString()}₽</li>
        <li class="info__condition">${type}</li>
        <li class="info__condition">${format}</li>
        <li class="info__condition">${experience}</li>
        <li class="info__condition">${location}</li>
      </ul>
    </div>
    <div class="info__bottom">
      <p class="info__contact">Отправляйте резюме на
        <a href="mailto:CreativePeople@gmail.com${email}" class="info__link blue-text">${email}</a>
      </p>
    </div>
    <img src="img/likemen.png" alt="Показывающий лайк" class="info__likemen">
  </article>
`;

const renderModal = (data) => {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  const modalMain = document.createElement("div");
  modalMain.classList.add("modal__body");
  const modalClose = document.createElement("button");
  modalClose.classList.add("modal__close")
  modalClose.innerHTML = `
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="Property 1=hover" clip-path="url(#clip0_28_4089)">
      <path id="Vector" d="M10.7833 10L15.3889 5.39444C15.4799 5.28816 15.5275 5.15145 15.5221 5.01163C15.5167 4.87181 15.4587 4.73918 15.3598 4.64024C15.2608 4.5413 15.1282 4.48334 14.9884 4.47794C14.8486 4.47254 14.7118 4.52009 14.6056 4.61111L10 9.21666L5.39446 4.60555C5.28984 4.50094 5.14796 4.44217 5.00001 4.44217C4.85207 4.44217 4.71018 4.50094 4.60557 4.60555C4.50095 4.71017 4.44218 4.85205 4.44218 5C4.44218 5.14794 4.50095 5.28983 4.60557 5.39444L9.21668 10L4.60557 14.6056C4.54741 14.6554 4.50018 14.7166 4.46683 14.7856C4.43349 14.8545 4.41475 14.9296 4.41179 15.0061C4.40884 15.0826 4.42173 15.1589 4.44966 15.2302C4.47759 15.3015 4.51995 15.3662 4.5741 15.4204C4.62824 15.4745 4.69299 15.5169 4.76428 15.5448C4.83557 15.5727 4.91186 15.5856 4.98838 15.5827C5.06489 15.5797 5.13996 15.561 5.20888 15.5276C5.27781 15.4943 5.3391 15.447 5.3889 15.3889L10 10.7833L14.6056 15.3889C14.7118 15.4799 14.8486 15.5275 14.9884 15.5221C15.1282 15.5167 15.2608 15.4587 15.3598 15.3598C15.4587 15.2608 15.5167 15.1282 15.5221 14.9884C15.5275 14.8485 15.4799 14.7118 15.3889 14.6056L10.7833 10Z" fill="currentColor"/>
    </g>
    <defs>
      <clipPath id="clip0_28_4089">
      <rect width="20" height="20" fill="white"/>
      </clipPath>
    </defs>
  </svg>
  `;
  modalMain.innerHTML = createDetailVacancy(data);
  modalMain.append(modalClose);
  modal.append(modalMain);
  document.body.append(modal);
  modal.addEventListener("click", ({target})=>{
    if( target == modal || target.closest("button") == modalClose){
      document.body.removeChild(modal);
    }
  });
};

const openModal = (id) => {
  getData(`${API_URL}${VACANCY_URL}/${id}`, renderModal, renderError);
};

const init = () => {
  //select city
  const citySelect = document.querySelector("#city");
  const cityChoices = new Choices(citySelect, {
    itemSelectText: "",
    allowHTML: "true",
  });
  getData(
    `${API_URL}${LOCATION_URL}`,
    (locationData) => {
      const locations = locationData.map((location) => ({
        value: location,
      }));
      cityChoices.setChoices(locations, "value", "label", true);
    },
    (err) => console.log(err)
  );

  //cards
  const url = new URL(`${API_URL}${VACANCY_URL}`);
  getData(
    url,
    (data) => {
      rebederVacancy(data, cardsList);
    },
    renderError
  );

  cardsList.addEventListener("click", ({ target }) => {
    const vacancyCard = target.closest(".vacancy");
    if (vacancyCard) {
      const vacancyId = vacancyCard.dataset.id;
      openModal(vacancyId);
    }
  });
};

init();
