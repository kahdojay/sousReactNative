// import {
//   ADD_PRODUCT,
//   UPDATE_PRODUCT,
//   TOGGLE_PRODUCT,
// } from '../actions';
//
// const initialState = {
//   stations: {},
//   products: {}
// };
//
// function products(state = initialState.products, action) {
//   switch (action.type) {
//   case ADD_PRODUCT:
//     let newState = Object.assign({}, state)
//     let newProductId = Object.keys(newState).length;
//     newState[newProductId] = {
//       id: newProductId + '',
//       purveyorKey: action.purveyorKey,
//       name: action.name,
//       description: '',
//       completed: false,
//       deleted: false,
//       quantity: 1
//     }
//     return newState
//   case TOGGLE_PRODUCT:
//     let newStateToggle = Object.assign({}, state)
//     newStateToggle[action.index].completed = !newStateToggle[action.index].completed
//     return newStateToggle;
//   case UPDATE_PRODUCT:
//     let newProductsState = Object.assign({}, state)
//     newProductsState[action.product.id] = action.product
//     return newProductsState
//   default:
//     return state;
//   }
// }
//
// const product = {
//   'products': products,
// }
//
// export default product
