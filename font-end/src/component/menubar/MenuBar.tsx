import React, { useState } from "react";
import "./MenuBar.scss";
import { useSelector, useDispatch } from "react-redux";
import State from "../../global_state/State";
import stateType from "../../global_state/stateTypes";

const MenuBar: React.FC = () => {
  const toggle = useSelector((state: State) => state.toggle);
  const dispatch = useDispatch();

  return (
    <div className="app">
      <div className="switch-background">
        <div className="toggle">
          <div className={toggle ? "slide-false" : "slide-true"}></div>
        </div>
        <div className="toggle-title">
          <p
             onClick={() => dispatch({type:stateType.TOGGLE_ON})}
            style={toggle ? { color: "#2a3d89" } : {}}
          >
            Dashboard
          </p>
          <p
            onClick={() => dispatch({type:stateType.TOGGLE_OF})}
            style={toggle ? {} : { color: "#2a3d89" }}
          >
            3D-Preview
          </p>
        </div>
      </div>
    </div>
  );
};
export default MenuBar;
