class Person extends DynaSelOneItem {
    get title() {
        return this.firstName;
    }

    get description() {
        return `${this.firstName} ${this.lastName}`;
    }
}