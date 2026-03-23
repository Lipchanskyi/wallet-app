const KEY = "wallet_app";

export function saveState(app) {
    localStorage.setItem(KEY, JSON.stringify(app));
}

export function loadState() {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : null;
}