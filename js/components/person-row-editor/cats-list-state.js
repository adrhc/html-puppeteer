class CatsListState extends EditableListState {
    /**
     * @param repository {InMemoryCrudRepository}
     */
    constructor(repository) {
        super();
        this.repository = repository;
    }

    createNewItem(append = false) {
        const savedItem = this.repository.insert(new IdentifiableEntity(), true);
        return this.insertItem(savedItem, true);
    }

    switchTo(id, context) {
        // cancel swapping
        return false;
    }
}