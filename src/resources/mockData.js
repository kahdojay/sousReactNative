var MockData = {
  stations: {},
  tasks: {}
}

function addTasks(stationId){
  MockData.tasks[stationId] = {
    id: stationId,
    stationId: stationId,
    description: 'task_' + stationId,
    completed: false
  }
  MockData.stations[stationId].taskList.push(stationId)
}

for (var i = 0; i < 5; i++) {
  var id = i + '';
  MockData.stations[id] = {
    id: id,
    name: 'station_' + i,
    taskList: []
  }
  addTasks(id);
};

module.exports = MockData
