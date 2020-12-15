class SimpleListState extends BasicState {
    items = undefined;

    /**
     * @param items {IdentifiableEntity[]}
     */
    updateAll(items) {
        this.items = items;
        this.collectStateChange(new StateChange("UPDATE_ALL", items));
    }
}