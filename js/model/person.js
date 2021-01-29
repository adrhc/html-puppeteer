class Person extends DynaSelOneItem {
    /**
     * @param [id] {number|string}
     * @param [firstName] {string}
     * @param [lastName] {string}
     * @param [friend] {Person}
     * @param [cats] {{}[]}
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

    get optionText() {
        return `${this.firstName} - ${this.lastName}`;
    }

    static parse(object) {
        if (!object) {
            return undefined;
        }
        const person = $.extend(true, new Person(), object);
        if (object.friend) {
            person.friend = $.extend(true, new Person(), object.friend);
        }
        if (person.cats) {
            person.cats.forEach(cat => {
                cat.friendId = cat.person ? cat.person.id : cat.friendId;
                cat.person = Person.parse(cat.person);
                return EntityUtils.removeGeneratedOrInvalidId(cat);
            })
        } else {
            // https://stackoverflow.com/questions/5587482/hibernate-a-collection-with-cascade-all-delete-orphan-was-no-longer-referenc
            person.cats = [];
        }
        return person;
    }
}