class CrudRepository {
    /**
     * @param item {IdentifiableEntity}
     * @return {Promise<IdentifiableEntity>}
     */
    save(item) {
        if (EntityUtils.hasEmptyId(item)) {
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
        throw `${this.constructor.name}.insert is not implemented!`;
    }

    /**
     * @param id {number|string}
     * @return {Promise<IdentifiableEntity>}
     */
    delete(id) {
        throw `${this.constructor.name}.delete is not implemented!`;
    }

    /**
     * @param item {IdentifiableEntity}
     * @return {Promise<IdentifiableEntity>}
     */
    update(item) {
        throw `${this.constructor.name}.update is not implemented!`;
    }

    /**
     * @return {Promise<IdentifiableEntity[]>}
     */
    findAll() {
        throw `${this.constructor.name}.getAll is not implemented!`;
    }
}