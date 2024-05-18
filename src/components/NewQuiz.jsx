import React, { useEffect, useState } from 'react';
import { CiCirclePlus } from 'react-icons/ci';
import { MdDelete } from 'react-icons/md';
import { FaSave } from 'react-icons/fa';
import bgimage from './assets/loginbg.png'
import { useParams } from 'react-router-dom';

const OP_MODE = {
    NORMAL : "normal",
    DUPLICATE : "duplicate",
    EDIT : "edit"
}

export default function NewQuiz() {
    const { mode } = useParams();
    const [quizTitle, setQuizTitle] = useState('Title here');
    const [questions, setQuestions] = useState([]);
    const [showDialog, setDialog] = useState();
    const [error, seterror] = useState('');
    const [code, setCode] = useState('');
    const [editCode,setEditCode] = useState('');

    useEffect(()=>{
        if(mode === OP_MODE.DUPLICATE){
            let oldquiz = JSON.parse(localStorage.getItem('duplicatedQuiz'))
            if(oldquiz){
                setQuizTitle(`${oldquiz.title} - Copy`)
                setQuestions(oldquiz.questions)
            }
        } else if ( mode === OP_MODE.EDIT ) {
            let oldquiz = JSON.parse(localStorage.getItem('editedQuiz'))
            if(!oldquiz){
                window.location.href = '/'
            } else {
                setQuizTitle(oldquiz.title)
                setQuestions(oldquiz.questions)
                setEditCode(oldquiz.code)
            }
        }
    },[mode])

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
                questionText: '',
                options: ['', '', '', ''],
                correctIndex: 0,
                points: 1000,
            },
        ]);
    };

    const handleSave = async () => {
        const questionsCopy = []
        for(let i=0;i<questions.length;i++){
            let question = questions[i];
            if(question.questionText === ''){
                continue
            }
            questionsCopy.push(question)
            for(let i=0;i<questionsCopy[questionsCopy.length - 1].options.length;i++){
                let option = questionsCopy[questionsCopy.length - 1].options[i]
                if(option === ''){
                    questionsCopy[questionsCopy.length - 1].options[i] = 'NA'
                }
            }
        }
        if(questionsCopy.length === 0){
            setDialog(1)
            seterror("Quiz is empty")
            return
        }
        let bodyData = {
            title: quizTitle,
            questions: questionsCopy
        }
        if(mode === OP_MODE.EDIT){ 
            bodyData.quizCode = editCode
        }
        const response = await fetch(`${process.env.REACT_APP_API_URL}/quiz/${mode === OP_MODE.EDIT?'edit':'create'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('user')
            },
            body: JSON.stringify(bodyData)
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

    useEffect(()=>{
        document.querySelector('body').style.backgroundImage = `url(${bgimage})`
        document.querySelector('body').style.minHeight = `100vh`
    },[])

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    
    useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        document.body.style.minHeight = '100vh'
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    },[]);

    useEffect(()=>{
        const handleBeforeUnload = (event) => {
            if(code){ return; }
            event.preventDefault();
            try {
                console.log('confirming')
                const message = 'Confirm resubmission: You will lose all the data if you refresh.';
                event.returnValue = message; // Gecko, Trident, Chrome 34+
                return message; // Gecko, WebKit, Chrome <34
            } catch(err){
                console.log(err)
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    },[code])

    return (
        <div className="flex items-center flex-col mx-2">
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
                        <p className="py-4">{window.location.href.slice(0, -7 - (mode.length)) + 'quiz/' + code}</p>
                        <button className='btn btn-primary' onClick={() => {
                            navigator.clipboard.writeText(window.location.href.slice(0, -7 - (mode.length)) + 'quiz/' + code)
                        }}>
                            Copy
                        </button>
                        <div className="modal-action">
                            <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn" onClick={()=>{
                                    console.log('clicked')
                                    window.location.href = '/'
                                }}>Close</button>
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
                <div className={`card ${isMobile?'w-full':'w-96'} bg-base-100  my-10 shadow-xl`} key={questionIndex}>
                    <div className="card-body">
                        <div className="flex items-center">
                            <textarea placeholder={`Question ${questionIndex + 1}`} className="textarea textarea-bordered textarea-sm w-full max-w-xs" value={question.questionText} style={{
                                resize: 'none'
                            }} onChange={(e) => {
                                handleQuestionTitleChange(questionIndex, e.target.value);
                            }}></textarea>
                            <button className="btn btn-error btn-sm ml-2" onClick={() => handleQuestionDel(questionIndex)}>
                                <MdDelete />
                            </button>
                        </div>
                        {question.options.map((option, optionIndex) => (
                            <div className={`form-control ${optionIndex === question.correctIndex?' bg-lime-200':''}`} key={optionIndex}>
                                <label className="cursor-pointer label">
                                    <input className={`label-text px-2 ${optionIndex === question.correctIndex?' bg-lime-200':''}`} placeholder={`option ${optionIndex + 1}`} value={option} onChange={(e)=>{
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
                                step={`50`}
                                min="0"
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
                {mode === OP_MODE.EDIT ? 'Save changes' : 'Save'}
            </button>
        </div>
    );
}
