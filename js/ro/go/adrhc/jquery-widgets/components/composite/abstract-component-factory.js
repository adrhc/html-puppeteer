/**
 * @interface
 */
class AbstractComponentFactory {
    /**
     * @param $elem {jQuery<HTMLElement>}
     * @abstract
     */
    create($elem) {
        throw "Not implemented!";
    }
}