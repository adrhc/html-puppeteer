class DefaultCrudRepository extends CrudRepository {
    /**
     * @type {string}
     */
    url;
    /**
     * @type {function({}): IdentifiableEntity}
     */
    entityConverter;
    /**
     * @type {RepoErrorHandler}
     */
    errorHandler;

    /**
     * @param url {string}
     * @param [entityConverter] {function({}): IdentifiableEntity}
     * @param errorHandler {RepoErrorHandler}
     */
    constructor(url, entityConverter = IdentifiableEntity.entityConverter,
                errorHandler = new DefaultRepoErrorHandler()) {
        super();
        this.url = url;
        this.entityConverter = entityConverter;
        this.errorHandler = errorHandler;
    }

    /**
     * @return {Promise<Person[]>}
     */
    findAll() {
        return this.errorHandler.catch($.getJSON(this.url)
                .then(data => RestUtils.unwrapHAL(data))
                .then(items => items.map(item => this.entityConverter(item))),
            "findAll");
    }

    update(identifiableEntity) {
        return this.errorHandler.catch($.ajax({
                url: `${this.url}/${identifiableEntity.id}`,
                method: "PUT",
                data: identifiableEntity,
            }).then(it => this.entityConverter(RestUtils.unwrapHAL(it))),
            "update", identifiableEntity);
    }

    insert(identifiableEntity) {
        return this.errorHandler.catch($.ajax({
                url: this.url,
                method: "POST",
                data: identifiableEntity,
            }).then(it => this.entityConverter(RestUtils.unwrapHAL(it))),
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
                .then(it => this.entityConverter(RestUtils.unwrapHAL(it))),
            "getById", id);
    }
}