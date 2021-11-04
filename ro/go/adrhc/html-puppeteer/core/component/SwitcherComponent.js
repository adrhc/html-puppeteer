import StaticContainerComponent from "./StaticContainerComponent.js";
import {USE_CSS} from "../view/SimpleView.js";

/**
 * @template SCT, SCP
 * @extends {StaticContainerComponent}
 */
export default class SwitcherComponent extends StaticContainerComponent {
    /**
     * @return {SCT}
     */
    get activePartName() {
        return this.getMutableState();
    }

    /**
     * @param {StaticContainerComponentOptions} options
     * @param {ViewRemovalStrategy} options.childrenRemovalStrategy
     * @param {StaticContainerComponentOptions=} restOfOptions
     */
    constructor({childrenRemovalStrategy, ...restOfOptions}) {
        super({childrenRemovalStrategy: USE_CSS, ...restOfOptions});
    }

    /**
     * Completely replaces the component's state and creates the children.
     *
     * @param {SCT=} newState
     */
    replaceState(newState) {
        super.replaceState(newState);
        this.switchTo(newState);
    }

    /**
     * @param {SCT|PartName} partName
     */
    switchTo(partName) {
        const activeComponent = this.getActiveComponent();
        const activeState = activeComponent?.getStateCopy();
        const switchToComponent = this.childrenComponents.getChildByPartName(partName);
        activeComponent?.close();
        switchToComponent.render(activeState);
    }

    /**
     * @return {AbstractComponent}
     */
    getActiveComponent() {
        const activePartName = this.activePartName;
        return this.childrenComponents.getChildByPartName(activePartName);
    }
}