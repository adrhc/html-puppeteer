class CrudRepository {
    /**
     * @param item {IdentifiableEntity}
     * @return {Promise<IdentifiableEntity>}
     */
    save(item) {
        if (EntityUtils.prototype.hasEmptyId(item)) {
            return this.insert(item);
        } else {
            return this.update(item);
        }
    }

    /**
     * @param item {IdentifiableEntity}
     * @return {Promise<IdentifiableEntity>}
     */
    insert(item) {
        throw "Not implemented!";
    }

    /**
     * @param id {number|string}
     * @return {Promise<IdentifiableEntity>}
     */
    delete(id) {
        throw "Not implemented!";
    }

    /**
     * @param item {IdentifiableEntity}
     * @return {Promise<IdentifiableEntity>}
     */
    update(item) {
        throw "Not implemented!";
    }

    /**
     * @return {Promise<IdentifiableEntity[]>}
     */
    getAll() {
        throw "Not implemented!";
    }
}