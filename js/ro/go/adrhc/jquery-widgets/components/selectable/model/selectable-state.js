class SelectableState extends BasicComponentState {
    selected;
    item;

    /**
     * @param item
     * @param selected {boolean}
     */
    constructor(item = undefined, selected = false) {
        super();
        this.item = item;
        this.selected = selected;
    }

    /**
     * @param selected {boolean}
     */
    select(selected) {
        this.selected = selected;
        this.collectStateChange(new StateChange("SELECT", {item: this.item, selected}));
    }

    /**
     * @param selected {boolean}
     * @param item
     */
    update(selected, item) {
        this.item = item;
        this.select(selected);
    }
}