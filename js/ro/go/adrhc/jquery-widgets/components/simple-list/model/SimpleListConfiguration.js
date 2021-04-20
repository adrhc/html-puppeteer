class SimpleListConfiguration extends ComponentConfiguration {
    /**
     * @type {"prepend"|"append"}
     */
    rowPositionOnCreate;
    /**
     * @type {Array}
     */
    items;


    static configOf(elemIdOrJQuery, ...defaults) {
        return ComponentConfiguration._configOf(new SimpleListConfiguration(), elemIdOrJQuery, ...defaults);
    }

    static configWithOverrides(elemIdOrJQuery, ...overrides) {
        return ComponentConfiguration._configWithOverrides(new SimpleListConfiguration(), elemIdOrJQuery, ...overrides);
    }
}