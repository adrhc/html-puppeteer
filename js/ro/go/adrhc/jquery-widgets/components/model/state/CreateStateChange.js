class CreateStateChange extends TaggedStateChange {
    constructor(stateOrPart, partName) {
        super(CUDTags.CREATE, undefined, stateOrPart, partName);
    }
}