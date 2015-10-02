// import React from 'react-native';
//
// let {
//   View,
//   Text,
//   TextInput,
//   PropTypes,
//   TouchableHighlight,
//   StyleSheet,
// } = React;
//
// export default class AddTask extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       text: ''
//     }
//   }
//   render() {
//     return (
//       <View
//         style={styles.container}>
//         <TextInput
//           style={styles.input}
//           value={this.state.text}
//           onChangeText={(text) => {this.setState({text})}}
//           />
//         <TouchableHighlight onPress={() => this.handleClick()}>
//           <Text>Add</Text>
//         </TouchableHighlight>
//       </View>
//     );
//   }
//
//   handleClick() {
//     if (this.state.text !== '') {
//       this.props.onAddClick(this.state.text);
//       this.setState({text: ''})
//     }
//   }
// }
//
// let styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'blue'
//   },
//   input: {
//     flex: 1
//   }
// })
//
// AddTask.propTypes = {
//   onAddClick: PropTypes.func.isRequired
// };
