class DbMock {
    static PERSONS_REPOSITORY = new InMemoryPersonsRepository([
        new Person(1, "gigi1", "kent1", new Person(2, "gigi2", "kent2"),
            [{id: 1, name: "cat1", person: new Person(1, "gigi1", "kent1")},
                {id: 2, name: "cat2", person: new Person(1, "gigi1", "kent1")},
                {id: 3, name: "cat3", person: new Person(1, "gigi1", "kent1")}]),
        new Person(2, "gigi2", "kent2", new Person(1, "gigi1", "kent1"),
            [{id: 21, name: "cat21", person: new Person(2, "gigi2", "kent2")},
                {id: 22, name: "cat22", person: new Person(2, "gigi2", "kent2")},
                {id: 23, name: "cat23", person: new Person(2, "gigi2", "kent2")}]),
        new Person(4, "gigi4", "kent4", undefined,
            [{id: 41, name: "cat41"},
                {id: 22, name: "cat42", person: new Person(4, "gigi4", "kent4")},
                {id: 43, name: "cat43"}]),
        new Person(3, "gigi3", "kent3", new Person(4, "gigi4", "kent4"),
            [{id: 31, name: "cat31"},
                {id: 32, name: "cat32"},
                {id: 33, name: "cat33"}])
    ], Person.parse);

    /**
     * This works only with the PERSONS_REPOSITORY as the component's repository!
     *
     * @param object
     * @return {Person}
     */
    static parsePersonOnSave(object) {
        // changing generated cat ids to valid, not generated ids
        if (object.cats != null && $.isArray(object.cats)) {
            object.cats.forEach(cat => {
                if (cat.id == null) {
                    cat.id = Math.abs(EntityUtils.generateId());
                } else {
                    cat.id = Math.abs(cat.id);
                }
            })
        }
        if (object.id == null) {
            object.id = Math.abs(EntityUtils.generateId());
            const person = Person.parse(object);
            // this will force the next EditableListComponent.onUpdate do call an InMemoryCrudRepository.update
            // such that in the end PERSONS_REPOSITORY.items will only contain the object to save with a valid,
            // not generated, id.
            DbMock.PERSONS_REPOSITORY.items.unshift(person);
            return person;

        }
        return Person.parse(object);
    }

    static DYNA_SEL_ONE_PERS_REPOSITORY = new InMemoryDynaSelOneRepository(DbMock.PERSONS_REPOSITORY);
}
