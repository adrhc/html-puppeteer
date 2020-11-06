class PersonsStore {
    /**
     * @returns {*}
     */
    get() {
        return $.getJSON("http://127.0.0.1:8011/persons")
            .then(data => {
                if (!data.hasOwnProperty("_embedded")) {
                    return data;
                }
                return data._embedded.persons;
            })
            .catch(() => {
                return $.getJSON("test/persons.json");
            });
    }
}