import {rules, createComparison, compare} from "../lib/compare.js";


export function initSearching(searchField = 'search') {
    // @todo: #5.1 — настроить компаратор
    const compare = createComparison(
        ['skipEmptyTargetValues'],
        [rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)]
    );

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        const target = { [searchField]: state[searchField] };
        return data.filter(row => compare(row, target));
    }
}