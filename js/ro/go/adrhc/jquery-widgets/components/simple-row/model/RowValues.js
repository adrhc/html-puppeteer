class RowValues {
    values;
    afterRowId;
    beforeRowId;

    constructor(values, {afterRowId, beforeRowId}) {
        this.values = values;
        this.afterRowId = afterRowId;
        this.beforeRowId = beforeRowId;
    }
}