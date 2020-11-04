class ProductsStore {
    /**
     * @returns {*}
     */
    get() {
        return $.ajax({
            type: "GET",
            url: "test/products.json",
            dataType: "json"
        });
    }
}