import User from "./User.js";

class App {
    #users = [];
    #currentUser = null;
    #currency;
    constructor (currency) {
        if ((currency) !== 'USD' && currency !== 'EUR' && currency !== 'UAH' && currency !== 'GBP' && currency !== 'CAD' && currency !== undefined)
        throw new Error ('The currency is not available!')
        this.#currency = currency
        }
        
        get currency() {
            return this.#currency
        }
        get currentUser() {
        return this.#currentUser;
        }

    register (userName, password) {
        if (this.#currentUser !== null)
            throw new Error ('You must to log out before creation wallet!')
        const excists = this.#users.some (user => user.userName === userName)
            if (excists)
                throw new Error ('This name already exists!')
        const newUser = new User (userName, password)
        this.#users.push (newUser)
        this.#currentUser = newUser
    }

    login (userName, password) {
        const user = this.#users.find ( user => user.userName === userName)
        if (!user)
            throw new Error ('Incorrect login')
        if (!user.authenticate(password))
            throw new Error ('Incorrect password')
        this.#currentUser = user
    }

    logout () {
        this.#currentUser = null
    }

    deposit (amount) {
        this.#requireAuth ()
        return this.#currentUser.mainWallet.deposit (amount)
    }
    withdraw (amount, category) {
        this.#requireAuth ()
        if (typeof category !== 'string')
            throw new Error ('Invalid category!')
        if (!App.CATEGORIES.includes (category))
            throw new Error ('Invalid category!')
        return this.#currentUser.mainWallet.withdraw (amount, category);
    }

    transfer (targetUserName, amount) {
        this.#requireAuth ()
        targetUserName = targetUserName.trim();
        if (targetUserName === this.#currentUser.userName)
            throw new Error ('Target must be another wallet!')
        const user = this.#users.find (user => user.userName === targetUserName)
        if (!user)
            throw new Error ('Target wallet does not exist!')
        return this.#currentUser.mainWallet.transfer (amount, user.mainWallet);
    }

    moveToPiggy (amount) {
        this.#requireAuth ()
        return this.#currentUser.mainWallet.transfer (amount, this.#currentUser.piggyBank);
    }

    moveFromPiggy (amount) {
        this.#requireAuth ()
        return this.#currentUser.piggyBank.transfer(amount, this.#currentUser.mainWallet)
    }

    #requireAuth () {
        if (this.#currentUser === null)
            throw new Error ('You must login first!')
    }

    static CATEGORIES = [
        "Market", 
        "Restaurants", 
        "Beauty & care", 
        "Pet Supply", 
        "Electronics", 
        "Toys & Kids", 
        "Shopping", 
        "Travelling",
        "Entertainment",
        "Other"
    ];

    toJSON () {
        return {
        users: this.#users,
        currentUserName: this.#currentUser?.userName,
        currency: this.#currency
        }
    }

    static fromJSON(data) {
        if (!data) return new App()

        const app = new App()
        app.#currency = data.currency
        app.#users = data.users.map(u => User.fromJSON(u))
        if (data.currentUserName) {
            app.#currentUser =
            app.#users.find(u => u.userName === data.currentUserName)
        }
        return app
    }
}

export default App;