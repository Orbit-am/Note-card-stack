// Select DOM Elements
const addBtn = document.querySelector(".addNote");
const closeBtn = document.querySelector(".close-btn");
const modalOverlay = document.querySelector(".modal-overlay");
const callForm = document.querySelector("#callForm");

// Text Input Fields
const imageUrlInput = document.querySelector("#imageUrl");
const fullNameInput = document.querySelector("#fullName");
const homeTownInput = document.querySelector("#homeTown");
const purposeInput = document.querySelector("#purpose");

// Radio Buttons
const categoryRadios = document.querySelectorAll('input[name="category"]');

// Card Stack & Navigation
const stackWrapper = document.querySelector(".stack-wrapper");
const upBtn = document.querySelector(".upBtn");
const downBtn = document.querySelector(".downBtn");

// Save task to LocalStorage
function saveToLocalStorage(obj) {
  const oldTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  oldTasks.push(obj);
  localStorage.setItem("tasks", JSON.stringify(oldTasks));
}

// Open & Close Modal
if (addBtn) {
  addBtn.addEventListener("click", () => {
    modalOverlay.classList.add("active");
  });
}

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    modalOverlay.classList.remove("active");
  });
}

// Form Submission
callForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  let selectedCategory = false;
  categoryRadios.forEach((radio) => {
    if (radio.checked) {
      selectedCategory = radio.value;
    }
  });

  if (imageUrlInput.value.trim() === "") {
    alert("Please provide an Image URL.");
    imageUrlInput.focus();
    return;
  }

  if (fullNameInput.value.trim() === "") {
    alert("Please enter the Full Name.");
    fullNameInput.focus();
    return;
  }

  if (homeTownInput.value.trim() === "") {
    alert("Please enter the Home Town.");
    homeTownInput.focus();
    return;
  }

  if (purposeInput.value.trim() === "") {
    alert("Please enter the Purpose.");
    purposeInput.focus();
    return;
  }

  if (!selectedCategory) {
    alert("Please select a Category.");
    return;
  }

  saveToLocalStorage({
    fullName: fullNameInput.value.trim(),
    imageUrl: imageUrlInput.value.trim(),
    homeTown: homeTownInput.value.trim(),
    purpose: purposeInput.value.trim(),
    selectedCategory: selectedCategory
  });

  callForm.reset();
  modalOverlay.classList.remove("active");

  // Re-render cards immediately
  showCards();
});

// Render Cards from LocalStorage
function showCards() {
  if (!stackWrapper) return;

  // Clear existing cards cleanly
  stackWrapper.innerHTML = "";

  const allTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  allTasks.forEach((task) => {
    const profileCard = document.createElement("div");
    profileCard.className = "profile-card";

    // Avatar wrapper & image
    const avatarWrapper = document.createElement("div");
    avatarWrapper.className = "avatar-wrapper";

    const avatarImg = document.createElement("img");
    avatarImg.src = task.imageUrl;
    avatarImg.alt = "Avatar";
    avatarImg.className = "avatar";
    avatarWrapper.appendChild(avatarImg);

    // Full Name
    const nameHeading = document.createElement("h2");
    nameHeading.className = "name";
    nameHeading.textContent = task.fullName;

    // Info list
    const infoList = document.createElement("div");
    infoList.className = "info-list";

    // Hometown Row
    const hometownRow = document.createElement("div");
    hometownRow.className = "info-row";

    const hometownLabel = document.createElement("span");
    hometownLabel.className = "label";
    hometownLabel.textContent = "Home town";

    const hometownValue = document.createElement("span");
    hometownValue.className = "value";
    hometownValue.textContent = task.homeTown;

    hometownRow.append(hometownLabel, hometownValue);

    // Purpose Row
    const purposeRow = document.createElement("div");
    purposeRow.className = "info-row";

    const purposeLabel = document.createElement("span");
    purposeLabel.className = "label";
    purposeLabel.textContent = "Purpose";

    const purposeValue = document.createElement("span");
    purposeValue.className = "value";
    purposeValue.textContent = task.purpose;

    purposeRow.append(purposeLabel, purposeValue);

    infoList.append(hometownRow, purposeRow);

    // Action buttons
    const actionButtons = document.createElement("div");
    actionButtons.className = "action-buttons";

    const callBtn = document.createElement("button");
    callBtn.className = "btn btn-primary";
    const phoneIcon = document.createElement("i");
    phoneIcon.className = "ph ph-phone";
    callBtn.append(phoneIcon, document.createTextNode(" Call"));

    const msgBtn = document.createElement("button");
    msgBtn.className = "btn btn-secondary";
    msgBtn.textContent = "Message";

    actionButtons.append(callBtn, msgBtn);

    // Assemble and append card
    profileCard.append(avatarWrapper, nameHeading, infoList, actionButtons);
    stackWrapper.appendChild(profileCard);
  });

  updateStack();
}

// Update 3D Stack Effect
function updateStack() {
  const cards = document.querySelectorAll(".stack-wrapper .profile-card");

  cards.forEach((card, index) => {
    card.style.zIndex = cards.length - index;
    card.style.transform = `translateY(${index * 10}px) scale(${1 - index * 0.04})`;
    card.style.opacity = index < 3 ? 1 - index * 0.15 : 0;
    card.style.pointerEvents = index === 0 ? "auto" : "none";
  });
}

// Up Button: Bring last card to the front
if (upBtn) {
  upBtn.addEventListener("click", () => {
    const lastChild = stackWrapper.lastElementChild;
    if (lastChild && stackWrapper.children.length > 1) {
      stackWrapper.insertBefore(lastChild, stackWrapper.firstElementChild);
      updateStack();
    }
  });
}

// Down Button: Send front card to the back
if (downBtn) {
  downBtn.addEventListener("click", () => {
    const firstChild = stackWrapper.firstElementChild;
    if (firstChild && stackWrapper.children.length > 1) {
      stackWrapper.appendChild(firstChild);
      updateStack();
    }
  });
}

// Initial render on page load
showCards();