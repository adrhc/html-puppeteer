class StateChange {
    /**
     * @param item
     * @param isTransient
     * @param isSelected
     */
    constructor(item, isTransient, isSelected) {
        this.item = item;
        this.isSelected = isSelected;
        this.isTransient = isTransient;
    }
}