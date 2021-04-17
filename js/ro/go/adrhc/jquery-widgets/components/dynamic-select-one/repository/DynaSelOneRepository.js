/**
 * @abstract
 */
class DynaSelOneRepository {
    /**
     * @param title {string}
     * @returns {Promise<DynaSelOneItem[]>}
     */
    findByTitle(title) {
        console.error(`${this.constructor.name}.findByTitle is not implemented!`);
        throw `${this.constructor.name}.findByTitle is not implemented!`;
    }
}