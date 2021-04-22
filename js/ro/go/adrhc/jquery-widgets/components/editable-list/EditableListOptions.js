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
}