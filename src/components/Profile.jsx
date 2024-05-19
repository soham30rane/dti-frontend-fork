import React, { useEffect, useMemo, useState } from 'react';
import { AiOutlineCopy, AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { MdFileDownload,MdPeople } from 'react-icons/md';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { getQuizPdf } from '../helpers/pdfLogic';

const getQuizPriority = (quiz) => {
    if(quiz.started && !quiz.completed){
        return 1;
    } else if(!quiz.started){
        return 2;
    } else {
        return 3;
    }
}

const sortQuizzes = (quizzes) => {
    quizzes.sort((a,b) => {
        return getQuizPriority(a) - getQuizPriority(b);
    })
    return quizzes;
}


export default function Profile() {
    const [quizzes, setQuizzes] = useState([]);
    const [otherQuizzes, setOtherQuizzes] = useState([])
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [displayMyQuizzes, setDisplayMyQuizzes] = useState(true)
    const [pageNo,setPageNo] = useState(1)
    // const [toggeledIndex,setToggledIndex] = useState(-1)
    const TILES_PER_PAGE = 10;
    
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

    const getProfile = async () => {
        const token = localStorage.getItem('user');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        });
        const data = await response.json();
        // console.log(data.quizes);
        setQuizzes(data.quizes);
        setOtherQuizzes(data.otherQuizzes)
    };

    const deleteApiCall = async (quizCode) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/quiz/delete`,{
            method : 'POST',
            headers : {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('user'),
            },
            body: JSON.stringify({ code: quizCode })
        })
        const data = await response.json();
        console.log(data);
        if (data.error) {
            alert(data.message);
        } else {
            window.location.href = '/profile';
        }

    }

    const startOrJoin = async (quiz) => {
        if(!displayMyQuizzes){
            window.location.href = '/quiz/' + quiz.code;
            return;
        }

        if(quiz.completed){
            window.location.href = '/quiz/' + quiz.code;
            return;
        }

        if(quiz.started){
            window.location.href = '/quiz/' + quiz.code;
            return;
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/quiz/start/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('user'),
            },
            body: JSON.stringify({ code: quiz.code }),
        });
        const data = await response.json();
        console.log(data);
        if (data.error) {
            alert(data.message);
        } else {
            window.location.href = '/profile';
        }
    };

    useEffect(() => {
        getProfile();
    },[]);

    const duplicateQuiz = (quiz) => {
        console.log("duplicating quiz")
        localStorage.setItem('duplicatedQuiz',JSON.stringify(quiz))
        window.location.href = "/create/duplicate"
    }

    const editQuiz = (quiz) => {
        console.log("Editing quiz")
        localStorage.setItem('editedQuiz',JSON.stringify(quiz))
        window.location.href = "/create/edit"
    }

    const downloadPDF = (quiz) => {
        console.log("Downloading pdf")
        getQuizPdf(quiz)
    }

    const deleteQuiz = (quiz) => {
        confirmAlert({
            title: 'Confirm Delete',
            message: `Are you sure, you want to delete the quiz "${quiz.title}" with code '${quiz.code}'`,
            buttons: [
              {
                label: 'Delete',
                onClick: () => {
                    deleteApiCall(quiz.code)
                },
                style : { backgroundColor: 'rgb(239, 68, 68) ', color: 'white ' },
              },
              {
                label: 'Cancel',
                onClick: () => {
                    console.log("Delete cancelled")
                } 
              }
            ]
          });
    }

    let quizzesToDisplay = useMemo(()=>{
        if(displayMyQuizzes){ return quizzes; }
        return otherQuizzes;
    },[displayMyQuizzes,otherQuizzes,quizzes])

    let lastPageNo = useMemo(()=>{
        return (Math.floor(quizzesToDisplay.length / TILES_PER_PAGE) 
        + Number(quizzesToDisplay.length % TILES_PER_PAGE !== 0)); 
    },[quizzesToDisplay])

    return (
        <div className='min-h-screen bg-gradient-to-r from-blue-400 to-green-300' >
            <div className={`profile ${isMobile?'':'w-4/6'} mx-auto`} style={{ padding: '20px' }}>
            {/* <h1 className="profile-name text-4xl font-bold m-6" style={{ color: 'darkblue' }}>
                    {'Quizzes'}
            </h1> */}
            <div role="tablist" className={`tabs tabs-boxed bg-transparent border-2 border-black my-7 ${isMobile?'':'w-2/3 mx-auto'}`}>
                <span role="tab" className={`tab ${displayMyQuizzes?'tab-active':''}`}
                onClick={()=>{ setDisplayMyQuizzes(true)}} >My Quizzes</span>
                <span role="tab" className={`tab ${displayMyQuizzes?'':'tab-active'}`}  
                onClick={()=>{ setDisplayMyQuizzes(false)}}>Other Quizzes</span>
            </div>
                <div className="quiz-list">
                    {quizzesToDisplay.length === 0?<div className='text-center text-gray-800 text-lg font-semibold py-4' > No Quizzes yet </div>:<></>}
                    {sortQuizzes(quizzesToDisplay).slice((pageNo-1)*TILES_PER_PAGE,(pageNo-1)*TILES_PER_PAGE + TILES_PER_PAGE).map((quiz, index) => (
                        <div
                        key={index}
                        className={`relative flex flex-col justify-between items-center p-4 ${displayMyQuizzes?'pb-8':`${quiz.completed?'':'pb-8'}`} border border-gray-800 bg-blue-200 mb-4 rounded-lg shadow-md hover:bg-blue-300 transition-colors duration-300 ease-in-out`}
                    >
                        <div className='flex flex-row w-full justify-between items-center'>
                            <h3 className={`${isMobile?'text-md':'text-xl'} text-white font-bold mx-2`}>{quiz.title}</h3>
                            <span className={`${isMobile?'text-xs':'text-sm'} text-gray-600 mx-2 min-w-16`}>{quiz.code}</span>
                            <button
                                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 min-w-24 rounded focus:outline-none focus:shadow-outline ${isMobile?'w-1/3':''}`}
                                onClick={() => startOrJoin(quiz)}
                            >
                                <span className={`${isMobile?'text-sm':''}`}>{quiz.started?`${quiz.completed?"View Results":"View Live"}`:`${displayMyQuizzes?'Start Quiz':'Join'}`}</span>
                            </button>
                        </div>
                        {!(quiz.started && !quiz.completed) && displayMyQuizzes && <div className='absolute bottom-1 left-4 mb-1'>
                            <div className='flex flex-row w-full justify-between items-center'>
                                <div className="flex space-x-4">
                                    <button
                                        className="text-gray-600 hover:text-gray-800"
                                        onClick={() => { duplicateQuiz(quiz) }}
                                        title="Duplicate Quiz">
                                        <AiOutlineCopy />
                                    </button>
                                    {!quiz.started && <button
                                        className="text-gray-600 hover:text-gray-800"
                                        onClick={() => { editQuiz(quiz) }}
                                        title="Edit Quiz">
                                        <AiFillEdit />
                                    </button>}
                                    <button
                                        className="text-gray-600 hover:text-gray-800"
                                        onClick={() => { downloadPDF(quiz) }}
                                        title="Download Quiz">
                                        <MdFileDownload />
                                    </button>
                                    {!(quiz.started && !quiz.completed) && <button
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() => { deleteQuiz(quiz) }}
                                        title="Delete Quiz">
                                        <AiFillDelete />
                                    </button>}
                                </div>
                            </div>
                        </div>}
                        {quiz.completed === false && <div className='absolute bottom-1 right-4 mb-1'>
                            <div className='flex flex-row w-full justify-between items-center'>
                                    <div className="flex space-x-4">
                                        <MdPeople className="text-lg text-gray-500" />
                                        <span className={`text-sm text-gray-700`}>{quiz.onlineCount} Online</span>
                                    </div>
                            </div>
                        </div>}
                    </div>
                    ))}
                </div>
                {lastPageNo>1 && <div className="join">
                    <button className={`join-item btn ${pageNo === 1?'btn-disabled':''}`} onClick={()=>{setPageNo(pageNo-1)}}>«</button>
                    <button className="join-item btn">Page {pageNo}</button>
                    <button className={`join-item btn ${pageNo === lastPageNo ? 'btn-disabled':''}`} onClick={()=>{setPageNo(pageNo+1)}}>»</button>
                </div>}
            </div>
        </div>
    );
}
