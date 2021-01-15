class DbDynaSelOneRepository extends DefaultDynaSelOneRepository {
    /**
     * @param entity {string}
     * @param [entityFactoryFn] {function(): IdentifiableEntity}
     */
    constructor(entity, entityFactoryFn) {
        super("http://127.0.0.1:8011/dynaselone", entity, entityFactoryFn);
    }
}