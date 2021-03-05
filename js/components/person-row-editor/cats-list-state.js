class CatsListState extends EditableListState {
    /**
     * @param repository {InMemoryCrudRepository}
     * @param {*} [currentState]
     * @param {function(): IdentifiableEntity} [newEntityFactoryFn]
     * @param {boolean} [newItemsGoToTheEndOfTheList]
     * @param {RowSwappingState} [swappingState]
     */
    constructor(repository, {currentState, newEntityFactoryFn, newItemsGoToTheEndOfTheList, swappingState}) {
        super({currentState, newEntityFactoryFn, newItemsGoToTheEndOfTheList, swappingState});
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