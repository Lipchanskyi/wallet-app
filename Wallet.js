class Wallet {
    #history = [];
    #nextId = 1;

    getBalance () {
        return this.#history.reduce ((sum, tx) => {
            if (tx.type === 'deposit' || tx.type === 'transfer_in') {
                return sum + tx.amount;
            }
            if (tx.type === 'withdraw' || tx.type == 'transfer_out') {
                return sum - tx.amount;
            }
            return sum;
            }, 0);
        }

    #createTransaction (type,amount, category = null) {
        const transaction =  {
            id: this.#nextId++,
            type,
            amount,
            category,
            date: new Date()
        }
        this.#history.push(transaction);

        return {...transaction};
    }

    getHistory () {
        return this.#history.map(tx => ({...tx}));
    }

    validateAmount (amount) {
        if (!Number.isFinite(amount) || amount <= 0)
            throw new Error ('Invalid amount!')
    }

        deposit (amount) {
        this.validateAmount (amount);
        return this.#createTransaction ('deposit', amount);
    }

    withdraw (amount, category) {
        this.validateAmount (amount);
        if (amount > this.getBalance())
            throw new Error ('Insufficient funds on the wallet!')

        return this.#createTransaction ('withdraw', amount, category);
    }

    transfer (amount, targetWallet) {
        this.validateAmount (amount);
        if (targetWallet === this)
            throw new Error ('Target must be another wallet!')
        if (!(targetWallet instanceof Wallet)) {
            throw new Error ('Target must be a wallet instance!')
        }
        if (amount > this.getBalance())
            throw new Error ('Insufficient funds on the wallet!')
        const fromTx = this.#createTransaction  ('transfer_out', amount)
        const toTx = targetWallet.#createTransaction ('transfer_in', amount);
            return {
            from: fromTx,
            to: toTx
        };
    }

    toJSON () {
        return {
            history: this.#history,
            nextid: this.#nextId
        }
    }

    static fromJSON (data) {
        if (!data) return new Wallet();

        const wallet = new Wallet ();
        wallet.#nextId = data.nextid;
        wallet.#history = data.history.map(tx => ({...tx,
        date: new Date(tx.date)
        }))
        return wallet
    }
}

export default Wallet;