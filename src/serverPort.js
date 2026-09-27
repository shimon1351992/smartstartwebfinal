// Multi-port dynamic scanner for local & cloud server
const CANDIDATE_PORTS = [3002, 3001, 3005, 5005, 5000];
const RENDER_SERVER_URL = 'https://small-robot.onrender.com';

let cachedServerUrl = null;

export async function getActiveServerUrl() {
  // 1. If running on Netlify or external cloud domain, connect directly to Render Backend
  if (typeof window !== 'undefined' && (window.location.hostname.includes('netlify.app') || window.location.hostname.includes('smartstart'))) {
    return RENDER_SERVER_URL;
  }

  // 2. Check cached URL
  if (cachedServerUrl) {
    try {
      const check = await fetch(`${cachedServerUrl}/api/ping`, { method: 'GET', mode: 'cors', signal: AbortSignal.timeout(800) });
      if (check.ok) return cachedServerUrl;
    } catch (e) {
      cachedServerUrl = null;
    }
  }

  // 3. Try Local PC Server across candidate hosts & ports
  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const hosts = Array.from(new Set([currentHost, 'localhost', '127.0.0.1'])).filter(Boolean);

  for (const host of hosts) {
    for (const port of CANDIDATE_PORTS) {
      try {
        const url = `http://${host}:${port}`;
        const res = await fetch(`${url}/api/ping`, { 
          method: 'GET', 
          mode: 'cors', 
          signal: AbortSignal.timeout(800) 
        });
        if (res.ok) {
          cachedServerUrl = url;
          return cachedServerUrl;
        }
      } catch (e) {}
    }
  }

  // 4. If running locally in browser (localhost/127.0.0.1), stay on local server
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    return 'http://localhost:3002';
  }

  // 5. Fallback to Render Cloud Server for cloud deployments
  return RENDER_SERVER_URL;
}
