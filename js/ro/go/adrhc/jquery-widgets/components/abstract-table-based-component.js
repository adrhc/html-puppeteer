class AbstractTableBasedComponent extends AbstractComponent {
    /**
     * @type {AbstractTableBasedView}
     */
    tableBasedView;

    /**
     * @param state {BasicState}
     * @param view {AbstractTableBasedView}
     */
    constructor(state, view) {
        super(state, view);
        this.tableBasedView = view;
    }

    /**
     * This is just an "alias" method, a much more expressive one than extractEntity.
     *
     * Derivatives could overwrite extractInputValues or extractEntity to return something very
     * different then a list of entities (e.g. see SelectableListComponent.extractSelectedEntity).
     * PS: extractSelectedEntity was initially extractEntity
     *
     * In order to abey the Liskov Substitution Principle principle (see SOLID principles)
     * the kids shouldn't though do something different; conclusion: I'll relay on the
     * kids to obey Liskov Substitution Principle principle.
     *
     * @param useOwnerOnFields {boolean|undefined}
     * @return {Array<IdentifiableEntity>}
     */
    extractAllEntities(useOwnerOnFields) {
        return this.extractEntity(useOwnerOnFields);
    }
}