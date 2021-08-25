class SelectableListOptions extends SimpleListOptions {
    /**
     * @type {function(): IdentifiableEntity}
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
     * @param {SelectableListOptions} options
     * @param {boolean=} forceDontAutoInitialize
     * @return {SelectableListOptions}
     */
    static of(options, forceDontAutoInitialize = options.forceDontAutoInitialize) {
        const selectableListOptions = _.defaults(new SelectableListOptions(),
            SimpleListOptions.of(options, forceDontAutoInitialize));
        selectableListOptions.state = options.state ?? SelectableListState.of(selectableListOptions);
        return selectableListOptions;
    }
}