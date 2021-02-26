class SimpleListState extends BasicState {
    constructor(currentState = []) {
        super(currentState);
    }

    /**
     * @param [items=[]] {IdentifiableEntity[]}
     */
    updateAll(items = []) {
        this.items = items;
        this.collectStateChange(new StateChange("UPDATE_ALL", items), {});
    }

    get items() {
        return this.currentState;
    }

    set items(items) {
        this.currentState = items;
    }
}