import React, { useEffect, useState,useRef } from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import { socket } from '../socket';
import QuizNotFound from './QuizNotFound';
import QuizNotStarted from './QuizNotStarted';
import QuizGetReady from './QuizGetReady';
import QuizQuestion from './QuizQuestion';
import Leaderboard from './Leaderboard';

const RunStates = {
  GET_READY : "get_ready",
  QUESTION : "question",
  RESULT : "result"
}

export default function Quiz() {
  const quizId = useParams().quizId;
  const [quizFound,setQuizFound] = useState(false);
  const [running,setRunning] = useState(false);
  const [runningState,setRunningState] = useState(RunStates.GET_READY);
  const [questionData,setQuestionData] = useState(null)
  const [oldLeaderBoard, setOldLeaderBoard] = useState(null)
  const [newLeaderBoard, setNewLeaderBoard] = useState([])
  const [isEnded,setIsEnded] = useState(false)
  const [quizTitle,setQuizTitle] = useState("Title")
  const [onlineCount,setOnlineCount] = useState(0)
  const navigate = useNavigate();
  const shouldJoinRoomRef = useRef(true);

  const updateLeaderBoards = (lb) => {
    setOldLeaderBoard(newLeaderBoard)
    setNewLeaderBoard(lb)
  }

  useEffect(()=>{
    if(!socket.connected){
      setTimeout(()=>{
        if(!socket.connected){
          navigate('/')
        }
      },2000)
    }
    function onLoginRequired(){
      console.log("got login req")
      navigate('/login')
    }
    function onQuizNotFound(){
      setQuizFound(false)
    }
    function onRoomJoined(roomCode,title,onlineCount){
      setQuizFound(true)
      setQuizTitle(title)
      setOnlineCount(onlineCount)
      console.log("Joined the room : ",roomCode)
    }
    function onGetReady(){
      setRunning(true)
      setRunningState(RunStates.GET_READY)
    }
    function onQuestion(question,q_index){
      // console.log('Got question' , question, " i = ",q_index)
      setQuestionData({...question,q_index})
      setRunningState(RunStates.QUESTION)
    }
    function onResult(leaderboard){
      updateLeaderBoards(leaderboard)
      setRunningState(RunStates.RESULT)
      setQuestionData(null)
    }
    function onQuizEnded(leaderboard,title){
      setQuizTitle(title)
      setQuizFound(true)
      setOldLeaderBoard([])
      setNewLeaderBoard(leaderboard)
      setIsEnded(true)
    }

    socket.on('login-required',onLoginRequired)
    socket.on('quiz-not-found',onQuizNotFound)
    socket.on("room-joined",onRoomJoined)
    socket.on('get-ready',onGetReady)
    socket.on('question',onQuestion)
    socket.on('results',onResult)
    socket.on('quiz-ended',onQuizEnded)

    // Join the quiz
    if(!quizFound && shouldJoinRoomRef.current){
      let token = localStorage.getItem('user')
      // console.log('token : ',token)
      // console.log('code',quizId)
      // console.log('Joining : ',token)
      socket.emit('join-room',quizId,token)
      shouldJoinRoomRef.current = false
    }

    function handleBeforeUnload(){
      if(quizFound){
        let token = localStorage.getItem('user')
        // console.log('token : ',token)
        // console.log('code',quizId)
        // console.log('Joining : ',token)
        localStorage.setItem('last-emit',JSON.stringify({quizId,token,msg:'leave-room'}))
        // console.log('Leaving rrom')
        socket.emit('leave-the-room',quizId,token)
      }
    }

    window.addEventListener('beforeunload',handleBeforeUnload)

    return () => {
      socket.off('login-required',onLoginRequired)
      socket.off('quiz-not-found',onQuizNotFound)
      socket.off("room-joined",onRoomJoined)
      socket.off('get-ready',onGetReady)
      socket.off('question',onQuestion)
      socket.off('results',onResult)
      socket.off('quiz-ended',onQuizEnded)
      window.removeEventListener('beforeunload',handleBeforeUnload)
    }
  })

  if(isEnded){
    return ( 
      <div className='mx-2'> 
        <Leaderboard olderLeaderboardData={oldLeaderBoard} newerLeaderboardData={newLeaderBoard}  title={quizTitle} isEnded={true}/> 
      </div> 
      )
  }

  if(quizFound === false){
    return ( <div> <QuizNotFound /> </div> );
  }

  if(!running){
    return (<div> <QuizNotStarted quizCode={quizId} title={quizTitle} onlineCount={onlineCount}/> </div> )
  } else {
    switch(runningState){
      case RunStates.QUESTION : 
          return ( <div> <QuizQuestion question={questionData} roomcode={quizId} /> </div> )
      case RunStates.GET_READY :
        return ( <div> <QuizGetReady /> </div> )
      default:
        return ( 
        <div className='mx-2'> 
          <Leaderboard olderLeaderboardData={oldLeaderBoard} newerLeaderboardData={newLeaderBoard} title={quizTitle} isEnded={false}/> 
        </div> 
        )
    }
  }

}
