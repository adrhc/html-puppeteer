class InMemoryPersonsRepository extends InMemoryCrudRepository {
    constructor(items) {
        super(items, () => new Person());
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
            .then(items => items.map(it => $.extend(true, this.entityFactoryFn(), it)))
            .then(items => items.filter(it => it.firstName.toLowerCase().startsWith(searchFor)));
    }
}