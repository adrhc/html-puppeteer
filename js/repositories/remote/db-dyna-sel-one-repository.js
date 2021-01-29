class DbDynaSelOneRepository extends DefaultDynaSelOneRepository {
    /**
     * @param entity {string}
     * @param [responseConverter] {function(): IdentifiableEntity}
     */
    constructor(entity, responseConverter) {
        super("http://127.0.0.1:8011/dynaselone", entity, responseConverter);
    }
}