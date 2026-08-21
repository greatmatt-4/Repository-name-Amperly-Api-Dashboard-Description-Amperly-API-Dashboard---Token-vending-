const apiBase = window.location.origin;

async function vendToken(formEl) {
  const fd = new FormData(formEl);
  const body = {
    ref: fd.get('ref'),
    meterNo: fd.get('meterNo') || undefined,
    hasLight: fd.get('hasLight') || undefined
  };
  const res = await fetch(apiBase + '/api/vend-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

async function confirmLight(formEl) {
  const fd = new FormData(formEl);
  const body = {
    ref: fd.get('ref'),
    hasLight: fd.get('hasLight') === '1'
  };
  const res = await fetch(apiBase + '/api/confirm-light', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

async function loadTokens() {
  const res = await fetch(apiBase + '/api/tokens');
  return res.json();
}

document.getElementById('vendForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const out = document.getElementById('vendResult');
  out.textContent = '...';
  try {
    const r = await vendToken(e.target);
    out.textContent = JSON.stringify(r, null, 2);
    loadAndShowTokens();
  } catch (err) {
    out.textContent = String(err);
  }
});

document.getElementById('confirmForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const out = document.getElementById('confirmResult');
  out.textContent = '...';
  try {
    const r = await confirmLight(e.target);
    out.textContent = JSON.stringify(r, null, 2);
  } catch (err) {
    out.textContent = String(err);
  }
});

async function loadAndShowTokens(){
  const t = document.getElementById('tokens');
  t.textContent = 'loading...';
  try {
    const rows = await loadTokens();
    t.textContent = JSON.stringify(rows, null, 2);
  } catch (err) {
    t.textContent = String(err);
  }
}

document.getElementById('refreshTokens').addEventListener('click', loadAndShowTokens);
loadAndShowTokens();
