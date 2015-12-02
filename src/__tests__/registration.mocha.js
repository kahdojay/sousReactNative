import assert from 'assert'
import WebSocket from 'ws'
import { DDP } from '../resources/apiConfig'
import DDPClient from 'ddp-client'

let ddpClient;

describe('Registration', () => {
  // beforeEach(() => {
  //
  // });

  it('should connect to the correct url', (done) => {
    const ddpClient = new DDPClient({
        // host : "localhost",
        // port : 3000,
        // ssl  : false,
        autoReconnect : false, // default: true,
        // autoReconnectTimer : 500,
        maintainCollections : false, // default: true,
        // ddpVersion : '1',  // ['1', 'pre2', 'pre1'] available
        // Use a full url instead of a set of `host`, `port` and `ssl`
        url: DDP.ENDPOINT_WS,
        socketConstructor: WebSocket // Another constructor to create new WebSockets
      });
    ddpClient.connect((error, reconnectAttempt) => {
      if (!error) {
        // assert.deepEqual(wsConstructor.args, [[DDP.ENDPOINT_WS, null, {}]]);
        assert.ok(true);
      } else {
        assert.fail(error, undefined, `Error connecting to: ${DDP.ENDPOINT_WS}`);
      }
      done();
    });
  })
})
