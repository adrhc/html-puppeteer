/**
 * @interface
 */
class DynaSelOneRepository {
    /**
     * @param title {string}
     */
    findByTitle(title) {
        console.error(`${this.constructor.name}.findByTitle is not implemented!`);
        throw `${this.constructor.name}.findByTitle is not implemented!`;
    }
}