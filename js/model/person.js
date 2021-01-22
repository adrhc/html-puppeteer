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

    static entityConverter(object) {
        if (!object) {
            return undefined;
        }
        const person = $.extend(true, new Person(), object);
        if (object.friend) {
            person.friend = $.extend(true, new Person(), object.friend);
        }
        return person;
    }
}