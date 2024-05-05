import React, { useEffect, useState } from 'react';
import { CiCirclePlus } from 'react-icons/ci';
import { MdDelete } from 'react-icons/md';
import { FaSave } from 'react-icons/fa';

export default function NewQuiz() {
    const [quizTitle, setQuizTitle] = useState('Title here');
    const [questions, setQuestions] = useState([]);
    const [showDialog, setDialog] = useState();
    const [error, seterror] = useState('');
    const [code, setCode] = useState('');

    useEffect(() => {
        if (showDialog === 1) {
            document.getElementById('error_modal').showModal();
        }
        if (showDialog === 2) {
            document.getElementById('saved_modal').showModal();
        }
    }, [showDialog])

    const handleTitleChange = (e) => {
        setQuizTitle(e.target.value);
    };

    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            {
                questionText: 'Question ' + (questions.length + 1),
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correctIndex: 0,
                points: 1000,
            },
        ]);
    };

    const handleSave = async () => {
        const response = await fetch('http://localhost:5000/quiz/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('user')
            },
            body: JSON.stringify({
                title: quizTitle,
                questions: questions
            })
        })
        const data = await response.json();
        console.log(data)
        if (data.error) {
            setDialog(1);
            seterror(data.message);
        } else {
            setDialog(2);
            setCode(data.quiz.code)
        }
    }

    const handleUpdatePoints = (index, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].points = value;
        setQuestions(updatedQuestions);
    };
    const handleOptionchange = (questionIndex,optionIndex,value)=>{
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(updatedQuestions)
    }
    const handleRadioChange = (questionIndex, optionIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].correctIndex = optionIndex;
        setQuestions(updatedQuestions);
    };

    const handleQuestionDel = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1);
        setQuestions(updatedQuestions);
    };
    const handleQuestionTitleChange = (index, value) => {
        const updatedQuestions = [...questions]
        updatedQuestions[index].questionText = value;
        setQuestions(updatedQuestions);
    }
    return (
        <div className="flex items-center flex-col">
            {showDialog === 1 ? <div>
                <dialog id="error_modal" className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg text-error">Error</h3>
                        <p className="py-4">{error}</p>
                        <div className="modal-action">
                            <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn">Close</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div> : <></>}
            {showDialog === 2 ? <div>
                <dialog id="saved_modal" className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg text-error">Quiz saved</h3>
                        <p className="py-4">{window.location.href.slice(0, -6) + 'quiz/' + code}</p>
                        <button className='btn btn-primary' onClick={() => {
                            navigator.clipboard.writeText(window.location.href.slice(0, -6) + 'quiz/' + code)
                        }}>
                            Copy
                        </button>
                        <div className="modal-action">
                            <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn">Close</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div> : <></>}
            <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full max-w-xs"
                value={quizTitle}
                onChange={handleTitleChange}
            />
            {questions.map((question, questionIndex) => (
                <div className="card w-96 bg-base-100  my-10 shadow-xl" key={questionIndex}>
                    <div className="card-body">
                        <div className="flex items-center">
                            <textarea placeholder="Type here" className="textarea textarea-bordered textarea-sm w-full max-w-xs" value={question.questionText}style={{
                                resize: 'none'
                            }} onChange={(e) => {
                                handleQuestionTitleChange(questionIndex, e.target.value);
                            }}></textarea>
                            <button className="btn btn-error btn-sm ml-2" onClick={() => handleQuestionDel(questionIndex)}>
                                <MdDelete />
                            </button>
                        </div>
                        {question.options.map((option, optionIndex) => (
                            <div className="form-control" key={optionIndex}>
                                <label className="cursor-pointer label">
                                    <input className="label-text px-2" value={option} onChange={(e)=>{
                                        handleOptionchange(questionIndex,optionIndex,e.target.value)
                                    }}/>
                                    <input
                                        className="label-text px-2 radio"
                                        value={option}
                                        type="radio"
                                        name={`question-${questionIndex}`}
                                        checked={question.correctIndex === optionIndex}
                                        onChange={() => handleRadioChange(questionIndex, optionIndex)}
                                    />

                                </label>
                            </div>
                        ))}
                        <div className="form-control flex items-center">
                            <label className="label inline-block w-20 mr-2">Points</label>
                            <input
                                type="number"
                                className="input input-bordered w-full max-w-xs"
                                value={question.points}
                                onChange={(e) => handleUpdatePoints(questionIndex, e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            ))}
            <button className="btn btn-success" onClick={handleAddQuestion}>
                <CiCirclePlus />
                Add Question
            </button>
            <button className={"btn btn-secondary mx-10 my-10 "} onClick={handleSave}>
                <FaSave />
                Save
            </button>
        </div>
    );
}
