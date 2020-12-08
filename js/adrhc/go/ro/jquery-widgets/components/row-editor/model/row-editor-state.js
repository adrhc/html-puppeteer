class RowEditorState {
    /**
     * @param item {IdentifiableEntity}
     * @return {Promise<IdentifiableEntity>}
     */
    init(item) {
        this.item = item;
        return Promise.resolve(item);
    }

    /**
     * @return {Promise<IdentifiableEntity>}
     */
    close() {
        return Promise.resolve(this.item);
    }
}