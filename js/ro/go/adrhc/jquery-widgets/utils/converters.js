class Converters {
    /**
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