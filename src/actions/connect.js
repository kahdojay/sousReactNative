import { DDP } from '../resources/apiConfig'

export default function ConnectActions(ddpClient) {

  var connectedChannels = {}

  function connectSingleChannel(resource, resourceParam){
    if(connectedChannels.hasOwnProperty(resource.channel) === false){
      if(resourceParam){
        console.log('SUBSCRIBING TO CHANNEL: ', resource.channel)
        ddpClient.subscribe(resource.channel, [resourceParam]);
        connectedChannels[resource.channel] = true;
        //TODO: disconnect from the channels that require teamId and then
        //reconnect with a new key
      }
    }
  }

  function connectChannels(session){
    Object.keys(DDP.SUBSCRIBE_LIST).forEach((resourceKey) => {
      var resource = DDP.SUBSCRIBE_LIST[resourceKey];
      var resourceParam = null
      if(resource.channel === 'restricted'){
        resourceParam = session.phoneNumber
      } else if(resource.channel === 'errors'){
        resourceParam = session.userId;
      } else {
        resourceParam = session.teamId
      }
      connectSingleChannel(resource, resourceParam);
    })
  }

  function connectDDP(allActions){
    const {
      uiActions,
      sessionActions,
      stationActions,
      teamActions,
      messageActions,
      purveyorActions
    } = allActions
    return (dispatch, getState) => {
      const {session} = getState()

      //--------------------------------------
      // Bind DDP client events
      //--------------------------------------

      ddpClient.on('connected', () => {
        connectChannels(session)
      })
      ddpClient.on('message', (msg) => {
        var log = JSON.parse(msg);
        // console.log("MAIN DDP MSG", log);
        // var stationIds = getState().stations.data.map(function(station) {
        //   return station.id;
        // })
        if (log.hasOwnProperty('fields')){
          console.log("MAIN DDP WITH FIELDS MSG", log);
          var data = log.fields;
          data.id = log.id;
          switch(log.collection){
            case 'messages':
              dispatch(messageActions.receiveMessages(data))
              break;
            case 'stations':
              dispatch(stationActions.receiveStations(data))
              break;
            case 'purveyors':
              dispatch(purveyorActions.receivePurveyors(data))
              break;
            case 'users':
              dispatch(sessionActions.receiveSession(data))
              break;
            default:
              console.log("TODO: wire up collection: ", log.collection);
              break;
          }
          if(Object.keys(connectedChannels).length < Object.keys(DDP.SUBSCRIBE_LIST).length){
            connectChannels(session);
          }
        } else if(log){
          // console.log("MAIN DDP MSG", log);
        }
      });

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
    }
  }

  // TODO: how to handle disconnect?

  return {
    'connectSingleChannel': connectSingleChannel,
    'connectChannels': connectChannels,
    'connectDDP': connectDDP,
  }
}
