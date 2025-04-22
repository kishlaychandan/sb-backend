// gateway-server.js
import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';

const app = express();
app.use(cors());

app.get('/',(req,res)=>{
    console.log("healthcheck");
    res.json("healthcheck")
})
// GET /gateway → returns your hotspot’s gateway IP
app.get('/gateway', (req, res) => {
  // 'ip route' outputs something like:
  //   default via 192.168.43.1 dev wlan0 proto dhcp metric 600 
  exec('ip route', (err, stdout) => {
    if (err) {
      console.error('ip route error:', err);
      return res.status(500).json({ error: 'Failed to run `ip route`' });
    }
    const match = stdout.match(/default via ([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/);
    if (!match) {
      console.error('no default route in:', stdout);
      return res.status(500).json({ error: 'No default gateway found' });
    }
    console.log("match",match)
    res.json({ gateway: match[1] });
  });
});

// app.post('/http://192.168.65.105:3000/ot',(req,res)=>{
//     console.log("receiveMessageOnPort..")
// })

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🔌 Gateway server listening on http://localhost:${PORT}`);
});
