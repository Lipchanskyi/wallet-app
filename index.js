import App from "./App.js";
import { saveState as storageSaveState, loadState } from "./storage.js";
import { 
  showScreen,
  renderBalance,
  renderUser,
  renderTransactions,
  renderPiggy,
  UI,
  openModal,
  closeModal
} from "./ui.js"

let app;
const savedData = loadState(); 

if (savedData) {
    app = App.fromJSON(savedData);
    app.logout();
} else {
    app = new App();
}

if (!app.currency) {
  showScreen(UI.screens.currencyScreen)
}
else if (!app.currentUser) {
  showScreen(UI.screens.authScreen)
}
else {
  showScreen(UI.screens.walletScreen)
}

function syncStorage() {
    storageSaveState(app);
}

let modalAction = null;

UI.buttons.currencyBtns.forEach (btn => {
  btn.addEventListener("click", () => {
    console.log("CLICK WORKS");
    const currency = btn.dataset.currency;
    app = new App (currency)
      showScreen(UI.screens.setupScreen)
  });
});

document.addEventListener("click", handleClick)
UI.buttons.createUserBtn.addEventListener("click", register) 
UI.buttons.loginBtn.addEventListener("click", login)
UI.buttons.newUserBtn.addEventListener("click", newUser)

UI.buttons.createWalletBtn.addEventListener("click", () => {
  if (!app) {
    console.error("app not initialized — choose currency first");
    return;
  }
  const username = UI.inputs.usernameInputCreate.value.trim();
  const password = UI.inputs.passwordInputCreate.value.trim();
  runAppAction (() =>
    app.register(username, password)
  )
  showScreen(UI.screens.walletScreen)
});

function newUser () {
  showScreen(UI.screens.newUserScreen)
}

function register () {
  const username = UI.inputs.newUserNameInput.value.trim();
  const password = UI.inputs.newPasswordInput.value.trim();

  runAppAction (() =>
    app.register(username, password)
  )
  showScreen(UI.screens.walletScreen)
};

function login () {
  const username = UI.inputs.usernameInput.value.trim();
  const password = UI.inputs.passwordInput.value.trim();
  runAppAction (() =>
    app.login(username, password)
  )
  showScreen(UI.screens.walletScreen)
};

function logout () {
  runAppAction (() => 
    app.logout ()
  )
  showScreen(UI.screens.authScreen)
};

function deposit () {
  openTransactionModal("deposit");
};

function withdraw () {
  openTransactionModal("withdraw")
};

function transfer () {
  openTransactionModal("transfer")
};

UI.buttons.piggyPutBtn.addEventListener("click", () => {
  openTransactionModal("piggyPut");
});

function openPiggy () {
  showScreen(UI.screens.piggyScreen)
  renderPiggy(app);
};

function wallet () {
  openTransactionModal("piggyTake");
  showScreen(UI.screens.walletScreen)  
};

const MODAL_TITLES = {
  deposit: 'Deposit',
  withdraw: 'Withdraw',
  transfer: 'Transfer',
  piggyPut: 'Put to Piggy Bank',
  piggyTake: 'Take from Piggy Bank',
};

function openTransactionModal(type) {
  modalAction = type
  UI.modals.title.textContent = MODAL_TITLES[type] || 'Transaction';
  UI.modals.userGroup.classList.add("hidden")
  UI.modals.categoryGroup.classList.add("hidden")
  if (type === "transfer") {
    UI.modals.userGroup.classList.remove("hidden")
  }
  if (type === "withdraw") {
    UI.modals.categoryGroup.classList.remove("hidden")
  }
  openModal()
};

UI.modals.confirm.addEventListener("click", () => {
  const amount = Number(UI.modals.amount.value)
  const user = UI.modals.user.value
  const category =  UI.modals.category.value
  const modalActions = {
    deposit: () => app.currentUser.mainWallet.deposit(amount),
    withdraw: () => app.currentUser.mainWallet.withdraw(amount, category),
    transfer: () => app.transfer(user, amount),
    piggyPut: () => app.moveToPiggy(amount),
    piggyTake: () => app.moveFromPiggy(amount)
  }
  try {
    const action = modalActions[modalAction]
    if (!action) return 
    runAppAction(action)
    closeModal()
  } catch (error) {
    alert(error.message)
  }
})

UI.modals.cancel.addEventListener("click", closeModal);

function handleClick (e) {
  const action = e.target.dataset.action

  if (!action) return

  const actions = {
  "deposit-btn": deposit,
  "withdraw-btn": withdraw,
  "transfer-btn": transfer,
  "piggybank-btn": openPiggy,
  "back-to-wallet-btn": wallet,
  "logout-btn": logout,
  }
  actions[action]?.()
}

function runAppAction (action) {
  try {
    action ();
    storageSaveState(app);
    render ();
  }
  catch (error) {
  console.log (error)
  alert (error.message)
  }
};

function render () {
  renderBalance(app);
  renderUser(app);
  renderTransactions(app);
  renderPiggy(app);

  console.log("RENDER:", {
  currency: app.currency,
  user: app.currentUser
})
}