// import murmurhash from 'murmurhash'

// var MockData = {
//   stations: {},
//   tasks: {}
// }

// function addTasks(stationId){
//   let newKey = murmurhash.v3(''+stationId).toString(16);

//   MockData.tasks[stationId] = {
//     id: stationId,
//     stationId: stationId,
//     name: 'task_' + stationId,
//     description: 'task_' + stationId + ' description',
//     completed: false,
//     quantity: 1
//   }
//   MockData.stations[stationId].taskList.push(stationId)
// }

// for (var i = 0; i < 5; i++) {
//   var id = i + '';
//   MockData.stations[id] = {
//     id: id,
//     name: 'station_' + i,
//     taskList: []
//   }
//   addTasks(id);
// };

// module.exports = MockData
