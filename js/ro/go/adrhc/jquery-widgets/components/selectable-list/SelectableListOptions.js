/**
 * @template E
 */
class SelectableListOptions extends SimpleListOptions {
    /**
     * @type {undefined|function(): IdentifiableEntity<E>}
     */
    newEntityFactoryFn;
    /**
     * @type {IdentifiableRowComponent}
     */
    offRow;
    /**
     * @type {IdentifiableRowComponent}
     */
    onRow;
}