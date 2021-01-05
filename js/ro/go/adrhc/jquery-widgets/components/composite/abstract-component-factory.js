/**
 * @interface
 */
class AbstractComponentFactory {
    /**
     * @param $elem {jQuery<HTMLElement>}
     * @param parentState {BasicState}
     * @return {AbstractComponent}
     * @abstract
     */
    create($elem, parentState) {
        throw "Not implemented!";
    }
}