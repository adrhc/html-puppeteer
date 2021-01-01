class EditableListState extends SelectableListState {
    _doAfterSwitch(previousSelectableSwappingData, newSelectableSwappingData) {
        super._doAfterSwitch(previousSelectableSwappingData, newSelectableSwappingData);
        if (previousSelectableSwappingData &&
            EntityUtils.prototype.isTransientId(previousSelectableSwappingData.itemId) &&
            !previousSelectableSwappingData.similarTo(this.currentSelectableSwappingData)) {
            // previous switch exist and is transient and isn't similar to the next one
            this.removeTransient();
        }
    }

    switchToOff() {
        const previousSelectableSwappingData = this.currentSelectableSwappingData;
        const switched = this.swappingState.switchOff();
        if (switched) {
            this._doAfterSwitch(previousSelectableSwappingData)
        }
        return switched;
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