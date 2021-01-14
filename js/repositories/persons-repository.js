/**
 * also extends DynaSelOneRepository.findByTitle
 */
class PersonsRepository extends CrudRepository {
    URL = "http://127.0.0.1:8011/persons";

    /**
     * @param title {String}
     * @returns {PromiseLike<DynaSelOneItem[]> | Promise<DynaSelOneItem[]>}
     */
    findByTitle(title) {
        return $.ajax({
            url: "dynaselone",
            data: {title: title, entity: "person"},
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
    findAll() {
        return $.getJSON(`${this.URL}?projection=PersonWithCats`)
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

    delete(id) {
        return $.ajax({
            url: `${this.URL}/${id}`,
            method: "DELETE"
        }).then(it => RestUtils.prototype.unwrapHAL(it));
    }
}