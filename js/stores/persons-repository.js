class PersonsRepository {
    URL = "http://127.0.0.1:8011/persons";

    /**
     * @returns {*}
     */
    get() {
        return $.getJSON(this.URL)
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
        }).then(it => ObjectUtils.prototype.copyUsingTemplate(it, person));
    }

    update(person) {
        return $.ajax({
            url: `${this.URL}/${person.id}`,
            method: "PUT",
            data: person,
        }).then(it => {
            const result = ObjectUtils.prototype.copyUsingTemplate(it, person);
            result.id = it.id;
            return result;
        });
    }

    insert(person) {
        return $.ajax({
            url: this.URL,
            method: "POST",
            data: person,
        }).then(it => ObjectUtils.prototype.copyUsingTemplate(it, person));
    }
}