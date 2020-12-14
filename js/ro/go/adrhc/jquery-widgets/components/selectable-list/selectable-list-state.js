class SelectableListState extends BasicState {
    simpleListState = new SimpleListState();
    onOffState = new OnOffState("SELECT");

    /**
     * @param items {IdentifiableEntity[]}
     */
    update(items) {
        this.simpleListState.update(items);
        this.collectAnotherStateChanges(this.simpleListState.stateChanges)
    }

    /**
     * @param id {numeric|string}
     */
    switchTo(id) {
        const item = this.simpleListState.findById(id);
        this.onOffState.switchTo(item);
        this.collectAnotherStateChanges(this.onOffState.stateChanges)
    }
}