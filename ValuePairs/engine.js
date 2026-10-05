const lsKey = 'valuePairs';
const storageKey = 'valuePairsListsV2';
const $ = id => document.getElementById(id);
const vField = $('valueText'), addButton = $('addValButton'),
    monitor = $('monitor').querySelector('tbody'), recalcButton = $('recalc'),
    resetButton = $('reset'), fPairButton = $('FirstOfThePair'),
    sPairButton = $('SecondOfThePair'), recalcGUI = $('recalcGUI'), regularGUI = $('regularGUI');

// The original Base, pair iterator and one-point-per-choice scoring remain the core.
class Base {
    constructor({vField, addButton, monitor, recalcButton, lsKey, fPairButton, sPairButton, recalcGUI, regularGUI, resetButton}) {
        Object.assign(this, {vField, addButton, monitor, recalcButton, lsKey, fPairButton, sPairButton, recalcGUI, regularGUI, resetButton});
        this.readBase();
        $('enterIt').addEventListener('submit', e => { e.preventDefault(); this.addItem(this.vField.value); });
        resetButton.addEventListener('click', () => this.resetSums());
        recalcButton.addEventListener('click', () => this.start());
        $('pause').addEventListener('click', () => this.showRegular());
        $('undo').addEventListener('click', () => this.undo());
        $('newList').addEventListener('click', () => this.newList());
        $('deleteList').addEventListener('click', () => this.deleteList());
        $('listName').addEventListener('input', () => { this.current.name = $('listName').value; this.saveBase(); });
        $('listName').addEventListener('blur', () => {
            this.current.name = this.current.name.trim() || 'Новый список';
            $('listName').value = this.current.name;
            this.saveBase();
        });
    }
    get current() { return this.data.lists.find(list => list.id === this.data.activeId); }
    makeList(name = 'Новый список', items = []) {
        return {id: crypto.randomUUID(), name, items, session: null};
    }
    message(text) { $('notice').textContent = text; $('notice').classList.toggle('hidden', !text); }
    readBase() {
        try {
            const raw = localStorage.getItem(storageKey);
            if (raw) {
                this.data = JSON.parse(raw);
                if (!this.validData(this.data)) throw new Error('Invalid saved lists');
                // Preserve answered pairs from older sessions; shuffle only the rest.
                this.data.lists.forEach(list => {
                    if (list.session && !list.session.pairs) {
                        list.session.pairs = this.shufflePairs(this.makePairs(list.items.length), list.session.history.length);
                    }
                });
            } else {
                const legacyRaw = localStorage.getItem(this.lsKey);
                const legacy = legacyRaw ? JSON.parse(legacyRaw) : [];
                if (!this.validItems(legacy)) throw new Error('Invalid legacy list');
                const list = this.makeList(legacy.length ? 'Мои ценности' : 'Мой первый список', legacy);
                this.data = {version: 2, activeId: list.id, lists: [list]};
                if (legacy.length) this.message('Ваш прежний список перенесён в «Мои ценности».');
            }
        } catch (error) {
            // Keep the original storage untouched so malformed data can be recovered.
            this.storageBlocked = true;
            const list = this.makeList('Мой первый список');
            this.data = {version: 2, activeId: list.id, lists: [list]};
            this.message('Не удалось прочитать сохранённые данные. Они не перезаписаны. Новые изменения пока доступны только в этой вкладке.');
        }
        this.base = this.current.items;
        $('listName').value = this.current.name;
        this.saveBase();
    }
    validItems(items) {
        return Array.isArray(items) && items.every(item => item && typeof item.desc === 'string' && Number.isInteger(item.sum) && item.sum >= 0);
    }
    validData(data) {
        if (!data || data.version !== 2 || !Array.isArray(data.lists) || !data.lists.length) return false;
        const ids = new Set();
        for (const list of data.lists) {
            if (!list || typeof list.id !== 'string' || ids.has(list.id) || typeof list.name !== 'string' || !this.validItems(list.items)) return false;
            ids.add(list.id);
            if (list.session !== null) {
                const session = list.session;
                if (!session || !Array.isArray(session.history) || list.items.length < 2) return false;
                const pairs = session.pairs === undefined ? this.makePairs(list.items.length) : session.pairs;
                const total = list.items.length * (list.items.length - 1) / 2;
                if (!Array.isArray(pairs) || pairs.length !== total) return false;
                const seen = new Set();
                for (const pair of pairs) {
                    if (!Array.isArray(pair) || pair.length !== 2 || pair.some(index => !Number.isInteger(index) || index < 0 || index >= list.items.length) || pair[0] === pair[1]) return false;
                    const key = Math.min(...pair) + ':' + Math.max(...pair);
                    if (seen.has(key)) return false;
                    seen.add(key);
                }
                if (session.history.length > pairs.length || session.history.some((winner, i) => !pairs[i].includes(winner))) return false;
                const scores = list.items.map(() => 0);
                session.history.forEach(winner => scores[winner]++);
                if (list.items.some((item, i) => item.sum !== scores[i])) return false;
            }
        }
        return ids.has(data.activeId);
    }
    saveBase() {
        if (!this.storageBlocked) {
            try { localStorage.setItem(storageKey, JSON.stringify(this.data)); this.storageFailed = false; }
            catch (error) { this.storageFailed = true; }
        }
        $('storageStatus').textContent = this.storageBlocked || this.storageFailed
            ? 'Сохранение недоступно. Изменения останутся только до закрытия этой вкладки.'
            : 'Списки и выборы сохраняются автоматически в этом браузере на устройстве. Очистка данных сайта удалит их.';
        this.reloadMonitor();
        this.renderLists();
    }
    renderLists() {
        $('lists').replaceChildren();
        this.data.lists.forEach(list => {
            const button = document.createElement('button');
            button.className = 'list-option' + (list.id === this.data.activeId ? ' active' : '');
            button.setAttribute('aria-current', list.id === this.data.activeId ? 'true' : 'false');
            const name = document.createElement('strong'); name.textContent = list.name || 'Новый список';
            const detail = document.createElement('span');
            const total = list.items.length * (list.items.length - 1) / 2;
            detail.textContent = `Вариантов: ${list.items.length}` + (list.session ? ` · ${list.session.history.length === total ? 'Готово' : list.session.history.length + '/' + total}` : '');
            button.append(name, detail);
            button.onclick = () => this.selectList(list.id);
            $('lists').append(button);
        });
    }
    selectList(id) {
        this.data.activeId = id;
        this.base = this.current.items;
        this.vField.value = '';
        $('listName').value = this.current.name;
        this.message(''); this.showRegular(); this.saveBase();
    }
    newList() {
        const list = this.makeList(); this.data.lists.push(list); this.selectList(list.id);
        $('listName').focus(); $('listName').select();
    }
    deleteList() {
        if (!confirm(`Удалить список «${this.current.name}» и все его выборы?`)) return;
        this.data.lists = this.data.lists.filter(list => list.id !== this.data.activeId);
        if (!this.data.lists.length) this.data.lists.push(this.makeList('Мой первый список'));
        this.selectList(this.data.lists[0].id);
    }
    totalPairs() { return this.base.length * (this.base.length - 1) / 2; }
    clearForEdit() {
        if ((this.current.session || this.base.some(item => item.sum)) && !confirm('Изменение вариантов сбросит выборы и рейтинг этого списка. Продолжить?')) return false;
        this.current.session = null;
        this.base.forEach(item => item.sum = 0);
        return true;
    }
    addItem(desc) {
        desc = desc.trim();
        if (!desc) { this.message('Введите название варианта.'); return false; }
        if (this.base.some(entry => entry.desc.toLocaleLowerCase('ru') === desc.toLocaleLowerCase('ru'))) {
            this.message('Такой вариант уже есть в списке.'); return false;
        }
        if (!this.clearForEdit()) return false;
        this.base.push({desc, sum: 0}); this.vField.value = '';
        this.message(''); this.saveBase(); this.vField.focus();
    }
    delItem(index = 0) {
        if (!confirm(`Удалить вариант «${this.base[index].desc}»?`)) return;
        if (!this.clearForEdit()) return;
        this.base.splice(index, 1); this.saveBase();
    }
    addSum(index = 0) { this.base[index].sum += 1; }
    resetSums() {
        if (!confirm('Сбросить все выборы и баллы этого списка? Варианты останутся.')) return;
        this.base.forEach(field => field.sum = 0); this.current.session = null;
        this.showRegular(); this.message('Выборы сброшены. Можно сравнить варианты заново.'); this.saveBase();
    }
    start() {
        if (this.base.length < 2) return;
        const session = this.current.session;
        if (!session || session.history.length === this.totalPairs()) {
            if (this.base.some(item => item.sum) && !confirm('Начать новое сравнение? Прежние баллы этого списка будут сброшены.')) return;
            this.base.forEach(item => item.sum = 0);
            this.current.session = {history: [], pairs: this.shufflePairs(this.makePairs(this.base.length))};
        }
        this.message(''); this.regularGUI.classList.add('hidden'); this.recalcGUI.classList.remove('hidden');
        this.saveBase(); this.resume();
    }
    resume() {
        const iterator = this[Symbol.iterator]();
        for (let i = 0; i < this.current.session.history.length; i++) iterator.next();
        this.recalc(iterator);
    }
    recalc(iterator) {
        const position = iterator.next();
        if (position.done) {
            this.showRegular(); this.saveBase(); this.message('Рейтинг готов. Чем больше баллов, тем чаще вы выбирали этот вариант.'); return;
        }
        const completed = this.current.session.history.length, total = this.totalPairs();
        $('progressText').textContent = `Пара ${completed + 1} из ${total}`;
        $('progressPercent').textContent = `${Math.round(completed / total * 100)}%`;
        $('progress').max = total; $('progress').value = completed;
        $('undo').disabled = completed === 0;
        const choose = index => {
            this.addSum(index); this.current.session.history.push(index); this.saveBase(); this.recalc(iterator);
        };
        this.fPairButton.textContent = this.base[position.value.fpos].desc;
        this.sPairButton.textContent = this.base[position.value.spos].desc;
        // Avoid a second click from an accidental double-click choosing the next pair.
        this.fPairButton.onclick = e => { if (e.detail <= 1) choose(position.value.fpos); };
        this.sPairButton.onclick = e => { if (e.detail <= 1) choose(position.value.spos); };
    }
    undo() {
        const history = this.current.session.history;
        if (!history.length) return;
        this.base[history.pop()].sum--; this.saveBase(); this.resume();
    }
    showRegular() { this.regularGUI.classList.remove('hidden'); this.recalcGUI.classList.add('hidden'); }
    sort() {
        // Sort a view: the stored order must stay stable for saved pair positions.
        return this.base.map((field, index) => ({field, index})).sort((a, b) => b.field.sum - a.field.sum || a.index - b.index);
    }
    reloadMonitor() {
        this.monitor.replaceChildren();
        const session = this.current.session, total = this.totalPairs();
        const completed = session && session.history.length === total;
        let previousScore, rank = 0;
        this.sort().forEach(({field, index}, i) => {
            const row = document.createElement('tr'), name = document.createElement('td'), score = document.createElement('td'), actions = document.createElement('td');
            if (completed) {
                if (field.sum !== previousScore) rank = i + 1;
                previousScore = field.sum;
                const place = document.createElement('span'); place.className = 'rank'; place.textContent = rank + '.'; name.append(place);
            }
            name.append(document.createTextNode(field.desc)); score.textContent = field.sum;
            const remove = document.createElement('button'); remove.className = 'deleter'; remove.textContent = '×';
            remove.setAttribute('aria-label', 'Удалить вариант ' + field.desc); remove.onclick = () => this.delItem(index);
            actions.append(remove); row.append(name, score, actions); this.monitor.append(row);
        });
        $('emptyState').classList.toggle('hidden', this.base.length > 0);
        $('tableWrap').classList.toggle('hidden', this.base.length === 0);
        $('listSummary').textContent = `Вариантов: ${this.base.length} · Пар: ${total}`;
        this.recalcButton.disabled = this.base.length < 2;
        this.recalcButton.textContent = session ? (completed ? 'Сравнить заново' : 'Продолжить сравнение') : 'Начать сравнение';
        this.resetButton.disabled = !session && !this.base.some(item => item.sum);
        $('ratingNote').classList.toggle('hidden', !this.base.length);
        $('ratingNote').textContent = completed ? '1 балл за каждый выбор. При равных баллах варианты делят место: однозначного предпочтения нет.'
            : session ? `Сравнение не завершено: ${session.history.length} из ${total} пар. Баллы пока предварительные.`
            : this.base.some(item => item.sum) ? 'Баллы из прежней версии сохранены. Начните новое сравнение, чтобы получить полный рейтинг.'
            : 'Каждая пара сравнивается один раз. Выбранный вариант получает 1 балл.';
    }
    makePairs(count) {
        const pairs = [];
        for (let fpos = 0; fpos < count - 1; fpos++) {
            for (let spos = fpos + 1; spos < count; spos++) pairs.push([fpos, spos]);
        }
        return pairs;
    }
    shufflePairs(pairs, start = 0) {
        // Fisher–Yates: every pair appears exactly once, in a random order.
        for (let i = pairs.length - 1; i > start; i--) {
            const j = start + Math.floor(Math.random() * (i - start + 1));
            [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
        }
        // Also vary which option appears on the left; save this with the order.
        for (let i = start; i < pairs.length; i++) {
            if (Math.random() < 0.5) pairs[i].reverse();
        }
        return pairs;
    }
    [Symbol.iterator]() {
        const pairs = this.current.session?.pairs || this.makePairs(this.base.length);
        let index = 0;
        return {
            next() {
                if (index >= pairs.length) return {done: true};
                const [fpos, spos] = pairs[index++];
                return {done: false, value: {fpos, spos}};
            }
        };
    }
}
let base = new Base({vField, addButton, monitor, recalcButton, lsKey, recalcGUI, regularGUI, sPairButton, fPairButton, resetButton});
