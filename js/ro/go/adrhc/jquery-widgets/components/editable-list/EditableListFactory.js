class EditableListFactory {
    /**
     * When bodyRowTmplId and bodyRowTmplHtml are both null then we won't rely on MustacheTableElemAdapter
     * defaults (i.e. bodyRowTmplId = ${tableId}RowTmpl) but will use readOnlyRow's bodyRowTmplHtml.
     *
     * @param [items] {IdentifiableEntity[]}
     * @param [elemIdOrJQuery] {string|jQuery<HTMLTableElement>}
     * @param [bodyRowTmplId] {string}
     * @param [bodyRowTmplHtml] {string}
     * @param [mustacheTableElemAdapter] {MustacheTableElemAdapter}
     * @param [repository] {CrudRepository}
     * @param [newItemsGoLast] {boolean} whether to append or prepend
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
                      elemIdOrJQuery,
                      bodyRowTmplId,
                      bodyRowTmplHtml,
                      readOnlyRow,
                      mustacheTableElemAdapter = new MustacheTableElemAdapter(elemIdOrJQuery, {
                          bodyRowTmplId,
                          bodyRowTmplHtml: bodyRowTmplHtml ?? bodyRowTmplId != null ?
                              undefined : readOnlyRow.simpleRowView.tableAdapter.bodyRowTmplHtml
                      }),
                      repository = new InMemoryCrudRepository(items),
                      newItemsGoLast,
                      newEntityFactoryFn,
                      state = new EditableListState({newEntityFactoryFn, newItemsGoLast}),
                      view = new SimpleListView(mustacheTableElemAdapter),
                      editableRow,
                      deletableRow,
                      childishBehaviour,
                      extractedEntityConverterFn
                  }) {
        /*
                const props = DomUtils.dataOf(elemIdOrJQuery);
                const configFn = (config) => $.extend(new ComponentConfiguration(), props, config);
                const config = configFn({});
        */

        /*
                const withDataDefaults = fp.defaults(DomUtils.dataOf(elemIdOrJQuery));
                const config = withDataDefaults(new ComponentConfiguration());
        */

        /*
                const config = {};
                // const config = new ComponentConfiguration();
                fp.extend(config, DomUtils.dataOf(elemIdOrJQuery));
        */

        // const config = ComponentUtil.dataAttributesOf(elemIdOrJQuery);

        return new EditableListComponent({
            repository, state, view, offRow: readOnlyRow,
            onRow: editableRow, deletableRow,
            extractedEntityConverterFn, childishBehaviour
        });
    }
}