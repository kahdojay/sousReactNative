const React = require('react-native');
import { connect } from 'react-redux/native';
import { addTodo, toggleTodo, setVisibilityFilter, VisibilityFilters } from '../actions';
import AddTodo from '../components/addTodo';
import TodoList from '../components/todoList';
import Footer from '../components/footer';
import { BackBtn } from '../utilities/navigation';

const {
  StyleSheet,
  View,
  PropTypes,
  TouchableHighlight,
  Text,
} = React;

class StationView extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    // Injected by connect() call:
    const { stationId, dispatch, visibleTodos, visibilityFilter } = this.props;
    let todos = visibleTodos(stationId);
    return (
      <View style={styles.container}>
        <BackBtn
          navigator={this.props.navigator}
        />
        <AddTodo
          onAddClick={text =>
            dispatch(addTodo(text))
          } />
          <TodoList
            todos={todos}
            navigator={this.props.navigator}
            onTodoClick={index =>
              dispatch(toggleTodo(index))
          } />
          <Footer
            filter={visibilityFilter}
            onFilterChange={nextFilter =>
              dispatch(setVisibilityFilter(nextFilter))
          } />
      </View>
    );
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 80
  }
});

function selectTodos(stations, todos, filter) {
  return function(stationId){
    let taskList = stations[stationId].taskList;
    let stationTodos = taskList.map((todoKey) => todos[todoKey])
    switch (filter) {
    case VisibilityFilters.SHOW_ALL:
      return stationTodos;
    case VisibilityFilters.SHOW_COMPLETED:
      return stationTodos.filter(todo => todo.completed);
    case VisibilityFilters.SHOW_ACTIVE:
      return stationTodos.filter(todo => !todo.completed);
    }
  }
}

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function select(state) {
  return {
    visibleTodos: selectTodos(state.stations, state.todos, state.visibilityFilter),
    visibilityFilter: state.visibilityFilter
  };
}

StationView.propTypes = {
  stationId: PropTypes.string.isRequired,
  visibleTodos: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  })),
  visibilityFilter: PropTypes.oneOf([
    'SHOW_ALL',
    'SHOW_COMPLETED',
    'SHOW_ACTIVE'
  ]).isRequired
};

// Wrap the component to inject dispatch and state into it
export default connect(select)(StationView);
