class EditableListState extends SelectableListState {
    _doAfterSwitch(previousSelectableSwappingData, newSelectableSwappingData) {
        super._doAfterSwitch(previousSelectableSwappingData, newSelectableSwappingData);
        if (previousSelectableSwappingData &&
            EntityUtils.prototype.isTransientId(previousSelectableSwappingData.itemId)) {
            // previous switch exist and is transient
            this.removeTransient();
        }
    }

    /**
     * @param append {boolean|undefined}
     * @return {IdentifiableEntity}
     */
    createNewItem(append = false) {
        let item = this.findById(EntityUtils.prototype.transientId);
        if (item) {
            return item;
        }
        item = EntityUtils.prototype.newIdentifiableEntity();
        return this.insertItem(item, append);
    }
}