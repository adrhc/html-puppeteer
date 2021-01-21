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
     * @type {RepoErrorHandler}
     */
    errorHandler;

    /**
     * @param url {string}
     * @param [entityFactoryFn] {function(): IdentifiableEntity}
     * @param errorHandler {RepoErrorHandler}
     */
    constructor(url, entityFactoryFn = () => new IdentifiableEntity(),
                errorHandler = new DefaultRepoErrorHandler()) {
        super();
        this.url = url;
        this.entityFactoryFn = entityFactoryFn;
        this.errorHandler = errorHandler;
    }

    /**
     * @return {Promise<Person[]>}
     */
    findAll() {
        return this.errorHandler.catch($.getJSON(this.url)
                .then(data => RestUtils.unwrapHAL(data))
                .then(items => items.map(item => this._typedEntityOf(item))),
            "findAll");
    }

    update(identifiableEntity) {
        return this.errorHandler.catch($.ajax({
                url: `${this.url}/${identifiableEntity.id}`,
                method: "PUT",
                data: identifiableEntity,
            }).then(it => this._typedEntityOf(RestUtils.unwrapHAL(it))),
            "update", identifiableEntity);
    }

    insert(identifiableEntity) {
        return this.errorHandler.catch($.ajax({
                url: this.url,
                method: "POST",
                data: identifiableEntity,
            }).then(it => this._typedEntityOf(RestUtils.unwrapHAL(it))),
            "insert", identifiableEntity);
    }

    delete(id) {
        return this.errorHandler.catch($.ajax({
                url: `${this.url}/${id}`,
                method: "DELETE"
            }).then(it => RestUtils.unwrapHAL(it)),
            "delete", id);
    }

    getById(id) {
        return this.errorHandler.catch($.get(`${this.url}/${id}`)
                .then(it => this._typedEntityOf(RestUtils.unwrapHAL(it))),
            "getById", id);
    }

    _typedEntityOf(item) {
        return $.extend(true, this.entityFactoryFn(), item);
    }
}