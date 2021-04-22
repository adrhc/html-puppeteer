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
}