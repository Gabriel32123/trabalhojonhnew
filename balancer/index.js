const express = require('express');


if (algorithm === 'round-robin') {
const b = pool[rrIndex % pool.length];
rrIndex = (rrIndex + 1) % pool.length;
return b;
}


if (algorithm === 'least-connections') {

let chosen = pool[0];
for (const b of pool) {
if (b.activeConns < chosen.activeConns) chosen = b;
}
return chosen;
}


return pool[0];


app.use((req, res) => {

const q = url.parse(req.url, true).query;
if (q && q.alg) {
if (q.alg === 'rr' || q.alg === 'round-robin') algorithm = 'round-robin';
if (q.alg === 'lc' || q.alg === 'least' || q.alg === 'least-connections') algorithm = 'least-connections';
}


const target = chooseBackend();
if (!target) return res.status(503).send('No backend available');


const options = {
hostname: target.host,
port: target.port,
path: req.originalUrl,
method: req.method,
headers: req.headers
};



target.activeConns++;


const proxyReq = http.request(options, proxyRes => {
res.writeHead(proxyRes.statusCode, proxyRes.headers);
proxyRes.pipe(res);
proxyRes.on('end', () => { target.activeConns--; });
});


proxyReq.on('error', (err) => {
target.activeConns--; 
res.status(502).send('Bad gateway to backend ' + target.name);
});


req.pipe(proxyReq);
});



app.get('/_lb/status', (req, res) => {
res.json({ algorithm, backends });
});


app.listen(port, () => console.log(`Balancer running on ${port} (alg=${algorithm})`));