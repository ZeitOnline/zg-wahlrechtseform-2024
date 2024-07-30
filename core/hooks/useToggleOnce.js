import {useReducer} from 'react';

/**
 * Toggle from false to true once
 * for example to remember if something has been clicked
 * @returns {[boolean, function]}
 *
 * const [isOn, toggleOn] = useToggleOnce();
 *
 *  toggleOn(); // toggle to true
 */
function useToggleOnce() {
  return useReducer(() => true, false);
}
export default useToggleOnce;
