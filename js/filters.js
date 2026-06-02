const FilterState = {
    field: 'all',
    percentile: 'all'
};

const listeners = [];
const countryListeners = [];
let selectedCountry = null;

function notifyListeners() {
    listeners.forEach(fn => fn({ ...FilterState }));
}

function onFilterChange(fn) {
    listeners.push(fn);
}

function setSelectedCountry(countryCode, countryName) {
    selectedCountry = countryCode ? { code: countryCode, name: countryName } : null;
    countryListeners.forEach(fn => fn(selectedCountry));
}

function onCountryChange(fn) {
    countryListeners.push(fn);
}

function getSelectedCountry() {
    return selectedCountry;
}

// --- Custom select implementation ---

function initCustomSelect(wrapEl) {
    const trigger = wrapEl.querySelector('.cs-trigger');
    const menu = wrapEl.querySelector('.cs-menu');
    const valueEl = trigger.querySelector('.cs-value');
    const filterId = trigger.dataset.target;

    function selectOption(li, fireChange = true) {
        menu.querySelectorAll('.cs-option').forEach(o => o.classList.remove('selected'));
        li.classList.add('selected');
        valueEl.textContent = li.textContent;
        trigger.classList.remove('open');
        menu.classList.remove('open');
        menu.style.maxHeight = '0';

        const val = li.dataset.value;
        if (filterId === 'filter-field') {
            FilterState.field = val;
        } else if (filterId === 'filter-percentile') {
            FilterState.percentile = val;
        }
        if (fireChange) notifyListeners();
    }

    trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        const isOpen = menu.classList.contains('open');
        closeAllDropdowns();
        if (!isOpen) {
            trigger.classList.add('open');
            menu.classList.add('open');
            menu.style.maxHeight = menu.scrollHeight + 'px';
        }
    });

    menu.querySelectorAll('.cs-option').forEach(li => {
        li.addEventListener('click', function (e) {
            e.stopPropagation();
            selectOption(this);
        });
    });

    return { trigger, menu, valueEl, selectOption };
}

function closeAllDropdowns() {
    document.querySelectorAll('.cs-trigger.open').forEach(el => el.classList.remove('open'));
    document.querySelectorAll('.cs-menu.open').forEach(el => {
        el.classList.remove('open');
        el.style.maxHeight = '0';
    });
}

function addOptionToFieldSelect(text) {
    const menu = document.getElementById('field-menu');
    const li = document.createElement('li');
    li.className = 'cs-option';
    li.dataset.value = text;
    li.textContent = text;
    li.addEventListener('click', function (e) {
        e.stopPropagation();
        menu.querySelectorAll('.cs-option').forEach(o => o.classList.remove('selected'));
        li.classList.add('selected');
        document.querySelector('#filter-field-wrap .cs-value').textContent = text;
        document.querySelector('#filter-field-wrap .cs-trigger').classList.remove('open');
        menu.classList.remove('open');
        menu.style.maxHeight = '0';
        FilterState.field = text;
        notifyListeners();
    });
    menu.appendChild(li);
}

function initFilters() {
    // Init all custom selects
    document.querySelectorAll('.custom-select').forEach(el => initCustomSelect(el));

    // Close all dropdowns on outside click
    document.addEventListener('click', closeAllDropdowns);

    // Load fields into the field dropdown
    fetch('data/processed/by_field.json')
        .then(r => r.json())
        .then(fields => {
            fields.forEach(f => addOptionToFieldSelect(f.field));
        })
        .catch(() => {});

    // Reset button
    document.getElementById('filter-reset').addEventListener('click', () => {
        const fieldWrap = document.getElementById('filter-field-wrap');
        const percWrap = document.getElementById('filter-percentile-wrap');

        fieldWrap.querySelectorAll('.cs-option').forEach(o => o.classList.toggle('selected', o.dataset.value === 'all'));
        fieldWrap.querySelector('.cs-value').textContent = 'All fields';

        percWrap.querySelectorAll('.cs-option').forEach(o => o.classList.toggle('selected', o.dataset.value === 'all'));
        percWrap.querySelector('.cs-value').textContent = 'All scientists';

        FilterState.field = 'all';
        FilterState.percentile = 'all';
        setSelectedCountry(null, null);
        notifyListeners();
    });
}
