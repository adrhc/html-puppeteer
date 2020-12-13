class SimpleListState extends BasicComponentState {
    items = undefined;

    /**
     * @param items {IdentifiableEntity}
     */
    update(items) {
        this.items = items;
        this.stateChanges.collect(new StateUpdate(items));
    }
}