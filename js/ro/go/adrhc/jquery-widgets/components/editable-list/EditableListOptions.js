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
     * @param {{}} options
     */
    constructor(options) {
        super(options);
        ObjectUtils.copyDeclaredProperties(this, options)
        this.state = options.state ?? EditableListState.of(this);
    }
}