/**
 * also extends DynaSelOneRepository.findByTitle
 */
class DbCrudRepository extends DefaultCrudRepository {
    /**
     * @param serverRelativePath {string}
     * @param [entityConverterFn] {function({}): IdentifiableEntity}
     */
    constructor(serverRelativePath, entityConverterFn) {
        super(`http://127.0.0.1:8011/${serverRelativePath}`, entityConverterFn);
    }
}