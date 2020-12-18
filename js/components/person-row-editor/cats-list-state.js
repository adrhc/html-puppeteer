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

    /**
     * ignores isPrevious = false state changes
     *
     * @param stateChanges {StateChanges}
     * @param fromLatest {boolean|undefined}
     */
    collectByConsumingStateChanges(stateChanges, fromLatest = false) {
        stateChanges.consumeAll(fromLatest)
            .filter(stateChange => {
                const swappingDetails = stateChange.data;
                return !swappingDetails.isPrevious;
            })
            .forEach(stateChange => this.collectStateChange(stateChange));
    }
}