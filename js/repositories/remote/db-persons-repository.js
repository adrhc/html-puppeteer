/**
 * also extends DynaSelOneRepository.findByTitle
 */
class DbPersonsRepository extends CrudRepository {
    PERSONS_URL = `http://127.0.0.1:8011/persons`;

    /**
     * @return {Promise<Person[]>}
     */
    findAll() {
        return $.getJSON(`${this.PERSONS_URL}?projection=PersonWithCats`)
            .then(data => RestUtils.prototype.unwrapHAL(data))
            .then(items => items
                .map(item => this.typedEntityOf(item)));
    }

    update(person) {
        return $.ajax({
            url: `${this.PERSONS_URL}/${person.id}`,
            method: "PUT",
            data: person,
        })
            .then(it => RestUtils.prototype.unwrapHAL(it))
            .then(it => this.typedEntityOf(it));
    }

    insert(person) {
        return $.ajax({
            url: this.PERSONS_URL,
            method: "POST",
            data: person,
        })
            .then(it => RestUtils.prototype.unwrapHAL(it))
            .then(it => this.typedEntityOf(it));
    }

    delete(id) {
        return $.ajax({
            url: `${this.PERSONS_URL}/${id}`,
            method: "DELETE"
        })
            .then(it => RestUtils.prototype.unwrapHAL(it));
    }

    typedEntityOf(item) {
        return $.extend(true, new Person(), item);
    }
}