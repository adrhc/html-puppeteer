/**
 * This is the component's configuration which could be constructed from HTML data-* values.
 */
class SimpleListConfiguration extends ComponentConfiguration {
    /**
     * @type {"prepend"|"append"}
     */
    rowPositionOnCreate;
    /**
     * items formatted as JSON
     *
     * @type {string}
     */
    items;

    /**
     * Evaluation order: props, data-* of props?.elemIdOrJQuery, computed dontAutoInitialize
     *
     * @param {Object=} props are the programmatically (javascript) passed configuration options
     * @return {SimpleListConfiguration} which is the component's configuration
     */
    static of(props) {
        const dontAutoInitialize = AbstractComponent
            .canConstructChildishBehaviour(props?.childishBehaviour, props?.parentComponent);
        return _.defaults(new SimpleListConfiguration(), props,
            DomUtils.dataOf(props?.elemIdOrJQuery), {dontAutoInitialize});
    }
}