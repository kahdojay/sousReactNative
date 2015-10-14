// see: https://github.com/adamjmcgrath/react-native-simple-auth/blob/master/test/simpleauthclient.test.js
// let expect = require('chai').expect;
import { DDP } from '../src/resources/apiConfig'
import DDPClient from 'ddp-client'

// console.log(WebSocket)

// describe('Signup', () => {

  let ddpClient = new DDPClient({
    // host : "localhost",
    // port : 3000,
    // ssl  : false,
    // autoReconnect : true,
    // autoReconnectTimer : 500,
    // maintainCollections : true,
    // ddpVersion : '1',  // ['1', 'pre2', 'pre1'] available
    // Use a full url instead of a set of `host`, `port` and `ssl`
    url: DDP.ENDPOINT_WS,
    // socketConstructor: WebSocket // Another constructor to create new WebSockets
  });

  // before(() => {
    //--------------------------------------
    // Bind DDP client events
    //--------------------------------------

    ddpClient.on('connected', () => {
      Object.keys(DDP.SUBSCRIBE_LIST).forEach((resourceKey) => {
        let resource = DDP.SUBSCRIBE_LIST[resourceKey];
        ddpClient.subscribe(resource.channel, [teamKey]);
      })
    })

    //--------------------------------------
    // Connect the DDP client
    //--------------------------------------

    ddpClient.connect((error, wasReconnected) => {
      if (error) {
        // return dispatch(errorStations([{
        //   id: 'error_feed_connection',
        //   message: 'Feed connection error!'
        // }]));
        // console.log('ERROR: ', error);
        // TODO: create a generic error action and reducer
      }
      if (wasReconnected) {
        // console.log('RECONNECT: Reestablishment of a connection.');
      }

    });

  // });


  // it('should signup correctly', () => {
    ddpClient.on('message', (msg) => {
      var log = JSON.parse(msg);
      console.log("MAIN DDP MSG", log);
      // var stationIds = getState().stations.data.map(function(station) {
      //   return station.id;
      // })
      if (log.fields){
        var data = log.fields;
        data.id = log.id;
        expect(data).to.be.a('object');
      }
    });

  // });
// });
