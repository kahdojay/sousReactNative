var MockData = {
  stations: {},
  tasks: {}
}

for (var i = 0; i < 5; i++) {
  MockData.stations[i] = {
    id: i,
    name: 'station_' + i
  }
  MockData.tasks[i] = {
    id: i,
    stationId: i,
    description: 'task_' + i,
    completed: false
  }
};

module.exports = MockData
