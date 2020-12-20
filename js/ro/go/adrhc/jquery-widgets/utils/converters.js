class Converters {
    /**
     * JSON.stringify(Converters.prototype.mapOfArray($("#dyna-sel-one").find(":input[name]").serializeArray(), "value", "name"))
     * JSON.stringify(Converters.prototype.mapOfArray($("#dyna-sel-one").find(":input[name][data-owner='personSearch']").serializeArray(), "value", "name"))
     *
     * @param array {Array<IdentifiableEntity>}
     * @param valueField {string}
     * @param keyField {string}
     * @return {*}
     */
    mapOfArray(array, valueField, keyField = "id") {
        // return array.reduce((accumulator, curr) => ({...accumulator, [curr.id]: curr}), {});
        if (valueField) {
            return array.reduce((accumulator, curr) =>
                ({...accumulator, [curr[keyField]]: curr[valueField]}), {});
        } else {
            return array.reduce((accumulator, curr) =>
                ({...accumulator, [curr[keyField]]: curr}), {});
        }
    }
}