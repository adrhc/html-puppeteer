class InMemoryPersonsRepository extends InMemoryCrudRepository {
    constructor(items) {
        super(items);
    }

    /**
     * see DynaSelOneRepository.findByTitle
     *
     * @param title {string}
     * @return {Promise<Person[]>}
     */
    findByTitle(title) {
        const searchFor = title.toLowerCase();
        return this.getAll()
            .then(items => items.map(it => $.extend(true, new Person(), it)))
            .then(items => items.filter(it => it.firstName.toLowerCase().startsWith(searchFor)));
    }
}