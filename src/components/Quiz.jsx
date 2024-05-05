import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function Quiz() {
    const quizId = useParams().quizId;
    useEffect(()=>{

    })
  return (
    <div>
      Quiz
    </div>
  )
}
