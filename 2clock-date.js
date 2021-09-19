import PeriodicallyStateChangingComponent from "./ro/go/adrhc/app/components/clock/PeriodicallyStateChangingComponent.js";
import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/DebuggerOptionsBuilder.js";

$(() => {
    new PeriodicallyStateChangingComponent(addDebugger().to({
        elemIdOrJQuery: "component",
        interval: 1500
    })).render("wait 1500 ms for a state change");
})