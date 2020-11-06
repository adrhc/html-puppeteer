class PersonsRepository {
    URL = "http://127.0.0.1:8011/persons";

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

    save(person) {
        return $.ajax({
            url: this.URL,
            method: $.isNumeric(person.id) ? "PUT" : "POST",
            data: person,
        }).then(it => person.id = it.id);
    }
}