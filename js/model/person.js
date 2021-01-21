class Person extends DynaSelOneItem {
    /**
     * @param id {number|string}
     * @param firstName {string}
     * @param lastName {string}
     * @param friend {Person}
     * @param cats {{}[]}
     */
    constructor(id, firstName, lastName, friend, cats) {
        super(id);
        this.firstName = firstName;
        this.lastName = lastName;
        this.friend = friend;
        this.cats = cats ? cats : [];
    }

    get title() {
        return this.firstName;
    }

    get description() {
        return this.lastName;
    }
}