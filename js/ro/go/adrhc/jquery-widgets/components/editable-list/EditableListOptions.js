class EditableListOptions extends SelectableListOptions {
    /**
     * @type {IdentifiableRowComponent}
     */
    deletableRow;
    /**
     * @type {IdentifiableRowComponent}
     */
    errorRow;
    /**
     * @type {function(extractedEntity: {}): IdentifiableEntity}
     */
    extractedEntityConverterFn;

    /**
     * @param {EditableListOptions} options
     * @param {boolean=} forceDontAutoInitialize
     * @return {EditableListOptions}
     */
    static of(options, forceDontAutoInitialize = options.forceDontAutoInitialize) {
        const editableListOptions = _.defaults(new EditableListOptions(),
            SelectableListOptions.of(options, forceDontAutoInitialize));
        editableListOptions.state = options.state ?? EditableListState.of(editableListOptions);
        return editableListOptions;
    }
}