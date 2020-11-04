class ProductsStore {
    /**
     * @returns {*}
     */
    get() {
        return $.ajax("test/products.json");
    }
}