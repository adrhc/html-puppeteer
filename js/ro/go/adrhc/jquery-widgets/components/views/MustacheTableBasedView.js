class MustacheTableBasedView extends AbstractTableBasedView {
    /**
     * @return {MustacheTableElemAdapter}
     */
    get mustacheTableElemAdapter() {
        return this.tableAdapter;
    }

    /**
     * @param {Object} options
     * @param {MustacheTableElemAdapter=} options.mustacheTableElemAdapter
     * @param {{}} mustacheTableElemAdapterOptions
     */
    constructor({mustacheTableElemAdapter, ...mustacheTableElemAdapterOptions}) {
        super(mustacheTableElemAdapter ?? new MustacheTableElemAdapter(mustacheTableElemAdapterOptions));
    }
}