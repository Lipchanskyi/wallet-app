export const UI = {
  screens: {
    currencyScreen: document.getElementById("currency-screen"),
    walletScreen: document.getElementById("wallet-screen"),
    piggyScreen: document.getElementById("piggy-screen"),
    authScreen: document.getElementById("auth-screen"),
    setupScreen: document.getElementById("setup-screen"),
    newUserScreen:document.getElementById("newuser-screen"),
  },

  inputs: {
    usernameInputCreate: document.getElementById("username-input"),
    passwordInputCreate: document.getElementById("password-input"),
    newUserNameInput: document.getElementById("new-username"),
    newPasswordInput :document.getElementById("new-password"),
    usernameInput: document.getElementById("username"),
    passwordInput: document.getElementById("password")
  },

  display: {
    balanceAmount:document.getElementById("balance-amount"),
    balanceCurrency: document.getElementById("balance-currency"),
    userElement: document.getElementById("card-user"),
    transactionsList: document.getElementById("transactions"),
    piggyBalance: document.getElementById("piggy-balance"),
  },

  buttons: {
    currencyBtns: document.querySelectorAll(".currency-btn"),
    createWalletBtn: document.getElementById("create-wallet-btn"),
    newUserBtn: document.getElementById("newuser-btn"),
    createUserBtn: document.getElementById("createuser-btn"),
    loginBtn: document.getElementById("login-btn"),
    logoutBtn: document.getElementById("logout-btn"),
    piggyPutBtn: document.getElementById("put-piggy-btn"),
  },

  modals: {

    container: document.getElementById("modal"),
    title: document.getElementById("modal-title"),
    user: document.getElementById("modal-user"),
    amount: document.getElementById("modal-amount"),
    category: document.getElementById("modal-category"),
    userGroup: document.getElementById("modal-user-group"),
    categoryGroup: document.getElementById("modal-category-group"),

    confirm: document.getElementById("modal-confirm"),
    cancel: document.getElementById("modal-cancel")
  }
};

export function showScreen(screen) {
  console.log("SWITCH TO:", screen);

  Object.values(UI.screens).forEach(scr => {
    scr.classList.add("hidden")
  })

  screen.classList.remove("hidden")
}

export function renderBalance (app) {
  if (!app.currentUser) return
    const balance = app.currentUser.mainWallet.getBalance();
    UI.display.balanceAmount.textContent = balance;
    UI.display.balanceCurrency.textContent = app.currency;
};

export function renderUser (app) {
  if (!app.currentUser) return
      UI.display.userElement.textContent = app.currentUser.userName;
};

export function renderTransactions (app) {
  if (!app.currentUser) return
    const list = UI.display.transactionsList
    list.innerHTML = "";
  const history = app
  .currentUser
  .mainWallet
  .getHistory()
  .slice(-100);
  const fragment = document.createDocumentFragment();
  [...history].reverse().forEach(tx => {
    const li = document.createElement("li");
    li.classList.add("transaction");
    if (tx.type === "deposit") {
    li.classList.add("income");
    } else {
    li.classList.add("expense");
    }
    const category = document.createElement("span");
    const amount = document.createElement("span");
    const date = document.createElement("span")
    category.classList.add("tx-category");
    amount.classList.add("tx-amount");
    date.classList.add("tx-date");
    const timeStr = tx.date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit"
    });
    const dateStr = tx.date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    });
    date.textContent = `${dateStr} | ${timeStr}`;
    let label;
    if (tx.type === "deposit") {
    label = "Income";
    } else {
    label = tx.category ?? "Other";
    };
    category.textContent = label;
    const sign = tx.type === "deposit" ? "+" : "-";
    amount.textContent = `${sign} ${tx.amount} ${app.currency}`
    li.appendChild(category);
    li.appendChild(amount);
    li.appendChild(date);
    fragment.appendChild(li);
  });
  list.appendChild(fragment);
};

export function renderPiggy (app) {
  if (!app.currentUser) return
    const balance = app.currentUser.piggyBank.getBalance();
    UI.display.piggyBalance.textContent = `${balance} ${app.currency}`
};

export function openModal () {
  UI.modals.container.classList.remove ("hidden")
};

export function closeModal () {

  UI.modals.amount.value = ""
  UI.modals.user.value = ""
  UI.modals.category.value = ""

  UI.modals.container.classList.add("hidden")

};