import React from 'react';
import logo from './logo.svg';
import './App.scss';
import MenuBar from './component/menubar/MenuBar';

import { useSelector, useDispatch } from "react-redux";
import State from './global_state/State';
import Dashboard from './component/view/deshboard/Dashboard';
import Threeview from './component/view/threeview/Threevidew';
import HomeView from './component/view/homethreeview/HomeView';


function App() {
  const toggle = useSelector((state: State) => state.toggle);
  
  return (
    <div className="App">
      <MenuBar></MenuBar>
      {toggle ? <Dashboard /> : <HomeView />}
    </div>
  );
}

export default App;
