import React from 'react-native';
import Todo from './todo';

let {
  View,
  PropTypes,
} = React;

export default class TodoList extends React.Component {
  render() {
    let todoKeys = Object.keys(this.props.todos);
    return (
      <View>
        {todoKeys.map((todoKey, index) => {
          let todo = this.props.todos[todoKey]
          return <Todo {...todo}
            navigator={this.props.navigator}
            key={index}
            onPress={() => this.props.onTodoClick(index)} />
        })}
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
