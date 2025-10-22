import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes)                                // Получаем ключи из объекта
      .forEach((elementName) => {                       // Перебираем по именам
        elements[elementName].append(                   // в каждый элемент добавляем опции
            ...Object.values(indexes[elementName])      // формируем массив имён, значений опций
                    .map(name =>  {                    // используйте name как значение и текстовое содержимое           
                        const opt = document.createElement('option'); // @todo: создать и вернуть тег опции
                        opt.value = name;
                        opt.textContent = name;
                        return opt;
                      })
        )
     })

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const field = action.dataset.field;   // поле, которое очищаем
            // ищем ближайший контейнер фильтра и в нем - input по name 
            const scope = action.closest('.filter-wrapper, .dropdown-select, .range-inputs') || action.parentElement;
            const input = (field && scope?.querySelector(`[name="${field}"]`)) || scope?.querySelector('input, select, textarea');

            if (input) {
                const tag = input.tagName.toLowerCase();
                switch (tag) {
                case 'input': {
                    switch (input.type) {
                        case 'checkbox':
                        case 'radio': {
                            input.checked = false;
                            break;
                        }
                        default: {
                            input.value = '';
                            break;
                        }
                    }
                    break;
                }
                // если select или textarea и другие c value
                default: {
                    input.value = '';
                    break;
                }
            }
            }

            // для числовых полей тоже сбрасываем
            if (field in state) {
                state[field] = '';
            }
        }
        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    }
}