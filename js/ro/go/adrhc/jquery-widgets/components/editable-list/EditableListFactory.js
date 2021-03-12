class EditableListFactory {
    /**
     * When bodyRowTmplId and bodyRowTmplHtml are both null then we won't rely on MustacheTableElemAdapter
     * defaults (i.e. bodyRowTmplId = ${tableId}RowTmpl) but will use readOnlyRow's bodyRowTmplHtml.
     *
     * @param [items] {IdentifiableEntity[]}
     * @param [tableIdOrJQuery] {string|jQuery<HTMLTableElement>}
     * @param [bodyRowTmplId] {string}
     * @param [bodyRowTmplHtml] {string}
     * @param [mustacheTableElemAdapter] {MustacheTableElemAdapter}
     * @param [repository] {CrudRepository}
     * @param [newItemsGoToTheEndOfTheList] {boolean} whether to append or prepend
     * @param [newEntityFactoryFn] {function(): IdentifiableEntity} used by CrudListState.createNewItem
     * @param [state] {EditableListState}
     * @param [view] {SimpleListView}
     * @param [readOnlyRow] {IdentifiableRowComponent}
     * @param [editableRow] {IdentifiableRowComponent}
     * @param [deletableRow] {IdentifiableRowComponent}
     * @param [childishBehaviour] {ChildishBehaviour}
     * @param [extractedEntityConverterFn] {function(extractedEntity: {}): IdentifiableEntity} used DefaultEntityExtractor.extractEntity
     * @return {EditableListComponent}
     */
    static create({
                      items = [],
                      tableIdOrJQuery,
                      bodyRowTmplId,
                      bodyRowTmplHtml,
                      readOnlyRow,
                      mustacheTableElemAdapter = new MustacheTableElemAdapter(tableIdOrJQuery, bodyRowTmplId, _.defaultTo(bodyRowTmplHtml, bodyRowTmplId != null ? undefined : readOnlyRow.simpleRowView.tableAdapter.bodyRowTmplHtml)),
                      repository = new InMemoryCrudRepository(items),
                      newItemsGoToTheEndOfTheList,
                      newEntityFactoryFn,
                      state = new EditableListState({newEntityFactoryFn, newItemsGoToTheEndOfTheList}),
                      view = new SimpleListView(mustacheTableElemAdapter),
                      editableRow,
                      deletableRow,
                      childishBehaviour,
                      extractedEntityConverterFn
                  }) {
        /*
                const props = DomUtils.dataOf(tableIdOrJQuery);
                const configFn = (config) => $.extend(new ComponentConfiguration(), props, config);
                const config = configFn({});
        */

        /*
                const withDefaults = _.defaults(DomUtils.dataOf(tableIdOrJQuery));
                const config = withDefaults(new ComponentConfiguration());
        */

        /*
                const config = {};
                // const config = new ComponentConfiguration();
                _.extend(config, DomUtils.dataOf(tableIdOrJQuery));
        */

        // const config = ComponentUtil.configOf(tableIdOrJQuery);

        const editableListComponent = new EditableListComponent(repository, state,
            view, readOnlyRow, editableRow, deletableRow, extractedEntityConverterFn);
        if (childishBehaviour) {
            editableListComponent.childishBehaviour = childishBehaviour;
        }
        return editableListComponent;
    }
}