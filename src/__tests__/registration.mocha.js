import assert from 'assert'
// import events from 'events'
// import sinon from 'sinon'
import WebSocket from 'ws'
import chalk from 'chalk'
import { DDP } from '../resources/apiConfig'
import DDPClient from 'ddp-client'
import Twilio from 'twilio'
import meteorSettings from '../../../sousMeteor/settings-development.json';

const twilioClient = Twilio(meteorSettings.TWILIO.SID, meteorSettings.TWILIO.TOKEN)
const phoneNumber = '5005550006'

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

describe('Registration', () => {
  afterEach(() => {
    ddpClient.close();
  })

  it(`should connect to the correct url: ${chalk.cyan(DDP.ENDPOINT_WS)}`, (done) => {
    ddpClient.on('connected', () => {
      done()
    });
    ddpClient.connect((error, reconnectAttempt) => {
      if (!error) {
        // assert.deepEqual(wsConstructor.args, [[DDP.ENDPOINT_WS, null, {}]]);
        assert.ok(true);
      } else {
        assert.fail(error, undefined, `Error connecting to: ${DDP.ENDPOINT_WS}`);
      }
    });
  });

  it(`should register using a phone number: ${chalk.cyan(phoneNumber)}`, function (done) {
    this.timeout(15000)

    ddpClient.on('message', (msg) => {
      const log = JSON.parse(msg);
      if (log.hasOwnProperty('fields')){
        // console.log("MAIN DDP WITH FIELDS MSG", log);
        const data = log.fields;
        data.id = log.id;
        switch(log.collection){
          case DDP.SUBSCRIBE_LIST.RESTRICTED.collection:
            if(data.hasOwnProperty('smsSent') === true){
              setTimeout(() => {
                twilioClient.messages.list({
                  to: phoneNumber
                },(err, data) => {
                  const smsCode = data.messages[0].body.substring(0, 4)
                  ddpClient.call('loginWithSMS', [phoneNumber, smsCode]);
                })
              }, 2500)
            } else if(data.hasOwnProperty('smsVerified') === true){
              assert.equal(data.smsVerified, true, 'SMS code was not verified.');
              done();
            }
            break;
          default:
            break;
        }
      }
    });
    ddpClient.on('connected', () => {
      ddpClient.unsubscribe(DDP.SUBSCRIBE_LIST.RESTRICTED.channel)
      ddpClient.subscribe(DDP.SUBSCRIBE_LIST.RESTRICTED.channel, [phoneNumber]);
      ddpClient.call('sendSMSCode', [phoneNumber]);
    });
    ddpClient.connect((error, reconnectAttempt) => {
      if (!error) {
        // assert.deepEqual(wsConstructor.args, [[DDP.ENDPOINT_WS, null, {}]]);
        assert.ok(true);
      } else {
        assert.fail(error, undefined, `Error connecting to: ${DDP.ENDPOINT_WS}`);
      }
    });
  });
})
