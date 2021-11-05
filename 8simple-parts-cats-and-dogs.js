import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import {withPeriodicallyGenerateDogsOrCats} from "./ro/go/adrhc/app/Generators.js";
import {getTotalHeight} from "./ro/go/adrhc/html-puppeteer/util/DomUtils.js";
import PartialStateHolder from "./ro/go/adrhc/html-puppeteer/core/state/PartialStateHolder.js";

$(() => {
    // component creation and rendering
    const component = animate(addDebugger({elemIdOrJQuery: "debugger-component"})
        .withStateHolderProvider(c => new PartialStateHolder(c.config))
        .options());

    // state changing actions (aka component's usage)
    withPeriodicallyGenerateDogsOrCats(part => {
        component.doWithState(sh => sh.replacePart(part.name, part.value));
        $('textarea').height(0);
        $('textarea').height(getTotalHeight);
    });
});