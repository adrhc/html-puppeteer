class SimpleListState extends BasicState {
    constructor(currentState = []) {
        super({currentState});
    }

    /**
     * @param [items=[]] {IdentifiableEntity[]}
     */
    updateAll(items = []) {
        this.replace(items);
    }

    get items() {
        return this.currentState;
    }

    set items(items) {
        this.currentState = items;
    }
}