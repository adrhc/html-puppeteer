class CatsListState extends EditableListState {
    /**
     * @param repository {InMemoryCrudRepository}
     * @param [newItemsGoToTheEndOfTheList] {boolean}
     * @param [swappingState] {SwappingState}
     */
    constructor(repository, newItemsGoToTheEndOfTheList, swappingState) {
        super(swappingState, newItemsGoToTheEndOfTheList);
        this.repository = repository;
    }

    createNewItem(append) {
        const repoItem = this.repository.createNewItem();
        return this.insertItem(repoItem, append);
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