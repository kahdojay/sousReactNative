import { DDP } from '../resources/apiConfig'

export default function ConnectActions(ddpClient) {

  var connectedChannels = {}

  function connectSingleChannel(resource, resourceParam){
    if(connectedChannels.hasOwnProperty(resource.channel) === false){
      if(resourceParam){
        // console.log('SUBSCRIBING TO CHANNEL: ', resource.channel, ' using param: ', resourceParam)
        ddpClient.subscribe(resource.channel, [resourceParam]);
        connectedChannels[resource.channel] = true;
        //TODO: disconnect from the channels that require teamId and then
        //reconnect with a new key
      }
    }
  }

  function connectChannels(session, teamIds){
    Object.keys(DDP.SUBSCRIBE_LIST).forEach((resourceKey) => {
      var resource = DDP.SUBSCRIBE_LIST[resourceKey];
      // console.log('Connecting: ', resource.channel, ' with session: ', session);
      var resourceParam = null
      if(resource.channel === 'restricted'){
        resourceParam = session.phoneNumber
      } else if(resource.channel === 'errors' || resource.channel === 'teams'){
        resourceParam = session.userId;
      } else if (resource.channel === 'messages') {
        resourceParam = teamIds;
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
      teamActions,
      messageActions,
      purveyorActions
    } = allActions
    return (dispatch, getState) => {
      const {session, teams} = getState();

      console.log('TEAMS', teams);
      let teamIds = teams.data.map((team) => {return team.id});
      ddpClient.on('connected', () => {
        // console.log('CONNECTED: TODO');
        if (session.isAuthenticated)
          connectChannels(session, teamIds)
      });
      //--------------------------------------
      // Bind DDP client events
      //--------------------------------------


      ddpClient.on('message', (msg) => {
        var log = JSON.parse(msg);
        // console.log("MAIN DDP MSG", log);
        // var teamIds = getState().teams.data.map(function(team) {
        //   return team.id;
        // })
        if (log.hasOwnProperty('fields')){
          // console.log("MAIN DDP WITH FIELDS MSG", log);
          var data = log.fields;
          data.id = log.id;
          switch(log.collection){
            case 'messages':
              dispatch(messageActions.receiveMessages(data))
              break;
            case 'teams':
              dispatch(teamActions.receiveTeams(data))
              break;
            case 'purveyors':
              dispatch(purveyorActions.receivePurveyors(data))
              break;
            case 'categories':
              dispatch(teamActions.receiveCategories(data))
              break;
            case 'products':
              dispatch(teamActions.receiveProducts(data))
              break;
            case 'users':
              dispatch(sessionActions.receiveSession(data))
              break;
            default:
              console.log("TODO: wire up collection: ", log.collection);
              break;
          }
          // TODO: do we need this?
          // if(Object.keys(connectedChannels).length < Object.keys(DDP.SUBSCRIBE_LIST).length){
          //   connectChannels(session);
          // }
        } else if(log){
          // console.log("MAIN DDP MSG", log);
        }
      });

      //--------------------------------------
      // Connect the DDP client
      //--------------------------------------

      ddpClient.connect((error, wasReconnected) => {
        if (error) {
          // return dispatch(errorTeams([{
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
