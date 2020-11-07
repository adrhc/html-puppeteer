class ObjectUtils {
    copyUsingTemplate(objectToCopy, objectStructure) {
        const result = {};
        for (let p in objectStructure) {
            if (!objectStructure.hasOwnProperty(p)) {
                continue;
            }
            result[p] = objectToCopy[p];
        }
        return result;
    }
}