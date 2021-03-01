class SimpleListState extends TaggingStateHolder {
    /**
     * @param {*} [initialState]
     */
    constructor(initialState = []) {
        super({initialState});
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