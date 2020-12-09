/**
 * also extends DynaSelOneRepository.findByTitle
 */
class InMemoryPersonsRepository extends InMemoryTableEditorRepository {
    constructor(items) {
        super(items);
    }

    findByTitle(title) {
        return this.getAll()
            .then(items => items.filter(it => it.firstName.startsWith(title)));
    }

    newItem() {
        return new Person();
    }
}