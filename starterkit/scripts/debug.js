import {internalIpV4} from 'internal-ip';

import {getLocalIPs} from '../vite/utils.js';

async function go() {
  const allLocalIps = await getLocalIPs({debug: true});
  const localIps = await getLocalIPs();
  console.log('Alle IPs:');
  console.log(allLocalIps);
  console.log('Externe IPs:');
  console.log(localIps);

  const internalIp = await internalIpV4();
  console.log('internal-ip');
  console.log(internalIp);
}

go();
