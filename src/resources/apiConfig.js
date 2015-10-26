
export const DDP = {
  ENDPOINT_WS: 'ws://localhost:3000/websocket',
  // ENDPOINT_WS: 'sousstaging-53818.onmodulus.net',
  // ENDPOINT_WS: 'sousproduction-53819.onmodulus.net',
  SUBSCRIBE_LIST: {
    RESTRICTED: {channel: 'restricted'},
    MESSAGES: {channel: 'messages'},
    TEAMS: {channel: 'teams'},
    PURVEYORS: {channel: 'purveyors'},
    CATEGORIES: {channel: 'categories'},
    PRODUCTS: {channel: 'products'},
    ERRORS: {channel: 'errors'}
  },
}

export const SESSION_VERSION = 1444868918576
