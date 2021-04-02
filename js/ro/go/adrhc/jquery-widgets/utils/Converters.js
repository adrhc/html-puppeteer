class Converters {
    /**
     * const formValues = $("#dyna-sel-one").find(":input[name]").serializeArray();
     * JSON.stringify(Converters.objectFromKeyValues(formValues))
     * Converters.objectFromKeyValues([{id: "FR", name: France}, {id: "IT", name: Italy}]) = {"FR": {id: "FR", name: France}, "IT": {id: "IT", name: Italy}}
     *
     * JSON.stringify(Converters.objectFromKeyValues(formValues, "id", "name"))
     * Converters.objectFromKeyValues([{id: "FR", name: France}, {id: "IT", name: Italy}]) = {"FR": France, "IT": Italy}
     *
     * @param array {Array<IdentifiableEntity>}
     * @param [valueField] {string} is used with keyField to extract object properties like `${array[idx].keyField}` having `${array[idx].valueField}` as value
     * @param [keyField] {string}is used with valueField or both are not used (when valueField is missing)
     * @return {*}
     */
    static objectFromKeyValues(array, keyField = "id", valueField) {
        // return array.reduce((accumulator, curr) => ({...accumulator, [curr.id]: curr}), {});
        if (valueField) {
            // {array[idx].keyField: array[idx].valueField}
            return array.reduce((accumulator, curr) =>
                ({...accumulator, [curr[keyField]]: curr[valueField]}), {});
        } else {
            // {array[idx].keyField: array[idx]}
            return array.reduce((accumulator, curr) =>
                ({...accumulator, [curr[keyField]]: curr}), {});
        }
    }
}