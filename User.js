import Wallet from "./Wallet.js";

class User {
    #password;
    
    constructor (userName, password) {
        if (typeof (userName) !== "string")
                throw new Error ('The name must contain just letters or numbers!')
        if (typeof (password) !== "string")
                throw new Error ('The password must contain just letters or numbers!')
        userName = userName.trim();
        password = password.trim();
        this.#validateAuth(userName, password);
        this.userName = userName;
        this.#password = password;
        this.mainWallet =  new Wallet();
        this.piggyBank = new Wallet();
    }

    #validateAuth (userName, password) {
            const regex = /^[A-Za-z0-9 ]{3,20}$/
            if (!regex.test (userName))
                throw new Error ('The name must contain at least 3 letters or numbers, and not any specific symbols!')
            if (!regex.test (password))
                throw new Error ('The password must contain at least 3 letters or numbers, and not any specific symbols!')
    }

    authenticate (password) {
            return this.#password === password;
    }

    toJSON() {
        return {
    userName: this.userName,
    password: this.#password,
    mainWallet: this.mainWallet,
    piggyBank: this.piggyBank
        }
    }

    static fromJSON (data) {
        const user = new User (data.userName, data.password)
        user.mainWallet = Wallet.fromJSON (data.mainWallet)
        user.piggyBank = Wallet.fromJSON (data.piggyBank)
        return user
    }
}

export default User;