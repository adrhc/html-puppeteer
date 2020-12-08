class RowEditorState {
    /**
     * @param item {IdentifiableEntity}
     * @return {Promise<RowEditorState>}
     */
    init(item) {
        return Promise.resolve(this);
    }

    /**
     * @return {Promise<RowEditorState>}
     */
    close() {
        return Promise.resolve(this);
    }
}