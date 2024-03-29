
export const DDP = {
  // ENDPOINT_WS: 'ws://localhost:3000/websocket',
  // ENDPOINT_WS: 'ws://sousdev-56151.onmodulus.net/websocket',
  ENDPOINT_WS: 'ws://staging.sousapp.com/websocket',
  // ENDPOINT_WS: 'ws://prod.sousapp.com/websocket',
  SUBSCRIBE_LIST: {
    RESTRICTED: {channel: 'restricted', collection: 'users'},
    SETTINGS: {channel: 'settings', collection: 'settings'},
    MESSAGES: {channel: 'messages', collection: 'messages'},
    TEAMS: {channel: 'teams', collection: 'teams'},
    PURVEYORS: {channel: 'purveyors', collection: 'purveyors'},
    CATEGORIES: {channel: 'categories', collection: 'categories'},
    TEAMS_USERS: {channel: 'teams-users', collection: 'users'},
    PRODUCTS: {channel: 'products', collection: 'products'},
    ORDERS: {channel: 'orders', collection: 'orders'},
    CART_ITEMS: {channel: 'cart-items', collection: 'cart_items'},
    ERRORS: {channel: 'errors', collection: 'errors'},
  },
}
// TODO: change the actions/connect.js to use DDP.SUBSCRIBE_LIST.<CHANNEL>.collection instead of hardcoding the collection

export const SESSION_VERSION = 1452979120000
