import React, { useEffect, useState } from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import { socket } from '../socket';

export default function Quiz() {
  const quizId = useParams().quizId;
  const [quizFound,setQuizFound] = useState(false);
  const navigate = useNavigate()

  useEffect(()=>{
    if(!socket.connected){
      setTimeout(()=>{
        if(!socket.connected){
          navigate('/')
        }
      },2000)
    }
    function onLoginRequired(){
      navigate('/login')
    }
    function onQuizNotFound(){
      setQuizFound(false)
    }
    function onRoomJoined(roomCode){
      setQuizFound(true)
      console.log("Joined the room : ",roomCode)
    }

    socket.on('login-required',onLoginRequired)
    socket.on('quiz-not-found',onQuizNotFound)
    socket.on("room-joined",onRoomJoined)

    // Join the quiz
    let token = localStorage.getItem('user')
    console.log('token : ',token)
    console.log('code',quizId)
    socket.emit('join-room',quizId,token)

    return () => {
      socket.off('login-required',onLoginRequired)
      socket.off('quiz-not-found',onQuizNotFound)
      socket.off("room-joined",onRoomJoined)
    }
  })

  if(quizFound === false){
    return (
      <div>
        <div className=" text-center text-4xl text-red-500">
          Quiz Not Found
        </div>
      </div>
    )
  }

  return (
    <div>
      Quiz joined {quizId}
    </div>
  )
}
