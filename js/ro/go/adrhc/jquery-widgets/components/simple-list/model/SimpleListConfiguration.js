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
     * @param {string|jQuery<HTMLElement>|function(): jQuery<HTMLElement>} elemIdOrJQuery
     * @param {Object=} defaults are applied from left to right (first applied wins)
     * @return {SimpleListConfiguration}
     */
    static configOf(elemIdOrJQuery, ...defaults) {
        return ComponentConfiguration._configOf(new SimpleListConfiguration(), elemIdOrJQuery, ...defaults);
    }

    /**
     * @param {string|jQuery<HTMLElement>|function(): jQuery<HTMLElement>} elemIdOrJQuery
     * @param {Object=} overrides are applied from left to right (first applied wins)
     * @return {SimpleListConfiguration}
     */
    static configWithOverrides(elemIdOrJQuery, ...overrides) {
        return ComponentConfiguration._configWithOverrides(new SimpleListConfiguration(), elemIdOrJQuery, ...overrides);
    }
}