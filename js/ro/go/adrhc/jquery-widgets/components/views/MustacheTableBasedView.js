class MustacheTableBasedView extends AbstractTableBasedView {
    /**
     * @return {MustacheTableElemAdapter}
     */
    get mustacheTableElemAdapter() {
        return this.tableAdapter;
    }
}