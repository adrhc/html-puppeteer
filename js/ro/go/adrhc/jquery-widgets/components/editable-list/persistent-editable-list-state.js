class PersistentEditableListState extends EditableListState {
    /**
     * @param entityHelper {EntityHelper}
     */
    constructor(entityHelper) {
        super();
        this.entityHelper = entityHelper;
    }

    createNewItem(append = false) {
        const item = EntityUtils.prototype.newIdentifiableEntity(this.entityHelper.generateId());
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