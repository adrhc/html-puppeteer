class FormUtils {
    objectifyInputsOf($element) {
        const object = {};
        let inputs;
        if ($element.is("form")) {
            inputs = $element.serializeArray();
        } else {
            inputs = $element.find(":input[name]").serializeArray();
        }
        inputs.forEach(it => object[it.name] = it.value);
        return object;
    }
}