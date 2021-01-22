class DbDynaSelOneRepository extends DefaultDynaSelOneRepository {
    /**
     * @param entity {string}
     * @param [entityConverter] {function(): IdentifiableEntity}
     */
    constructor(entity, entityConverter) {
        super("http://127.0.0.1:8011/dynaselone", entity, entityConverter);
    }
}