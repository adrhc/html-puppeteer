class EditableListFactory {
    /**
     * When bodyRowTmplId and bodyRowTmplHtml are both null then we won't rely on MustacheTableElemAdapter
     * defaults (i.e. bodyRowTmplId = ${tableId}RowTmpl) but will use readOnlyRow's bodyRowTmplHtml.
     *
     * @param items {IdentifiableEntity[]}
     * @param tableIdOrJQuery {string|jQuery<HTMLTableElement>}
     * @param bodyRowTmplId {string}
     * @param bodyRowTmplHtml {string}
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param state {EditableListState}
     * @param view {SimpleListView}
     * @param readOnlyRow {IdentifiableRowComponent}
     * @param editableRow {IdentifiableRowComponent}
     * @param deletableRow {IdentifiableRowComponent}
     * @param childishBehaviour {ChildishBehaviour}
     * @return {EditableListComponent}
     */
    static create({
                      items = [],
                      tableIdOrJQuery,
                      bodyRowTmplId,
                      bodyRowTmplHtml,
                      readOnlyRow,
                      mustacheTableElemAdapter = new MustacheTableElemAdapter(tableIdOrJQuery, bodyRowTmplId, !!bodyRowTmplHtml ? bodyRowTmplHtml : (!!bodyRowTmplId ? undefined : readOnlyRow.simpleRowView.tableAdapter.bodyRowTmplHtml)),
                      repository = new InMemoryCrudRepository(items),
                      state = new EditableListState(),
                      view = new SimpleListView(mustacheTableElemAdapter),
                      editableRow,
                      deletableRow,
                      childishBehaviour
                  }) {
        const editableListComponent = new EditableListComponent(repository, state, view, readOnlyRow, editableRow, deletableRow);
        if (childishBehaviour) {
            editableListComponent.childishBehaviour = childishBehaviour;
        }
        return editableListComponent;
    }
}