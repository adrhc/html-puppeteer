class PersonsRepository {
    URL = "http://127.0.0.1:8011/persons";

    /**
     * @returns {*}
     */
    get() {
        return $.getJSON(this.URL)
            .then(data => RestUtils.prototype.unwrapHAL(data))
            .catch((jqXHR, textStatus, errorThrown) => {
                console.log(textStatus, errorThrown);
                alert(`${textStatus}! loading fallback data`);
                return $.getJSON("test/persons.json");
            });
    }

    save(person) {
        let result;
        if ($.isNumeric(person.id)) {
            return this.update(person);
        } else {
            return this.insert(person);
        }
    }

    update(person) {
        return $.ajax({
            url: `${this.URL}/${person.id}`,
            method: "PUT",
            data: person,
        }).then(it => RestUtils.prototype.unwrapHAL(it));
    }

    insert(person) {
        return $.ajax({
            url: this.URL,
            method: "POST",
            data: person,
        }).then(it => RestUtils.prototype.unwrapHAL(it));
    }
}