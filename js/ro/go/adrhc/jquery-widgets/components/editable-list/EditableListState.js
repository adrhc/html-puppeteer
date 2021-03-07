class EditableListState extends SelectableListState {
    hasTransient() {
        return !!this.findById(IdentifiableEntity.TRANSIENT_ID);
    }
}