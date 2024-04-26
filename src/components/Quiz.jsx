import React from 'react'
import { useParams } from 'react-router-dom'

export default function Quiz() {
    const quizId = useParams().quizId;
  return (
    <div>Quiz</div>
  )
}
