class ProductsStore {
    /**
     * @returns {*}
     */
    get() {
        return $.getJSON("test/persons.json");
    }
}