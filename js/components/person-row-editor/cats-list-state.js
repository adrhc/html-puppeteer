class CatsListState extends EditableListState {
    /**
     * @param repository {InMemoryCrudRepository}
     */
    constructor(repository) {
        super();
        this.repository = repository;
    }

    createNewItem(append = false) {
        const item = this.repository.insert(new IdentifiableEntity(), true);
        return this.insertItem(item, true);
    }

    switchTo(id, context) {
        // cancelling swapping
        return false;
    }
}