class DefaultCrudRepository extends CrudRepository {
    /**
     * @type {string}
     */
    url;
    /**
     * @type {function(): IdentifiableEntity}
     */
    entityFactoryFn;

    /**
     * @param url {string}
     * @param [entityFactoryFn] {function(): IdentifiableEntity}
     */
    constructor(url, entityFactoryFn = () => new IdentifiableEntity()) {
        super();
        this.url = url;
        this.entityFactoryFn = entityFactoryFn;
    }

    /**
     * @return {Promise<Person[]>}
     */
    findAll() {
        return $.getJSON(this.url)
            .then(data => RestUtils.prototype.unwrapHAL(data))
            .then(items => items.map(item => this._typedEntityOf(item)));
    }

    update(identifiableEntity) {
        return $.ajax({
            url: `${this.url}/${identifiableEntity.id}`,
            method: "PUT",
            data: identifiableEntity,
        })
            .then(it => RestUtils.prototype.unwrapHAL(it))
            .then(it => this._typedEntityOf(it));
    }

    insert(identifiableEntity) {
        return $.ajax({
            url: this.url,
            method: "POST",
            data: identifiableEntity,
        })
            .then(it => RestUtils.prototype.unwrapHAL(it))
            .then(it => this._typedEntityOf(it));
    }

    delete(id) {
        return $.ajax({
            url: `${this.url}/${id}`,
            method: "DELETE"
        })
            .then(it => RestUtils.prototype.unwrapHAL(it));
    }

    _typedEntityOf(item) {
        return $.extend(true, this.entityFactoryFn(), item);
    }
}