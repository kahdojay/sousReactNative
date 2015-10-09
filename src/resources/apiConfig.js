
export const API_ENDPOINT = 'http://localhost:3001/api/1';

export const endpoints = {
  ENDPOINT_SESSION: '/sessions',
  ENDPOINT_STATION: '/stations',
  ENDPOINT_TEAM: '/teams',
  ENDPOINT_USER: '/users',
};

export const DDP = {
  // ENDPOINT_WS: 'ws://sous-chat.meteor.com/websocket',
  ENDPOINT_WS: 'ws://localhost:3000/websocket',
  SUBSCRIBE_MESSAGES: 'messages',
  SUBSCRIBE_STATIONS: 'stations',
}
