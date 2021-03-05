class DeleteStateChange extends TaggedStateChange {
    constructor(previousStateOrPart, partName) {
        super(CUDTags.DELETE, previousStateOrPart, undefined, partName);
    }
}