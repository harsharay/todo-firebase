import React from 'react';
import TodoList from "./Components/TodoList/TodoList"

import './App.css';

function App() {
  return (
    <div className="App">
      <h1 className="banner">Personalem List</h1>
      <TodoList />
    </div>
  );
}

export default App;
