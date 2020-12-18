class EntityHelper {
    /**
     * @type {number}
     */
    lastGeneratedId = -1;

    /**
     * @return {number}
     */
    generateId() {
        return this.lastGeneratedId--;
    }
}