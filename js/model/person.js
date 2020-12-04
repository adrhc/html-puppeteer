class Person {
    get title() {
        return this.firstName;
    }

    get description() {
        return `${this.firstName} ${this.lastName}`;
    }
}