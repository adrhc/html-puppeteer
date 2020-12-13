class SimpleListState extends BasicComponentState {
    items = undefined;

    /**
     * @param items {IdentifiableEntity[]}
     */
    update(items) {
        this.items = items;
        this.collectStateChange(new StateUpdate(items));
    }
}