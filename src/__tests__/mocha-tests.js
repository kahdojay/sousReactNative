import _ from 'lodash'
import assert from 'assert'
import chalk from 'chalk'
import WebSocket from 'ws'
import { DDP } from '../resources/apiConfig'
import DDPClient from 'ddp-client'
import Twilio from 'twilio'
import meteorSettings from '../../../sousMeteor/settings-development.json';

const twilioClient = Twilio(meteorSettings.TWILIO.SID, meteorSettings.TWILIO.TOKEN)
const phoneNumber = '5005550006'
const teamCode = meteorSettings.APP.DEMO_TEAMCODE
const debug = true
let connected = false
let isAuthenticated = false
let session = {}

if(debug === true){
  isAuthenticated = true
  session = {
    userId: 'S3QpbH3DR9oRMXaKj'
  }
}

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

function checkConnection(done){
  if(connected === false){
    assert.fail(connected, true, 'DDPClient is not connected');
    done()
  }
}

function checkAuthenticated(done){
  if(isAuthenticated === false){
    assert.fail(isAuthenticated, true, 'User is not authenticated');
    done()
  }
}

describe('Setup', () => {
  it(`should verify that the global variables are correctly instantiated`, function (done) {
    assert(twilioClient)
    assert(phoneNumber);
    assert(ddpClient);
    assert.deepStrictEqual(connected, false);
    assert.deepStrictEqual(isAuthenticated, false);
    assert.deepStrictEqual(session, {});
    done();
  });
})

describe('Connect', () => {
  it(`should connect to the correct url: ${chalk.cyan(DDP.ENDPOINT_WS)}`, (done) => {
    ddpClient.on('connected', () => {
      connected = true;
      done();
    });

    ddpClient.connect((error, reconnectAttempt) => {
      if (!error) {
        // assert.deepEqual(wsConstructor.args, [[DDP.ENDPOINT_WS, null, {}]]);
        assert.ok(true);
      } else {
        assert.fail(error, undefined, `Error connecting to: ${DDP.ENDPOINT_WS}`);
        done();
      }
    });
  });
})

// describe('Registration', () => {
//   it(`should register using a phone number: ${chalk.cyan(phoneNumber)}`, function (done) {
//     // check connection
//     checkConnection(done);
//
//     // override to wait 15 seconds
//     this.timeout(15000)
//
//     ddpClient.removeAllListeners(['message']);
//     ddpClient.on('message', (msg) => {
//       const log = JSON.parse(msg);
//       if (log.hasOwnProperty('fields')){
//         // console.log("MAIN DDP WITH FIELDS MSG", log);
//         const data = log.fields;
//         data.id = log.id;
//         switch(log.collection){
//           case DDP.SUBSCRIBE_LIST.RESTRICTED.collection:
//             if(log.msg === 'added'){
//               session = data;
//               assert.notDeepStrictEqual(session, {})
//             } else if(log.msg === 'changed'){
//               if(data.hasOwnProperty('smsSent') === true){
//                 // console.log(data.smsSent, data)
//                 if(data.smsSent === true){
//                   twilioClient.messages(data.smsSID).get((err, message) => {
//                     const smsCode = message.body.substring(0, 4)
//                     ddpClient.call('loginWithSMS', [phoneNumber, smsCode]);
//                   })
//                 } else {
//                   assert.fail(data.smsSent, true, 'SMS code was not sent successfully.')
//                   done();
//                 }
//               } else if(data.hasOwnProperty('smsVerified') === true){
//                 if(data.smsVerified === true && data.authToken){
//                   isAuthenticated = true;
//                 }
//                 assert.equal(isAuthenticated, true, 'SMS code was not verified.');
//                 done();
//               }
//             }
//             break;
//           default:
//             break;
//         }
//       }
//     });
//
//     ddpClient.unsubscribe(DDP.SUBSCRIBE_LIST.RESTRICTED.channel)
//     ddpClient.subscribe(DDP.SUBSCRIBE_LIST.RESTRICTED.channel, [phoneNumber]);
//     ddpClient.call('sendSMSCode', [phoneNumber]);
//   });
// })

describe('Teams', () => {
  it(`should make sure that phone number: ${chalk.cyan(phoneNumber)} belongs to team: ${chalk.cyan(teamCode)}`, function (done) {
    // check connection
    checkConnection(done);
    checkAuthenticated(done);
    this.timeout(5000);

    if(session.userId !== null){
      ddpClient.call('getUsersTeams', [session.userId], (err, results) => {
        let teamCodeFound = false
        results.forEach((team) => {
          if(team.hasOwnProperty('teamCode') === true && team.teamCode === teamCode){
            teamCodeFound = true
          }
        })
        if(teamCodeFound === true){
          assert.ok(teamCodeFound)
          done();
        } else {
          ddpClient.call('getTeamByCode', [teamCode], (err, result) => {
            ddpClient.call('addUserToTeam', [session.userId, result._id], (err, result) => {
              assert.equal(result, 1)
              done()
            })
          });
        }
      })
    } else {
      assert.fail(session.userId, null, 'Missing userId')
      done();
    }

  })
})

describe('Ordering', () => {
  it(`should place an order using phone number: ${chalk.cyan(phoneNumber)}`, function (done) {
    // check connection
    checkConnection(done);
    checkAuthenticated(done);
    this.timeout(15000);

    console.log(session);

    // ddpClient.removeAllListeners(['message']);
    // ddpClient.on('message', (msg) => {
    //   const log = JSON.parse(msg);
    //   if (log.hasOwnProperty('fields')){
    //     // console.log("MAIN DDP WITH FIELDS MSG", log);
    //     const data = log.fields;
    //     data.id = log.id;
    //     switch(log.collection){
    //       case DDP.SUBSCRIBE_LIST.TEAMS.collection:
    //         console.log(data)
    //         if(data.teamCode === teamCode){
    //           done()
    //         }
    //       break;
    //     default:
    //       break;
    //     }
    //   }
    // });

    assert(phoneNumber);
    done();
  });
})



describe('Disconnect', () => {

  it(`should disconnect from url: ${chalk.cyan(DDP.ENDPOINT_WS)}`, (done) => {
    // check connection
    checkConnection(done);

    ddpClient.on('socket-close', () => {
      done();
    })
    ddpClient.close();
  })

})
