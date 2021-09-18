import ClockComponent from "./ro/go/adrhc/app/components/clock/ClockComponent.js";
import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/DebuggerOptionsBuilder.js";

$(() => {
    new ClockComponent(addDebugger().to({
        elemIdOrJQuery: "component",
        interval: 1500
    })).render("wait 1500 ms for a state change");
})