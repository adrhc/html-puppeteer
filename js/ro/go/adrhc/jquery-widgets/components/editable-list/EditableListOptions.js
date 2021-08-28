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
     * @param {{}} params
     */
    constructor(params) {
        super(params);
        this.state = params?.state ?? EditableListState.of(this);
    }
}