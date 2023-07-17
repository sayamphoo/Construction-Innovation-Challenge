
import State from "./State";
import stateType from "./stateTypes";

  const initialState: State = {
    toggle: true,
  };

const rootReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case stateType.TOGGLE_OF:
      return {
        ...state,
        toggle:false
      };
      case stateType.TOGGLE_ON:
      return {
        ...state,
        toggle:true
      };
    default:
      return state;
  }
};

export default rootReducer;
