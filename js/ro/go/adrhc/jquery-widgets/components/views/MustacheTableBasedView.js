class MustacheTableBasedView extends AbstractTableBasedView {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     */
    constructor(mustacheTableElemAdapter) {
        super(mustacheTableElemAdapter);
    }

    /**
     * @return {MustacheTableElemAdapter}
     */
    get mustacheTableElemAdapter() {
        return this.tableAdapter;
    }
}