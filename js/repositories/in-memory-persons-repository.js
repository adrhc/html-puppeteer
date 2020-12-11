/**
 * also extends DynaSelOneRepository.findByTitle
 */
class InMemoryPersonsRepository extends InMemoryCrudRepository {
    constructor(items) {
        super(items);
    }

    findByTitle(title) {
        return this.getAll()
            .then(items => items.map(it => $.extend(true, new Person(), it)))
            .then(items => items.filter(it => it.firstName.startsWith(title)));
    }
}