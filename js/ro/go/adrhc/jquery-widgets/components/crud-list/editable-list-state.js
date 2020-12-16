class EditableListState extends SelectableElasticListState {
    /**
     * @param id {numeric|string}
     * @param context is some context data
     */
    switchTo(id, context) {
        const currentSelectableSwappingData = this.currentSelectableSwappingData;
        super.switchTo(id, context);
        const nextSelectableSwappingData = this.currentSelectableSwappingData;
        if (!currentSelectableSwappingData || !currentSelectableSwappingData.item) {
            // previous switch doesn't exist
        } else if (currentSelectableSwappingData.equals(nextSelectableSwappingData)) {
            // previous switch equals the next one
        } else if (EntityUtils.prototype.isTransientId(currentSelectableSwappingData.item.id)) {
            // previous switch is transient entity
            this.removeTransient();
        }
    }
}