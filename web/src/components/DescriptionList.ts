import { TemplateResult, html, nothing } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { map } from "lit/directives/map.js";

type DescriptionDesc = string | TemplateResult | typeof nothing;
type DescriptionPair = [string, DescriptionDesc];
type DescriptionRecord = { term: string; desc: DescriptionDesc };

interface DescriptionConfig {
    horizontal: boolean;
    compact: boolean;
    twocolumn: boolean;
    threecolumn: boolean;
}

const isDescriptionRecordCollection = (v: Array<any>): v is DescriptionRecord[] =>
    v.length > 0 && typeof v[0] === "object" && !Array.isArray(v[0]);

function renderDescriptionGroup([term, description]: DescriptionPair) {
    return html` <div class="pf-c-description-list__group">
        <dt class="pf-c-description-list__term">
            <span class="pf-c-description-list__text">${term}</span>
        </dt>
        <dd class="pf-c-description-list__description">
            <div class="pf-c-description-list__text">${description}</div>
        </dd>
    </div>`;
}

function recordToPair({ term, desc }: DescriptionRecord): DescriptionPair {
    return [term, desc];
}

function alignTermType(terms: DescriptionRecord[] | DescriptionPair[] = []) {
    if (isDescriptionRecordCollection(terms)) {
        return terms.map(recordToPair);
    }
    return terms ?? [];
}

/**
 * renderDescriptionList
 *
 * This function renders the most common form of the PatternFly description list used in our code.
 * It expects either an array of term/description pairs or an array of `{ term: string, description:
 * string | TemplateResult }`.
 *
 * An optional dictionary of configuration options is available. These enable the Patternfly
 * "horizontal," "compact", "2 column on large," or "3 column on large" layouts that are (so far)
 * the layouts used in Authentik's (and Gravity's, for that matter) code.
 *
 * This is not a web component and it does not bring its own styling ; calling code will still have
 * to provide the styling necessary. It is only a function to replace the repetitious boilerplate of
 * routine description lists. Its output is a standard TemplateResult that will be fully realized
 * within the context of the DOM or ShadowDOM in which it is called.
 */

export function renderDescriptionList(
    terms: DescriptionRecord[] | DescriptionPair[] = [],
    config: DescriptionConfig = {
        horizontal: false,
        compact: false,
        twocolumn: false,
        threecolumn: false,
    }
) {
    const checkedTerms = alignTermType(terms);
    const classes = classMap({
        "pf-m-horizontal": config.horizontal,
        "pf-m-compact": config.compact,
        "pf-m-2-col-on-lg": config.twocolumn,
        "pf-m-3-col-on-lg": config.threecolumn,
    });

    return html`
        <dl class="pf-c-description-list ${classes}">
            ${map(checkedTerms, renderDescriptionGroup)}
        </dl>
    `;
}

export default renderDescriptionList;
