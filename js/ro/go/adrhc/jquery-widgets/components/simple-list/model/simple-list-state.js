class SimpleListState extends BasicState {
    items = undefined;

    /**
     * @param items {IdentifiableEntity[]}
     */
    update(items) {
        this.items = items;
        this.collectStateChange(new StateUpdate(items));
    }

    /**
     * @param id {number}
     * @return {IdentifiableEntity}
     */
    findById(id) {
        return EntityUtils.prototype.findById(id, this.items)
    }
}