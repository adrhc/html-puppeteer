import ClockComponent from "./ro/go/adrhc/app/components/clock/ClockComponent.js";
import {addDebugger} from "./ro/go/adrhc/html-puppeteer/util/DebuggingUtils.js";

$(() => {
    new ClockComponent(addDebugger().to({
        elemIdOrJQuery: "component",
        interval: 2000
    })).render("wait 2s for a state change");
})