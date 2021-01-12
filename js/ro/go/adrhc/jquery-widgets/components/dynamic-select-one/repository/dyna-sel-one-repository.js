/**
 * @interface
 */
class DynaSelOneRepository {
    /**
     * @param title {string}
     */
    findByTitle(title) {
        throw `${this.constructor.name}.findByTitle is not implemented!`;
    }
}