// Filters en sortering op /vergelijken/. Alleen tonen of verbergen; de volgorde komt uit de data (score, prijs, naam).
const form = document.getElementById('filters');
const tbody = document.querySelector('#matrix tbody');
const rows = [...tbody.rows];
const count = document.getElementById('f-count');
const empty = document.getElementById('f-empty');
const idsBox = document.getElementById('f-ids');
const sort = document.getElementById('f-sort');
const params = new URLSearchParams(location.search);
let ids = (params.get('ids') || '').split(',').filter((x) => rows.some((r) => r.dataset.id === x));

function apply() {
  const budget = Number(form['f-budget'].value || Infinity);
  const prod = Number(form['f-prod'].value || 0);
  const need = [...form.querySelectorAll('input[name=need]:checked')].map((i) => i.value);
  let n = 0;
  for (const r of rows) {
    const d = r.dataset;
    const max = d.max === 'inf' || d.max === 'nv' ? Infinity : Number(d.max);
    const ok = (!ids.length || ids.includes(d.id)) && Number(d.prijs) <= budget && max >= prod && need.every((k) => d[k] === 'ja' || d[k] === 'deels');
    r.hidden = !ok; if (ok) n++;
  }
  count.textContent = `${n} van ${rows.length} platforms`;
  empty.hidden = n > 0;
}
function order() {
  const k = sort.value;
  const by = { score: (a, b) => b.dataset.score - a.dataset.score || a.dataset.prijs - b.dataset.prijs, prijs: (a, b) => a.dataset.prijs - b.dataset.prijs || b.dataset.score - a.dataset.score, naam: (a, b) => a.cells[0].textContent.localeCompare(b.cells[0].textContent, 'nl') }[k];
  [...rows].sort(by).forEach((r) => tbody.appendChild(r));
}
if (ids.length) {
  idsBox.hidden = false;
  idsBox.innerHTML = `Je ziet ${ids.length} platforms uit je match. <button type="button" class="linkbtn" id="f-all">Toon alle platforms</button>`;
  document.getElementById('f-all').addEventListener('click', () => { ids = []; idsBox.hidden = true; history.replaceState(null, '', location.pathname); apply(); });
}
form.addEventListener('change', apply);
form.addEventListener('submit', (e) => e.preventDefault());
sort.addEventListener('change', order);
apply();
