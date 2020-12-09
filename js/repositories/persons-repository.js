/**
 * also extends DynaSelOneRepository.findByTitle
 */
class PersonsRepository extends TableEditorRepository {
    URL = "http://127.0.0.1:8011/persons";

    /**
     * @param title {String}
     * @returns {PromiseLike<DynaSelOneItem[]> | Promise<DynaSelOneItem[]>}
     */
    findByTitle(title) {
        return $.ajax({
            url: `${this.URL}/search/findByFirstNameStartingWith`,
            data: {firstName: title},
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            processData: true
        }).then(data => {
            const items = RestUtils.prototype.unwrapHAL(data);
            return items.map(it => $.extend(true, new Person(), it));
        });
    }

    /**
     * @return {Promise<Person[]>}
     */
    getAll() {
        return $.getJSON(this.URL)
            .then(data => RestUtils.prototype.unwrapHAL(data));
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