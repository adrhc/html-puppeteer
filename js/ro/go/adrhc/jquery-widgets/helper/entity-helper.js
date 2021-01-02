class EntityHelper {
    /**
     * @return {number}
     */
    generateId() {
        return EntityHelper.prototype.lastGeneratedId--;
    }
}

/**
 * @type {number}
 */
EntityHelper.prototype.lastGeneratedId = -1;
