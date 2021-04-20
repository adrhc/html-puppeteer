class RowConfiguration extends ComponentConfiguration {
    /**
     * @type {"prepend"|"append"}
     */
    rowPositionOnCreate;

    /**
     * @param {string|jQuery<HTMLElement>|function(): jQuery<HTMLElement>} elemIdOrJQuery
     * @param {Object=} defaults are applied from left to right (first applied wins)
     * @return {RowConfiguration}
     */
    static configOf(elemIdOrJQuery, ...defaults) {
        return ComponentConfiguration._configOf(new RowConfiguration(), elemIdOrJQuery, ...defaults);
    }

    /**
     * @param {string|jQuery<HTMLElement>|function(): jQuery<HTMLElement>} elemIdOrJQuery
     * @param {Object=} overrides are applied from left to right (first applied wins)
     * @return {RowConfiguration}
     */
    static configWithOverrides(elemIdOrJQuery, ...overrides) {
        return ComponentConfiguration._configWithOverrides(new RowConfiguration(), elemIdOrJQuery, ...overrides);
    }
}