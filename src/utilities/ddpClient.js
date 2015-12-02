import { DDP } from '../resources/apiConfig'
import DDPClient from 'ddp-client'

export default new DDPClient({
  // host : "localhost",
  // port : 3000,
  // ssl  : false,
  autoReconnect : false, // default: true,
  // autoReconnectTimer : 500,
  maintainCollections : false, // default: true,
  // ddpVersion : '1',  // ['1', 'pre2', 'pre1'] available
  // Use a full url instead of a set of `host`, `port` and `ssl`
  url: DDP.ENDPOINT_WS,
  // socketConstructor: WebSocket // Another constructor to create new WebSockets
});
