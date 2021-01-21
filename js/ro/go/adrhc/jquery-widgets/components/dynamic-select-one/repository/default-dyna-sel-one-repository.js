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
     * @type {function(): IdentifiableEntity}
     */
    entityFactoryFn;

    /**
     * @param url {string}
     * @param entity {string}
     * @param entityFactoryFn {function(): IdentifiableEntity}
     */
    constructor(url, entity, entityFactoryFn = () => new IdentifiableEntity()) {
        super();
        this.url = url;
        this.entity = entity;
        this.entityFactoryFn = entityFactoryFn;
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
            return items.map(it => $.extend(true, this.entityFactoryFn(), it));
        }).catch(() => alert("Nu s-au putut încărca datele!"));
    }
}