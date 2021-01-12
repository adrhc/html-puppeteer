class CatsListState extends EditableListState {
    /**
     * @param repository {InMemoryCrudRepository}
     */
    constructor(repository) {
        super();
        this.repository = repository;
    }

    createNewItem(append) {
        const repoItem = this.repository.createNewItem();
        return this.insertItem(repoItem, true);
    }

    switchTo(id, context) {
        // cancel switching
        return false;
    }

    switchToOff() {
        // cancel switch off
        return false;
    }
}