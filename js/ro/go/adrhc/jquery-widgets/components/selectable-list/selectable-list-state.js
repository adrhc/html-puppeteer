class SelectableListState extends BasicState {
    crudListState = new CrudListState();
    onOffState = new OnOffState("SELECT");

    /**
     * @param items {IdentifiableEntity[]}
     */
    update(items) {
        this.crudListState.updateAll(items);
        this.collectAnotherStateChanges(this.crudListState.stateChanges)
    }

    /**
     * @param id {numeric|string}
     */
    switchTo(id) {
        const item = this.crudListState.findById(id);
        this.onOffState.switchTo(item);
        this.collectAnotherStateChanges(this.onOffState.stateChanges)
    }
}