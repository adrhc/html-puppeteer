class Person extends DynaSelOneItem {
    constructor(id, firstName, lastName, cats) {
        super(id);
        this.firstName = firstName;
        this.lastName = lastName;
        this.cats = cats ? cats : [];
    }

    get title() {
        return this.firstName;
    }

    get description() {
        return `${this.firstName} ${this.lastName}`;
    }
}