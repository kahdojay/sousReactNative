// Chat
// ====================
//
// NOTE: re: PushNotificationIOS
//         - https://facebook.github.io/react-native/docs/pushnotificationios.html
//   This won't work due to a number of downsides:
//   1. Support only on the iOS device
//   2. Requires iOS device and license
//         "Before you begin, remember that push notifications are
//         not available in the iOS Simulator. You will need an iOS
//         device, as well as an Apple Developer license..."
//           - source: https://parse.com/tutorials/ios-push-notifications
//
//
// TODO: finish the Virtualbox setup for a unified server environment
//
// Question: How to Rails DDP??
// http://stackoverflow.com/questions/23040375/how-to-use-rails-as-ddp-server-with-meteor-js-client
//
// Option 1: RethinkDB
// --------------------
// https://github.com/tinco/celluloid-rethinkdb-chat
//
// Setup RethinkDB (https://www.rethinkdb.com/)
//
//   - benefits: "When your app polls for data, it becomes slow,
//           unscalable, and cumbersome to maintain. RethinkDB is the
//           open-source, scalable database that makes building realtime
//           apps dramatically easier." - source: https://www.rethinkdb.com/
//
//   - downsides: "If you want to pair Heroku with a RethinkDB database
//           hosted by Compose in the meantime, you might be interested
//           in these posts:
//           https://www.compose.io/articles/tunneling-from-heroku-to-compose-rethinkdb/
//           http://blog.fanout.io/2015/05/20/building-a-realtime-api-with-rethinkdb/"
//             - source: https://github.com/rethinkdb/rails-nobrainer-blog/issues/3
//
//
// Option 2: Straight DDP
// ---------------------
// https://github.com/tinco/ruby-ddp-server
//
// Use Postgres for now for the DB
//
