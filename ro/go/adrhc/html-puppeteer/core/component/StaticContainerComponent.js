import SimpleContainerComponent from "./SimpleContainerComponent.js";

export default class StaticContainerComponent extends SimpleContainerComponent {
    /**
     * @param {SimpleContainerComponentOptions} options
     */
    constructor(options) {
        super({...options, noShellTemplate: true});
    }
}