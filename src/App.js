import React from 'react'
import Signup from './Signup'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UsersList from './UsersList';


const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route exact path="/" Component={Signup}></Route>
        <Route exact path="/users" Component={UsersList}></Route>
        </Routes></BrowserRouter>
    </div>
  )
}

export default App
