import { React, Component,useState } from 'react'
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import Navbar from './components/Navbar'
import Quiz from './components/Quiz'
import Profile from './components/Profile'
import NewQuiz from './components/NewQuiz'
import { socket } from './socket.js'

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isConnected: socket.connected,
            theme: 'light'
        }
    }

    componentDidMount() {
        console.log(process.env.REACT_APP_SERVER_URI)
        socket.on('connect', this.onConnect);
        socket.on('disconnect', this.onDisconnect);
        document.querySelector('html').setAttribute('data-theme', 'light');
        socket.connect();
    }

    componentWillUnmount() {
        socket.off('connect', this.onConnect);
        socket.off('disconnect', this.onDisconnect);
    }

    onConnect = () => {
        this.setState({ isConnected: true });
    };

    onDisconnect = () => {
        this.setState({ isConnected: false });
    };
    
    render() {
        const { isConnected,theme } = this.state
        return (
            <div>
                <Navbar connection={isConnected}/>
                <Router>
                    <Routes>
                        <Route exact path='/' element={<Home />} />
                        <Route exact path='/login' element={<Login />} />
                        <Route exact path='/create' element={<NewQuiz />} />
                        <Route exact path='/register' element={<Register />} />
                        <Route exact path='/profile' element={<Profile />} />
                        <Route exact path='/quiz/:quizId' element={<Quiz />} />
                    </Routes>
                </Router>
            </div >
        )
    }
}
