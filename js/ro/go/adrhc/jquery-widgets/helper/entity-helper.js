class EntityHelper {
    static lastGeneratedId = -1;

    /**
     * @return {number}
     */
    generateId() {
        return EntityHelper.lastGeneratedId--;
    }
}