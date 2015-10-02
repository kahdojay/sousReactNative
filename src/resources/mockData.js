var MockData = {
  stations: {},
  tasks: {}
}

function addTasks(stationId){
  MockData.tasks[stationId] = {
    id: stationId + '',
    stationId: stationId + '',
    description: 'task_' + stationId,
    completed: false
  }
  MockData.stations[stationId].taskList.push(stationId)
}

for (var i = 0; i < 5; i++) {
  MockData.stations[i] = {
    id: i + '',
    name: 'station_' + i,
    taskList: []
  }
  addTasks(i);
};

module.exports = MockData
