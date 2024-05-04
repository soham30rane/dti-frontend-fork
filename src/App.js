import {React,Component} from 'react'
import { BrowserRouter as Router, Route} from 'react-router-dom'
import { Routes } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import Navbar from './components/Navbar'
import Quiz from './components/Quiz'
import Profile from './components/Profile'
import NewQuiz from './components/NewQuiz'
import Leaderboard from './components/Leaderboard'
import {leaderboard,leaderboardNew} from './tempData'

export default class App extends Component {
  render() {
      return (
          <div>
            <Navbar/>
              <Router>
                  <Routes>
                      <Route exact path='/' element={<Home />} />
                      <Route exact path='/login' element={<Login />} />
                      <Route exact path='/register' element={<Register />} />
                      <Route exact path='/profile' element={<Profile />} />
                      <Route exact path='/quiz/:quizId' element={<Quiz />} />
                      <Route exact path='/newQuiz' element={<NewQuiz />} />
                      <Route exact path='/lb' element={<Leaderboard olderLeaderboardData={leaderboard} newerLeaderboardData={leaderboardNew} />} />
                  </Routes>
              </Router>
          </div >
      )
  }
}
