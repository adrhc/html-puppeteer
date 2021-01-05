/**
 * @interface
 */
class AbstractComponentFactory {
    /**
     * @param $elem {jQuery<HTMLElement>}
     * @return {AbstractComponent}
     * @abstract
     */
    create($elem) {
        throw "Not implemented!";
    }
}