import StaticContainerComponent from "./StaticContainerComponent.js";

const ACTIVE_COMPONENT = "activePartName";

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
     * @param {PartName} partName
     */
    switchTo(partName) {
        const activeComponent = this.getActiveComponent();
        const activeState = activeComponent.getStateCopy();
        const switchToComponent = this.childrenComponents.getChildByPartName(partName);
        activeComponent.close();
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