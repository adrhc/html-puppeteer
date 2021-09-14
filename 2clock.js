import ClockComponent from "./ro/go/adrhc/app/components/clock/ClockComponent.js";
import {withDebugger} from "./ro/go/adrhc/html-puppeteer/util/DebuggingUtils.js";

$(() => {
    withDebugger(new ClockComponent({
        elemIdOrJQuery: "component",
        initialState: "wait 2s for a state change",
        interval: 2000
    })).render();
})