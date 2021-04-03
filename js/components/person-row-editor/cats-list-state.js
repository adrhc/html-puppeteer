class CatsListState extends EditableListState {
    /**
     * @param repository {InMemoryCrudRepository}
     * @param {*} [currentState]
     * @param {function(): IdentifiableEntity} [newEntityFactoryFn]
     * @param {boolean} [newItemsGoLast]
     * @param {RowSwappingStateHolder} [swappingState]
     */
    constructor(repository, {currentState, newEntityFactoryFn, newItemsGoLast, swappingState}) {
        super({currentState, newEntityFactoryFn, newItemsGoLast, swappingState});
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