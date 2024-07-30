import {useReducer} from 'react';

export function toggleReducer(state, nextState) {
  if (nextState === undefined || typeof nextState !== 'boolean') {
    return !state; // toggle if nothing passed to dispatch
  } else {
    return nextState;
  }
}

/**
 * Toggle between true and false
 * @param {boolean} [initialState=true]
 * @returns {[boolean, function]}
 *
 * const [isOn, toggleOn] = useToggle(initialState);
 *
 *  toggleOn(); // flip state
 *  toggleOn(false); // explicitly set state to false
 *  toggleOn(true); // explicitly set state to true
 */
function useToggle(on = false) {
  return useReducer(toggleReducer, on);
}
export default useToggle;
