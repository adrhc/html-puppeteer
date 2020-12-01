class EntityHelper {
    constructor(formsHelper) {
        this.formsHelper = formsHelper;
    }

    extractEntity() {
        const entity = this.formsHelper.objectifyForm();
        if (EntityUtils.prototype.isTransient(entity)) {
            delete entity.id;
        }
        return entity;
    }
}