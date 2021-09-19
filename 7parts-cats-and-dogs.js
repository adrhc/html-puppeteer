import PUPPETEER from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import COMPONENTS_FACTORY from "./ro/go/adrhc/html-puppeteer/core/ComponentsFactories.js";
import PeriodicallyStateChangingComponent
    from "./ro/go/adrhc/app/components/periodically-state-changing/PeriodicallyStateChangingComponent.js";
import {generateDogsOrCats} from "./ro/go/adrhc/app/Generators.js";
import Scenario6EventsBinder from "./ro/go/adrhc/app/scenarios/6puppeteer+state-button/Scenario6EventsBinder.js";
import {addClockDebugger} from "./ro/go/adrhc/app/components/periodically-state-changing/PeriodicallyStateChangingOptionsBuilder.js";

$(() => {
    COMPONENTS_FACTORY.registerComponentType("periodically-state-changing", (options) => new PeriodicallyStateChangingComponent(options));
    PUPPETEER.animate(addClockDebugger({debuggerElemIdOrJQuery: "internal-clock-debugger"})
        .doPeriodicallyWithState(stateHolder => {
            if (stateHolder.currentState == null) {
                stateHolder.replace({interval: stateHolder.config.interval});
            }
            const part = generateDogsOrCats(5);
            stateHolder.replacePart(part.value, part.name);
        })
        .addDebugger({debuggerElemIdOrJQuery: "component-debugger"})
        .to({
            eventsBinder: new Scenario6EventsBinder()
        }));
});