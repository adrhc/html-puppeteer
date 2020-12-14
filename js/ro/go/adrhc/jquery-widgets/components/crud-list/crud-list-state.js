class CrudListState extends SimpleListState {
    /**
     * @param append {boolean|undefined}
     * @return {IdentifiableEntity}
     */
    createNewItem(append = false) {
        const item = EntityUtils.prototype.newIdentifiableEntity();
        if (append) {
            this.items.push(item);
        } else {
            this.items.unshift(item);
        }
        return item;
    }

    /**
     * @param item {IdentifiableEntity}
     */
    insertItem(item) {
        this.items.push(item);
    }

    /**
     * @param item {IdentifiableEntity}
     */
    updateItem(item) {
        return EntityUtils.prototype.findAndReplaceById(item, this.items);
    }

    /**
     * @param {number|string} id
     * @return {number} removed index
     */
    removeById(id) {
        return EntityUtils.prototype.removeById(id);
    }

    /**
     * @return {number|number[]} removed positions (aka indexes)
     */
    removeTransient() {
        return EntityUtils.prototype.removeTransient(this.items);
    }

    /**
     * @param id {number}
     * @return {IdentifiableEntity}
     */
    findById(id) {
        return EntityUtils.prototype.findById(id, this.items)
    }
}