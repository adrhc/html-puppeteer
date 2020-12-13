class FormUtils {
    /**
     * @param $element {jQuery<HTMLElement>}
     * @param owner {string}
     * @return {{}}
     */
    objectifyInputsOf($element, owner) {
        let inputs;
        if (!!owner) {
            inputs = $element.find(`:input[name][data-owner='${owner}']`).serializeArray();
        } else if ($element.is("form")) {
            inputs = $element.serializeArray();
        } else {
            inputs = $element.find(":input[name]").serializeArray();
        }
        return Converters.prototype.mapOfArray(inputs, "value", "name");
    }
}