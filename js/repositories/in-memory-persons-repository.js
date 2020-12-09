class InMemoryPersonsRepository extends InMemoryTableEditorRepository {
    constructor(items) {
        super(items);
    }

    findByTitle(title) {
        const items = Object.values(this.items).filter(it => it.firstName.startsWith(title));
        return this._promiseOf(items);
    }

    newItem() {
        return new Person();
    }
}