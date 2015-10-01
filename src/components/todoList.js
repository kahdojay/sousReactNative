import React from 'react-native';
import Todo from './todo';

let {
  View,
  PropTypes, 
} = React;

export default class TodoList extends React.Component {
  render() {
    return (
      <View>
        {this.props.todos.map((todo, index) =>
          <Todo {...todo}
            key={index}
            onPress={() => this.props.onTodoClick(index)} />
        )}
      </View>
    );
  }
}

TodoList.propTypes = {
  onTodoClick: PropTypes.func.isRequired,
  todos: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  }).isRequired).isRequired
};