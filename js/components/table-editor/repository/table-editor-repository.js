class TableEditorRepository {
    /**
     * @param item {TableEditorItem}
     * @return {Promise<TableEditorItem>}
     */
    save(item) {
        if (EntityUtils.prototype.hasEmptyId(item)) {
            return this.insert(item);
        } else {
            return this.update(item);
        }
    }

    /**
     * @param item {TableEditorItem}
     * @return {Promise<TableEditorItem>}
     */
    insert(item) {
        throw "Not implemented!";
    }

    /**
     * @param item {TableEditorItem}
     * @return {Promise<TableEditorItem>}
     */
    update(item) {
        throw "Not implemented!";
    }

    /**
     * @return {Promise<TableEditorItem[]>}
     */
    getAll() {
        throw "Not implemented!";
    }
}