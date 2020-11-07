class PersonsRepository {
    URL = "http://127.0.0.1:8011/persons";

    /**
     * @returns {*}
     */
    get() {
        return $.getJSON("http://127.0.0.1:8011/persons")
            .then(data => data.hasOwnProperty("_embedded") ? data._embedded.persons : data)
            .catch((jqXHR, textStatus, errorThrown) => {
                console.log(textStatus, errorThrown);
                alert(`${textStatus}! loading fallback data`);
                return $.getJSON("test/persons.json");
            });
    }

    save(person) {
        return $.ajax({
            url: this.URL,
            method: $.isNumeric(person.id) ? "PUT" : "POST",
            data: person,
        });
    }
}