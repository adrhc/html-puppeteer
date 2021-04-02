class FormUtils {
    /**
     * JSON.stringify(FormUtils.prototype.objectifyInputsOf($("#dyna-sel-one")))
     * JSON.stringify(FormUtils.prototype.objectifyInputsOf($("#dyna-sel-one"), 'personSearch'))
     *
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
        return Converters.objectFromKeyValues(inputs, "name", "value");
    }
}