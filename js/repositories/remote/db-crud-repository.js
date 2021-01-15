/**
 * also extends DynaSelOneRepository.findByTitle
 */
class DbCrudRepository extends DefaultCrudRepository {
    /**
     * @param serverRelativePath {string}
     * @param [entityFactoryFn] {function(): IdentifiableEntity}
     */
    constructor(serverRelativePath, entityFactoryFn) {
        super(`http://127.0.0.1:8011/${serverRelativePath}`, entityFactoryFn);
    }
}