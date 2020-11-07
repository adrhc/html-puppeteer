class FormsHelper {
    constructor(formId) {
        this.formId = formId;
    }

    objectifyForm() {
        const object = {};
        $(`#${this.formId}`).serializeArray().forEach(it => object[it.name] = it.value);
        return object;
    }
}