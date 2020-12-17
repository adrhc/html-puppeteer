class EditableListState extends SelectableListState {
    /**
     * @param id {numeric|string}
     * @param context is some context data
     */
    switchTo(id, context) {
        const previousSelectableSwappingData = this.currentSelectableSwappingData;
        super.switchTo(id, context);
        if (!previousSelectableSwappingData || !previousSelectableSwappingData.item) {
            // previous switch doesn't exist
        } else if (previousSelectableSwappingData.equals(this.currentSelectableSwappingData)) {
            // previous switch equals the next one
        } else if (EntityUtils.prototype.isTransientId(previousSelectableSwappingData.item.id)) {
            // previous switch is transient entity - automatically remove it on switch to another item
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