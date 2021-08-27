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

    /**
     * @param {{}} options
     */
    constructor(options) {
        super(options);
        const selectableListOptions = _.defaults(new SelectableListOptions(), SimpleListOptions.of(options));
        selectableListOptions.state = options.state ?? SelectableListState.of(selectableListOptions);
        return selectableListOptions;
    }
}