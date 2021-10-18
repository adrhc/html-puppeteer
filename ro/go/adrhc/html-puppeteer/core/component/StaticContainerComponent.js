import BasicContainerComponent from "./BasicContainerComponent.js";

export default class StaticContainerComponent extends BasicContainerComponent {
    /**
     * No children will be dynamically created hence there's no need for a shell template.
     *
     * @param {SimpleContainerComponentOptions} options
     */
    constructor(options) {
        super({...options, ignoreShellTemplateOptions: true});
    }
}