class DefaultCrudRepository extends CrudRepository {
    /**
     * @type {string}
     */
    url;
    /**
     * @type {function({}): {}}
     */
    responseConverter;
    /**
     * @type {function({}): {}}
     */
    requestConverter;
    /**
     * @type {RepoErrorHandler}
     */
    errorHandler;

    /**
     * @param url {string}
     * @param [responseConverter] {function({}): IdentifiableEntity}
     * @param [requestConverter] {function({}): IdentifiableEntity}
     * @param [errorHandler] {RepoErrorHandler}
     */
    constructor(url, responseConverter = IdentifiableEntity.of,
                requestConverter = (reqData) => reqData,
                errorHandler = new DefaultRepoErrorHandler()) {
        super();
        this.url = url;
        this.responseConverter = responseConverter;
        this.requestConverter = requestConverter;
        this.errorHandler = errorHandler;
    }

    /**
     * @return {Promise<Person[]>}
     */
    findAll() {
        return this.errorHandler.catch($.getJSON(this.url)
                .then(data => RestUtils.unwrapHAL(data))
                .then(items => items.map(item => this.responseConverter(item))),
            "findAll");
    }

    update(identifiableEntity) {
        return this.errorHandler.catch($.ajax({
                url: `${this.url}/${identifiableEntity.id}`,
                method: "PUT",
                data: this.requestConverter(identifiableEntity),
            }).then(it => this.responseConverter(RestUtils.unwrapHAL(it))),
            "update", identifiableEntity);
    }

    insert(identifiableEntity) {
        return this.errorHandler.catch($.ajax({
                url: this.url,
                method: "POST",
                data: this.requestConverter(identifiableEntity),
            }).then(it => this.responseConverter(RestUtils.unwrapHAL(it))),
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
                .then(it => this.responseConverter(RestUtils.unwrapHAL(it))),
            "getById", id);
    }
}