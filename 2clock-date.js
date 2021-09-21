import PeriodicallyStateChangingComponent from "./ro/go/adrhc/app/components/periodically-state-changing/PeriodicallyStateChangingComponent.js";
import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";

$(() => {
    new PeriodicallyStateChangingComponent(addDebugger().to({
        elemIdOrJQuery: "component",
        interval: 1000
    })).render("wait 1000 ms for a state change");
})