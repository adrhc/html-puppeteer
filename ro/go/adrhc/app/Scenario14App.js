import {namedBtn} from "../html-puppeteer/util/SelectorUtils.js";

export default class Scenario14App {
    /**
     * execute the application
     */
    run(component) {
        $(namedBtn("change-parent-state")).on("click",
            () => {
                component.replaceState(JSON.parse($("#main-debugger").val()));
            });
        $(namedBtn("change-partial-state")).on("click", () => {
            const guestsState = JSON.parse($("#partial-state").val());
            component.replaceParts(guestsState);
        });
    }
}