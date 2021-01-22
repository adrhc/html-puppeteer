class DefaultDynaSelOneRepository extends DynaSelOneRepository {
    /**
     * @type {string}
     */
    url;
    /**
     * @type {string}
     */
    entity;
    /**
     * @type {function({}): IdentifiableEntity}
     */
    entityConverter;

    /**
     * @param url {string}
     * @param entity {string}
     * @param entityConverter {function({}): IdentifiableEntity}
     */
    constructor(url, entity, entityConverter = IdentifiableEntity.entityConverter) {
        super();
        this.url = url;
        this.entity = entity;
        this.entityConverter = entityConverter;
    }

    /**
     * @param title {String}
     * @returns {PromiseLike<DynaSelOneItem[]> | Promise<DynaSelOneItem[]>}
     */
    findByTitle(title) {
        return $.ajax({
            url: this.url,
            data: {title: title, entity: this.entity},
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            processData: true
        }).then(data => {
            const items = RestUtils.unwrapHAL(data);
            return items.map(it => this.entityConverter(it));
        }).catch(() => alert("Nu s-au putut încărca datele!"));
    }
}