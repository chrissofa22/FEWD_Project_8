function mainConst(doc, overlay, state, loader, uData, bClick, bKey) {
  return () => {
    doc.getElementById("main").addEventListener("click", () => {
      overlay(false);
      state.mClear = false;
      doc.getElementById("mEmployee").style.display = "none";
    });
    loader(true);
    fetch("https://randomuser.me/api/?results=12&nat=us").then(response => response.json()).then(data => {
      state.employee = [...data.results];
      loader(false);
      uData(data.results);
      bClick();
      bKey();
    }).catch(error => console.error(error));
  };
}
const stateL = {
  employee: undefined,sEmployee:undefined,mClear:undefined,fEmployee:false,organEmployee:undefined
};
(doc => {
  const couple = (elementToBindTo, eventName, event) => elementToBindTo.addEventListener(eventName, event);
  const upperString = string => string[0].toUpperCase() + string.substr(1);
  const eGrid = employee => {
    let gColumn = "";
    gColumn += employee.map(
      (user, index) => `<figure class="user-container" id="${index}">
          <div><img src="${user.picture.large}" alt=""></div>
          <figcaption><h1>${upperString(user.name.first)} ${upperString(user.name.last)}</h1><h3>${user.email}</h3><h3>${upperString(user.location.city)}</h3>
          </figcaption></figure>`);
    return gColumn.replace(/,/g, "");
  };
  const state = stateL;
  const frSearch = event => {
    state.fEmployee = event.target.value.length > 0;
    state.organEmployee = state.employee.filter(userdata => {
      const fullName = `${userdata.name.first} ${userdata.name.last}`;
      if (fullName.toLowerCase().includes(event.target.value) || userdata.login.username.toLowerCase().includes(event.target.value)) {
        return userdata;
      }
      return null;
    });
    uData(state.organEmployee);
  };
  const uData = employee => {
    doc.getElementById("combEmployee").innerHTML = eGrid(employee);
    bClick();
  };
  const escKey = event => {
    if (event.keyCode === 27) {
      state.mClear = false;
      doc.getElementById("mEmployee").style.display = "none";
      overlay(false);
    }
  };
  const modalWindow = user => {
    const birthDayRaw = new Date(user.dob.date);
    const birthDay = birthDayRaw.toLocaleDateString("en-US");
    couple(window, "keydown", escKey);
    return `<section class="close-btn" id="close-btn">&times;</section><section class="main-row-container"><section class="left-arrow-container"><i class="modal-arrow-left"></i></section><section class="main-modal-content"><section class="user-img"><img src="${user.picture.large}" alt=""></section><section class="user-main-data"><p class="user-name">${upperString(user.name.first)} ${upperString(user.name.last)}</p><p class="user-mail">${user.email}</p><p class="user-area">${upperString(user.location.city)}</p></section><hr class="modal-divider"><section class="user-details"><p class="user-phone">${user.phone}</p><p class="user-address">${user.location.street.number} ${user.location.street.name}, OR ${user.location.postcode}</p><p class="user-bday">Birthday: ${birthDay}</p></section></section><section class="right-arrow-container"><i class="modal-arrow-right"></i></section></section>`;
  };
  const closeButton = () => {
    doc.getElementById("mEmployee").style.display = "none";
    state.mClear = false;
    overlay(false);
  };
  const leftArrow = () => {
    let currentUser;
    if (state.fEmployee) {
      currentUser = parseInt(state.sEmployee, 10) !== 0 ? parseInt(state.sEmployee, 10) - 1 : state.organEmployee.length - 1;
    } else {
      currentUser = parseInt(state.sEmployee, 10) !== 0 ? parseInt(state.sEmployee, 10) - 1 : state.employee.length - 1;
    }
    iData(currentUser);
  };
  const rightArrow = () => {
    let currentUser;
    if (state.fEmployee) {
      currentUser = parseInt(state.sEmployee, 10) < state.organEmployee.length - 1 ? parseInt(state.sEmployee, 10) + 1 : 0;
    } else {
      currentUser = parseInt(state.sEmployee, 10) < state.employee.length - 1 ? parseInt(state.sEmployee, 10) + 1 : 0;
    }
    iData(currentUser);
  };
  const iData = dataConst(doc, state, modalWindow, couple, leftArrow, rightArrow, closeButton);
  const cardClickHandler = event => {
    overlay(true);
    if (event.target.id) {
      iData(event.target.id);
    } else if (event.target.parentNode.id) {
      iData(event.target.parentNode.id);
    } else if (event.target.parentNode.parentNode.id) {
      iData(event.target.parentNode.parentNode.id);
    }
  };
  const bClick = () => {
    const userCards = doc.getElementsByClassName("user-container");
    for (let i = 0; i < userCards.length; i++) {
      couple(userCards[i], "click", cardClickHandler, true);
    }
  };
  const bKey = () => {
    const filterInput = doc.getElementById("search");
    couple(filterInput, "keyup", frSearch);
  };
  const windowLoaderTemplate = () => {
    return `<div></div><div></div><div></div><div></div><div></div><div></div<div></div><div></div><div></div><div></div><div></div><div></div></div></div>`;
  };
  const loader = enable => {
    if (enable) {
      doc.getElementById("combEmployee").innerHTML = windowLoaderTemplate();
    } else {
      doc.getElementById("combEmployee").innerHTML = "";
    }
  };
  const overlay = enable => {
    if (enable) {
      doc.getElementById("main").classList.add("main");
    } else {
      doc.getElementById("main").classList.remove("main");
    }
  };
  const main = mainConst(doc, overlay, state, loader, uData, bClick, bKey);
  main();
})(document);

function dataConst(doc, state, modalWindow, couple, leftArrow, rightArrow, closeButton) {
  return userId => {
    const uModal = doc.getElementById("mEmployee");
    state.mClear = true;
    state.sEmployee = userId;
    if (state.organEmployee) {
      uModal.innerHTML = modalWindow(state.organEmployee[state.sEmployee]);
    }
    else {
      uModal.innerHTML = modalWindow(state.employee[state.sEmployee]);
    }
    uModal.style.display = "flex";
    couple(doc.getElementsByClassName("modal-arrow-left")[0], "click", leftArrow);
    couple(doc.getElementsByClassName("modal-arrow-right")[0], "click", rightArrow);
    couple(doc.getElementById("close-btn"), "click", closeButton);
  };
}