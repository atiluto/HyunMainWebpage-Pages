import { CATEGORIES, SOURCES, SEED, parseBrief, mergeRecords, normalizeRecords } from './data.js';

const byId = (id) => document.getElementById(id);
const viewButtons = [...document.querySelectorAll('[data-view]')];
const searchInput = byId('searchInput');
const feedList = byId('feedList');
const detailDialog = byId('detailDialog');
const addDialog = byId('addDialog');
const addForm = byId('addForm');
const importInput = byId('importInput');
const refreshButton = byId('refreshButton');
const categoryBar = byId('categories');
const isLocalHost = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
const categoryNames = new Map(CATEGORIES.map(({ id, label }) => [id, label]));
const storageKey = 'personal-radar:library:v1';
const numberFormat = new Intl.NumberFormat('ko-KR');
const dateFormat = new Intl.DateTimeFormat('ko-KR', {
  month: 'long', day: 'numeric', timeZone: 'Asia/Seoul',
});
const timeFormat = new Intl.DateTimeFormat('ko-KR', {
  hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'Asia/Seoul',
});

function loadLibrary() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

const library = loadLibrary();
const state = {
  view: 'feed',
  category: 'all',
  saved: new Set(Array.isArray(library.saved) ? library.saved : []),
  imported: normalizeRecords(library.imported),
  local: normalizeRecords(library.local),
  manual: normalizeRecords(library.manual),
  checkedAt: Number.isFinite(library.checkedAt) && Number.isFinite(new Date(library.checkedAt).getTime())
    ? library.checkedAt : null,
};

function saveLibrary() {
  try {
    localStorage.setItem(storageKey, JSON.stringify({
      saved: [...state.saved], imported: state.imported, local: state.local,
      manual: state.manual, checkedAt: state.checkedAt,
    }));
    return true;
  } catch {
    return false;
  }
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function icon(name) {
  const svgNamespace = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNamespace, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '20');
  svg.setAttribute('height', '20');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.7');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  if (name === 'arrow') {
    const path = document.createElementNS(svgNamespace, 'path');
    path.setAttribute('d', 'M4 12h15m-6-6 6 6-6 6');
    svg.append(path);
  } else {
    const use = document.createElementNS(svgNamespace, 'use');
    use.setAttribute('href', `#icon-${name}`);
    svg.append(use);
  }
  return svg;
}

function safeUrl(value) {
  try {
    const url = new URL(value);
    if (['http:', 'https:'].includes(url.protocol) && !url.username && !url.password) return url;
  } catch {
    return null;
  }
  return null;
}

function externalLink(value, label, className) {
  const url = safeUrl(value);
  if (!url) return null;
  const link = element('a', className, label);
  link.href = url.href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.append(icon('arrow-up-right'));
  return link;
}

function actionButton(label, className, action) {
  const button = element('button', className, label);
  button.type = 'button';
  button.addEventListener('click', action);
  return button;
}

function symbol(category) {
  const wrapper = element('div', 'item-symbol');
  wrapper.append(icon(category));
  return wrapper;
}

function badge(category) {
  return element('span', 'badge', categoryNames.get(category));
}

function dateLabel(value) {
  return dateFormat.format(new Date(`${value}T12:00:00+09:00`));
}

function allRecords() {
  return mergeRecords(SEED, state.local, state.imported, state.manual);
}

function showDetail(record) {
  const content = byId('detailContent');
  content.dataset.category = record.category;
  const meta = element('div', 'item-meta');
  meta.append(badge(record.category), element('span', '', dateLabel(record.date)));
  if (record.platform) meta.append(element('span', 'item-platform', record.platform));
  if (record.kind === 'manual') meta.append(element('span', '', '직접 추가'));
  if (Number.isFinite(record.score)) meta.append(element('span', '', `편집 점수 ${record.score}/10`));
  const title = element('h2', 'detail-title', record.title);
  title.id = 'detailTitle';
  detailDialog.setAttribute('aria-labelledby', title.id);
  const body = element('p', 'detail-summary', record.summary || '작성한 메모가 없습니다.');
  const links = element('div', 'item-links detail-links');
  for (const source of record.sources) {
    const link = externalLink(source.url, source.label || '원문 보기', 'source-link');
    if (link) links.append(link);
  }
  content.replaceChildren(meta, title, body, links);
  detailDialog.showModal();
}

function toggleSaved(record) {
  const wasSaved = state.saved.delete(record.id);
  if (!wasSaved) state.saved.add(record.id);
  const persisted = saveLibrary();
  render();
  const replacement = [...feedList.querySelectorAll('.bookmark-button')]
    .find((button) => button.dataset.recordId === record.id);
  if (replacement) replacement.focus({ preventScroll: true });
  else if (state.view === 'saved') searchInput.focus({ preventScroll: true });
  announce(wasSaved ? '저장함에서 뺐습니다.' : '저장함에 추가했습니다.', persisted);
}

function itemCard(record) {
  const card = element('article', 'item-card');
  card.dataset.category = record.category;
  const main = element('div', 'item-main');
  const meta = element('div', 'item-meta');
  const date = element('time', '', dateLabel(record.date));
  date.dateTime = record.date;
  meta.append(badge(record.category), date);
  if (record.platform) meta.append(element('span', 'item-platform', record.platform));
  const title = element('h3', 'item-title');
  title.append(actionButton(record.title, 'item-title-button', () => showDetail(record)));
  const links = element('div', 'item-links');
  const source = record.sources[0];
  if (source) {
    const original = externalLink(source.url, '원문 보기', 'source-link');
    if (original) links.append(original);
  }
  const open = actionButton('자세히', 'open-button', () => showDetail(record));
  open.append(icon('arrow'));
  links.append(open);
  main.append(meta, title);
  if (record.summary) main.append(element('p', 'item-summary', record.summary));
  main.append(links);

  const saved = state.saved.has(record.id);
  const bookmark = actionButton('', 'bookmark-button', () => toggleSaved(record));
  bookmark.dataset.recordId = record.id;
  bookmark.title = saved ? '저장함에서 빼기' : '저장함에 추가';
  bookmark.setAttribute('aria-label', `${bookmark.title} — ${record.title}`);
  bookmark.setAttribute('aria-pressed', String(saved));
  bookmark.classList.toggle('is-saved', saved);
  bookmark.append(icon('bookmark'));
  card.append(symbol(record.category), main, bookmark);
  return card;
}

function sourceCard(source) {
  const card = element('article', 'source-card');
  card.dataset.category = source.category;
  const top = element('div', 'source-top');
  top.append(symbol(source.category), badge(source.category));
  const title = element('h3');
  const name = externalLink(source.url, source.title, 'source-title');
  title.append(name || element('span', '', source.title));
  card.append(top, title, element('p', 'source-description', source.description));
  const link = externalLink(source.url, '출처 열기', 'source-link');
  if (link) card.append(link);
  return card;
}

const views = {
  feed: ['수집 피드', '브리핑과 직접 모은 링크를 관심사별로 확인하세요.'],
  saved: ['저장함', '다시 보고 싶은 자료를 모아두는 곳입니다.'],
  sources: ['출처 모음', '관심사별로 참고할 공식 사이트를 모았습니다.'],
};

const chips = new Map();
for (const { id, label } of [{ id: 'all', label: '전체' }, ...CATEGORIES]) {
  const chip = actionButton(label, 'category-chip', () => {
    state.category = id;
    render();
  });
  chip.dataset.category = id;
  const count = element('span', 'category-count');
  chip.append(count);
  categoryBar.append(chip);
  chips.set(id, { chip, count });
}

function setText(id, value) {
  const node = byId(id);
  if (node && node.textContent !== value) node.textContent = value;
}

function updateSyncStatus() {
  if (state.checkedAt) {
    setText('lastUpdated', `최근 동기화 · ${timeFormat.format(new Date(state.checkedAt))}`);
    return;
  }
  setText('lastUpdated', state.imported.length ? '가져온 브리핑' : '초기 브리핑');
}

function showEmpty(message) {
  const empty = byId('emptyState');
  empty.hidden = !message || state.view === 'sources';
  if (message) {
    const caption = byId('emptyDescription') || empty.querySelector('p') || empty;
    caption.textContent = message;
  }
}

function filterItems(items) {
  const terms = searchInput.value.trim().toLocaleLowerCase('ko').split(/\s+/).filter(Boolean);
  return items.filter((item) => {
    if (state.category !== 'all' && item.category !== state.category) return false;
    const haystack = [item.title, item.summary, item.description, item.platform, item.date,
      categoryNames.get(item.category), item.url,
      ...(item.sources || []).flatMap(({ label, url }) => [label, url]),
    ].join(' ').toLocaleLowerCase('ko');
    return terms.every((term) => haystack.includes(term));
  });
}

function render() {
  const records = allRecords();
  const saved = records.filter(({ id }) => state.saved.has(id));
  const isSources = state.view === 'sources';
  const base = isSources ? SOURCES : state.view === 'saved' ? saved : records;
  const visible = filterItems(base);
  const counts = new Map();
  for (const { category } of base) counts.set(category, (counts.get(category) || 0) + 1);

  setText('totalCount', numberFormat.format(records.length));
  setText('savedCount', numberFormat.format(saved.length));
  setText('savedBadge', numberFormat.format(saved.length));
  setText('categoryCount', numberFormat.format(CATEGORIES.length));
  setText('heroCount', numberFormat.format(records.length));
  setText('resultCount', numberFormat.format(visible.length));
  updateSyncStatus();
  setText('feedTitle', views[state.view][0]);
  setText('feedDescription', views[state.view][1]);
  byId('feedPanel').hidden = isSources;
  byId('sourcesPanel').hidden = !isSources;
  const activeList = isSources ? byId('sourceList') : feedList;
  if (categoryBar.parentElement !== activeList.parentElement) activeList.before(categoryBar);

  for (const [id, { chip, count }] of chips) {
    const active = state.category === id;
    chip.classList.toggle('is-active', active);
    chip.setAttribute('aria-pressed', String(active));
    count.textContent = id === 'all' ? base.length : counts.get(id) || 0;
  }

  for (const button of viewButtons) {
    const active = button.dataset.view === state.view;
    button.classList.toggle('is-active', active);
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  }

  if (isSources) {
    const empty = element('p', 'source-empty', '조건에 맞는 출처가 없습니다.');
    byId('sourceList').replaceChildren(...(visible.length ? visible.map(sourceCard) : [empty]));
  } else {
    const direction = byId('sort').value === 'oldest' ? 1 : -1;
    visible.sort((a, b) => direction * a.date.localeCompare(b.date));
    feedList.replaceChildren(...visible.map(itemCard));
    const message = base.length === 0 && state.view === 'saved'
      ? '피드에서 북마크를 누르면 여기에 모입니다.'
      : '관심사를 바꾸거나 다른 검색어를 입력해 보세요.';
    showEmpty(visible.length ? '' : message);
    const clearFilters = byId('clearFilters');
    if (clearFilters) clearFilters.hidden = visible.length > 0 || (state.category === 'all' && !searchInput.value);
  }
}

let toastTimer;
function announce(message, persisted = true) {
  const toast = byId('toast');
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.hidden = false;
  toast.textContent = persisted ? message : `${message} 브라우저 저장 공간에 기록하지 못했습니다.`;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 4500);
}

function changeView(view) {
  if (!Object.hasOwn(views, view) || state.view === view) return;
  state.view = view;
  state.category = 'all';
  searchInput.value = '';
  render();
}

for (const button of viewButtons) button.addEventListener('click', () => changeView(button.dataset.view));
searchInput.addEventListener('input', render);
byId('sort').addEventListener('change', render);
byId('clearFilters')?.addEventListener('click', () => {
  state.category = 'all';
  searchInput.value = '';
  render();
  searchInput.focus();
});

document.addEventListener('keydown', (event) => {
  if (detailDialog.open || addDialog.open) return;
  const isInput = event.target.matches?.('input, textarea, select, [contenteditable]');
  const key = event.key.toLowerCase();
  if ((!isInput && ['k', '/'].includes(key)) || ((event.metaKey || event.ctrlKey) && key === 'k')) {
    event.preventDefault();
    searchInput.focus();
  }
});

byId('closeDetail').addEventListener('click', () => detailDialog.close());
byId('closeAdd').addEventListener('click', () => addDialog.close());
for (const dialog of [detailDialog, addDialog]) {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
}

const categorySelect = addForm.elements.namedItem('category');
if (!categorySelect.options.length) {
  for (const { id, label } of CATEGORIES) categorySelect.add(new Option(label, id));
}

byId('addButton').addEventListener('click', () => {
  addForm.reset();
  formUrl.setCustomValidity('');
  formTitle.setCustomValidity('');
  if (categoryNames.has(state.category)) categorySelect.value = state.category;
  addDialog.showModal();
});

function currentKoreanDate() {
  const koreanNow = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return koreanNow.toISOString().slice(0, 10);
}

const formUrl = addForm.elements.namedItem('url');
const formTitle = addForm.elements.namedItem('title');
formUrl.addEventListener('input', () => formUrl.setCustomValidity(''));
formTitle.addEventListener('input', () => formTitle.setCustomValidity(''));
addForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = new FormData(addForm);
  const title = fields.get('title').trim();
  if (!title) {
    formTitle.setCustomValidity('제목을 입력해 주세요.');
    formTitle.reportValidity();
    return;
  }
  const urlText = fields.get('url').trim();
  const url = urlText ? safeUrl(urlText) : null;
  if (urlText && !url) {
    formUrl.setCustomValidity('http 또는 https로 시작하는 링크를 입력해 주세요.');
    formUrl.reportValidity();
    return;
  }
  const [record] = normalizeRecords([{
    title, category: fields.get('category'), summary: fields.get('summary').trim(),
    date: currentKoreanDate(), kind: 'manual',
    sources: url ? [{ label: url.hostname.replace(/^www\./, ''), url: url.href }] : [],
  }]);
  if (!record) {
    announce('제목과 관심사를 확인해 주세요.');
    return;
  }
  const nextManual = mergeRecords(state.manual, [record]);
  if (nextManual.length === state.manual.length) {
    announce('같은 기록이 이미 있습니다.');
    return;
  }
  state.manual = nextManual;
  addDialog.close();
  state.view = 'feed';
  state.category = 'all';
  searchInput.value = '';
  render();
  announce('수집 피드에 추가했습니다.', saveLibrary());
});

byId('importButton').addEventListener('click', () => importInput.click());
importInput.addEventListener('change', async () => {
  const groups = [];
  let failed = 0;
  for (const file of importInput.files) {
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error('File too large');
      const text = (await file.text()).replace(/^\uFEFF/, '');
      const records = /\.json$/i.test(file.name)
        ? normalizeRecords(JSON.parse(text)) : await parseBrief(text, file.name);
      if (records.length) groups.push(records);
      else failed += 1;
    } catch {
      failed += 1;
    }
  }
  importInput.value = '';
  if (!groups.length) {
    if (failed) announce('읽을 수 있는 브리핑이 없습니다. Markdown 브리핑 또는 JSON 기록 파일을 선택해 주세요.');
    return;
  }
  const previousCount = allRecords().length;
  state.imported = mergeRecords(state.imported, ...groups);
  const added = Math.max(0, allRecords().length - previousCount);
  state.view = 'feed';
  state.category = 'all';
  searchInput.value = '';
  render();
  const feedback = added ? `${added}건을 가져왔습니다.` : '가져오기를 완료했습니다. 새 기록은 없습니다.';
  announce(failed ? `${feedback} 읽지 못한 파일 ${failed}개.` : feedback, saveLibrary());
});

let refreshing = false;
let autoRefreshTimer;

async function refreshLocal(notify = false) {
  if (refreshing) return;
  refreshing = true;
  refreshButton.disabled = true;
  try {
    const response = await fetch('./api/briefs', {
      cache: 'no-store', headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(4500),
    });
    if (!response.ok) throw new Error('Briefs unavailable');
    const { files } = await response.json();
    if (!Array.isArray(files)) throw new Error('Unexpected briefs response');
    const batches = await Promise.all(files.map(({ name, text }) => parseBrief(text, name)));
    const previousCount = allRecords().length;
    const archivedBookmarks = state.local.filter(record => state.saved.has(record.id));
    const local = mergeRecords(archivedBookmarks, ...batches);
    const changed = JSON.stringify(state.local) !== JSON.stringify(local);
    state.local = local;
    const added = Math.max(0, allRecords().length - previousCount);
    state.checkedAt = Date.now();
    if (changed) render();
    else updateSyncStatus();
    const persisted = saveLibrary();
    if (notify) announce(added ? `새 브리핑 ${added}건을 불러왔습니다.` : '로컬 브리핑을 확인했습니다.', persisted);
    if (!autoRefreshTimer) {
      autoRefreshTimer = setInterval(() => {
        if (!document.hidden) void refreshLocal();
      }, 60_000);
    }
  } catch {
    if (notify) announce('로컬 브리핑에 연결할 수 없습니다. 파일 가져오기를 이용해 주세요.');
  } finally {
    refreshing = false;
    refreshButton.disabled = false;
  }
}

if (isLocalHost) {
  refreshButton.addEventListener('click', () => refreshLocal(true));
  void refreshLocal();
} else {
  const label = '브리핑 파일 열기';
  refreshButton.title = label;
  refreshButton.setAttribute('aria-label', label);
  refreshButton.querySelector('use').setAttribute('href', '#icon-import');
  refreshButton.addEventListener('click', () => importInput.click());
}
render();
