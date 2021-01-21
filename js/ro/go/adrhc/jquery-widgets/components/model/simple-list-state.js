class SimpleListState extends BasicState {
    items = [];

    /**
     * @param [items=[]] {IdentifiableEntity[]}
     */
    updateAll(items = []) {
        this.items = items;
        this.collectStateChange(new StateChange("UPDATE_ALL", items));
    }

    get currentState() {
        return this.items;
    }
}