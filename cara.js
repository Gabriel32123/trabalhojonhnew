const express = require('express');
const app = express();
const port = 3000;
const instanceId = process.env.INSTANCE_ID || 'app-local';


let failMode = false; 
let activeConnections = 0;


app.use((req, res, next) => {

activeConnections++;
res.on('finish', () => { activeConnections--; });
next();
});


app.get('/', (req, res) => {
if (failMode) return res.status(500).send(`${instanceId} - ERROR (simulated)`);

res.send(`${instanceId} - OK - ${new Date().toISOString()}`);
});


app.get('/health', (req, res) => {
// 
if (failMode) return res.status(500).json({ok:false});
res.json({ok:true, instance: instanceId});
});


app.get('/togglefail', (req, res) => {
failMode = !failMode;
res.send(`${instanceId} failMode=${failMode}`);
});


app.get('/metrics', (req, res) => {
res.json({instance: instanceId, activeConnections});
});


app.listen(port, () => console.log(`${instanceId} running on ${port}`));