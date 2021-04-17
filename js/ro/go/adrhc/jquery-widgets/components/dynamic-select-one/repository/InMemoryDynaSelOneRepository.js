class InMemoryDynaSelOneRepository extends DynaSelOneRepository {
    /**
     * @type {InMemoryCrudRepository}
     */
    crudRepository;

    constructor(crudRepository) {
        super();
        this.crudRepository = crudRepository;
    }

    /**
     * @param title {string}
     * @return {Promise<DynaSelOneItem[]>}
     */
    findByTitle(title) {
        const searchFor = title.toLowerCase();
        return this.crudRepository.findAll()
            .then(items => items.filter(it => it.firstName.toLowerCase().startsWith(searchFor)));
    }
}