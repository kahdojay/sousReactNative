import _ from 'lodash'
import assert from 'assert'
import chalk from 'chalk'
import { generateId } from '../utilities/utils'
import WebSocket from 'ws'
import { DDP } from '../resources/apiConfig'
import DDPClient from 'ddp-client'
import Twilio from 'twilio'
// import meteorSettings from '../../../sousMeteor/settings-development.json'
// import meteorSettings from '../../../sousMeteor/settings-staging.json'
import meteorSettings from '../../../sousMeteor/settings-production.json'

const twilioClient = Twilio(meteorSettings.TWILIO.SID, meteorSettings.TWILIO.TOKEN)
const phoneNumber = '5005550006'
const teamCode = meteorSettings.APP.DEMO_TEAMCODE
let connected = false
let isAuthenticated = false
let session = {}
let teams = {}
let orders = {}
let teamId = null

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

describe('Registration', () => {
  it(`should register using a phone number: ${chalk.cyan(phoneNumber)}`, function (done) {
    // check connection
    checkConnection(done);

    // override to wait 15 seconds
    this.timeout(15000)

    ddpClient.removeAllListeners(['message']);
    ddpClient.on('message', (msg) => {
      const log = JSON.parse(msg);
      if (log.hasOwnProperty('fields')){
        // console.log("MAIN DDP WITH FIELDS MSG", log);
        const data = log.fields;
        data.id = log.id;
        switch(log.collection){
          case DDP.SUBSCRIBE_LIST.RESTRICTED.collection:
            if(log.msg === 'added'){
              session = data;
              assert.notDeepStrictEqual(session, {})
            } else if(log.msg === 'changed'){
              if(session.hasOwnProperty('smsSent') === true){
                // console.log(session.smsSent, session)
                if(session.smsSent === true){
                  // console.log(session.smsSID)
                  twilioClient.messages(session.smsSID).get((err, message) => {
                    if(err){
                      assert.fail(err, null, `SMS Error: ${err}`)
                      done();
                    } else {
                      let smsCode = _.trim(message.body)
                      smsCode = smsCode.substr(-4)
                      ddpClient.call('loginWithSMS', [session.id, smsCode]);
                    }
                  })
                } else {
                  assert.fail(data.smsSent, true, 'SMS code was not sent successfully.')
                  done();
                }
              } else if(data.hasOwnProperty('smsVerified') === true){
                if(data.smsVerified === true && data.authToken){
                  isAuthenticated = true;
                }
                assert.equal(isAuthenticated, true, 'SMS code was not verified.');
                done();
              }
            }
            break;
          default:
            break;
        }
      }
    });

    const sessionCb = (err, result) => {
      const newSession = Object.assign({}, {
        phoneNumber: phoneNumber
      }, result)
      // console.log('NEW SESSION PARAMS', newSession);

      ddpClient.subscribe(DDP.SUBSCRIBE_LIST.RESTRICTED.channel, [newSession.userId]);
    }
    ddpClient.call('sendSMSCode', [phoneNumber], sessionCb);
  });
})

describe('Teams', () => {
  it(`should make sure that user belongs to team: ${chalk.cyan(teamCode)}`, function (done) {
    // check connection
    checkConnection(done);
    checkAuthenticated(done);
    this.timeout(10000);

    if(session.userId !== null){
      ddpClient.call('getUsersTeams', [session.userId], (err, results) => {
        let teamCodeFound = false
        results.forEach((team) => {
          team.id = team._id
          teams[team.id] = team
          if(team.hasOwnProperty('teamCode') === true && team.teamCode === teamCode){
            teamCodeFound = true
            teamId = team.id
          }
        })
        if(teamCodeFound === true){
          ddpClient.call('addUserToTeam', [session.userId, teamId], (err, result) => {
            if(result.exists === true){
              assert.equal(result.exists, true)
            } else {
              assert.equal(result.updated, 1)
            }
          })
          ddpClient.call('getUserByPhoneNumber', [phoneNumber], (err, result) => {
            result.user.userId = result.user._id
            delete result.user._id
            session = result.user
            if(session.teamId === teamId){
              assert(session.teamId, teamId)
              done()
            } else {
              ddpClient.call('updateUser', [session.userId, {
                teamId: teamId
              }], (err, result) => {
                result.user.userId = result.user._id
                delete result.user._id
                session = result.user
                assert.equal(session.teamId, teamId)
                done();
              })
            }
          })
        } else {
          ddpClient.call('getTeamByCode', [teamCode], (err, result) => {
            result.id = result._id
            teamId = result.id
            teams[result.id] = result
            ddpClient.call('addUserToTeam', [session.userId, teamId], (err, result) => {
              assert.equal(result.updated, 1)
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

  it(`should set the user's teamId to team: ${chalk.cyan(teamCode)}`, function (done) {
    if(teamId === null){
      assert.fail(teamId, !null)
      done()
    } else {
      // console.log(`${session.teamId} === ${teamId}`)
      if(session.hasOwnProperty('teamId') === true && session.teamId === teamId){
        assert.equal(session.teamId, teamId)
        done()
      } else {
        this.timeout(7000);
        ddpClient.removeAllListeners(['message']);
        ddpClient.on('message', (msg) => {
          const log = JSON.parse(msg);
          if (log.hasOwnProperty('fields')){
            // console.log("MAIN DDP WITH FIELDS MSG", log);
            const data = log.fields;
            data.id = log.id;
            switch(log.collection){
              case DDP.SUBSCRIBE_LIST.RESTRICTED.collection:
                // console.log(log.msg, data, "\n\n\n");
                if(log.msg === 'changed' && data.hasOwnProperty('teamId')){
                  session.teamId = data.teamId
                  assert.equal(session.teamId, data.teamId)
                  done()
                }
              break;
            default:
              break;
            }
          }
        })

        ddpClient.call('updateUser', [session.userId, { teamId: teamId }], (result) => {
          // console.log(result)
        })
      }
    }
  })
})

describe('Ordering', () => {
  it(`should place an order`, function (done) {
    // check connection
    checkConnection(done);
    checkAuthenticated(done);
    this.timeout(30000);

    ddpClient.call('getTeamOrderGuide', [session.teamId], (err, result) => {
      if(teams.hasOwnProperty(session.teamId) === false){
        assert.fail(teams.hasOwnProperty(session.teamId), true)
        done()
      } else {

        // SETUP THE VARIABLES

        orders[session.teamId] = {}
        const firstProduct = result.products[0]
        const purveyorId = firstProduct.purveyors[0]
        const cartItemId = generateId()
        const cartAttributes = {
          purveyorId: purveyorId,
          productId: firstProduct._id,
          quantity: 2,
          note: '',
          _id: cartItemId,
          userId: session.userId,
          teamId: session.teamId,
          status: 'NEW',
          orderId: null,
          createdAt: (new Date()).toISOString(),
          updatedAt: (new Date()).toISOString(),
        }

        // SUBSCRIBE TO THE ORDERS CHANNEL

        ddpClient.removeAllListeners(['message']);
        ddpClient.on('message', (msg) => {
          const log = JSON.parse(msg);
          if (log.hasOwnProperty('fields')){
            // console.log("MAIN DDP WITH FIELDS MSG", log);
            const data = log.fields;
            data.id = log.id;
            switch(log.collection){
              case DDP.SUBSCRIBE_LIST.ORDERS.collection:
                if(log.msg === 'changed'){
                  if(orders[session.teamId].hasOwnProperty(data.id) === true){
                    orders[session.teamId][data.id] = Object.assign({}, orders[session.teamId][data.id], data)
                    checkOrders()
                  }
                } else if(log.msg === 'added') {
                  orders[session.teamId][data.id] = data
                }
              break;
            default:
              break;
            }
          }
        });
        ddpClient.subscribe(DDP.SUBSCRIBE_LIST.ORDERS.channel, [session.userId, [session.teamId]])

        // PLACE THE ORDER

        ddpClient.call('addCartItem', [session.userId, session.teamId, cartAttributes], (err, result) => {
          ddpClient.call('sendCartItems', [session.userId, session.teamId, [purveyorId]])
        });

        function checkOrders(){
          let testComplete = null
          let testPassed = null

          const orderSentList = _.pluck(orders[session.teamId], 'sent');

          if(orderSentList.indexOf(null) === -1){
            testComplete = true
            if(orderSentList.indexOf(false) === -1){
              testPassed = true
            } else {
              testPassed = false
            }
          }

          if(testComplete === true){
            assert.equal(testPassed, true)
            done()
          }
        }
      }
    })
  });
})



describe('Disconnect', () => {
  it(`should disconnect from url: ${chalk.cyan(DDP.ENDPOINT_WS)}`, (done) => {
    // check connection
    checkConnection(done);

    ddpClient.on('socket-close', () => {
      done();
    })
    ddpClient.unsubscribe(DDP.SUBSCRIBE_LIST.RESTRICTED.channel)
    ddpClient.unsubscribe(DDP.SUBSCRIBE_LIST.ORDERS.channel)
    ddpClient.close()
  })
})
