const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const db = require('./db');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve client static files (optional)
app.use('/', express.static(path.join(__dirname, '..', 'client')));

// Helper: create token string and hashed token
function generateToken() {
  return crypto.randomBytes(24).toString('hex');
}
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// POST /api/vend-token
// body: { ref, meterNo, response, signalStrength, tokenHash (optional), hasLight, voltage }
app.post('/api/vend-token', (req, res) => {
  try {
    const { ref, meterNo, response = 'ACCEPT', signalStrength = null, hasLight = null, voltage = null } = req.body;
    if (!ref) return res.status(400).json({ error: 'ref is required' });

    const token = generateToken();
    const tokenHash = hashToken(token);
    const now = new Date().toISOString();

    const stmt = db.prepare(`INSERT INTO tokens (ref, meterNo, response, signalStrength, token_hash, created_at, hasLight, voltage) VALUES (?,?,?,?,?,?,?,?)`);
    const info = stmt.run(ref, meterNo || null, response, signalStrength, tokenHash, now, hasLight, voltage);

    res.json({ ref, token, tokenHash, id: info.lastInsertRowid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// POST /api/confirm-light
// body: { ref, hasLight }
app.post('/api/confirm-light', (req, res) => {
  try {
    const { ref, hasLight } = req.body;
    if (!ref) return res.status(400).json({ error: 'ref is required' });

    const now = new Date().toISOString();
    const stmt = db.prepare(`INSERT INTO confirmations (ref, hasLight, created_at) VALUES (?,?,?)`);
    const info = stmt.run(ref, hasLight ? 1 : 0, now);

    res.json({ ref, hasLight: !!hasLight, id: info.lastInsertRowid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// GET /api/tokens (debug)
app.get('/api/tokens', (req, res) => {
  try {
    const rows = db.prepare('SELECT id, ref, meterNo, response, signalStrength, token_hash, created_at, hasLight, voltage FROM tokens ORDER BY id DESC LIMIT 200').all();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
