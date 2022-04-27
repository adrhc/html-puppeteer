import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import {generateString} from "./ro/go/adrhc/app/Generators.js";
import {commonOptionsOf} from "./ro/go/adrhc/app/util/Utils.js";
import {withDefaults} from "./ro/go/adrhc/html-puppeteer/core/component/options/ComponentOptionsBuilder.js";
import {registerComponentType} from "./ro/go/adrhc/html-puppeteer/core/ComponentFactories.js";
import StaticContainerComponent
    from "./ro/go/adrhc/html-puppeteer/core/component/containers/StaticContainerComponent.js";
import RemovableSwitchEventsBinder from "./ro/go/adrhc/app/components/event-binders/RemovableSwitchEventsBinder.js";
import UpdatableSwitchEventsBinder from "./ro/go/adrhc/app/components/event-binders/UpdatableSwitchEventsBinder.js";

$(() => {
    registerComponentType("updatable-switch", (options =>
        new StaticContainerComponent(withDefaults(options)
            .addEventsBinders(c => new UpdatableSwitchEventsBinder(c))
            .options())));
    registerComponentType("removable-switch", (options =>
        new StaticContainerComponent(withDefaults(options)
            .addEventsBinders(c => new RemovableSwitchEventsBinder(c))
            .options())));
    const commonOptions = commonOptionsOf("MAIN-debugger")
    const mainOptions = withDefaults(commonOptions).to({
        childStateProviderFn: () => ({id: Math.random(), name: generateString("name "), status: "readonly"})
    });
    animate({MAIN: mainOptions});
});
