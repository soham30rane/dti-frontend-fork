import React, { useEffect } from 'react'
import bgimage from './assets/loginbg.png'

export default function NewQuiz() {

    useEffect(()=>{
        document.body.style.backgroundImage = `url(${bgimage})`
        document.body.style.height = "100vh"
        document.body.style.overflow = 'auto'
    },[])

  return (
    <div className="w-full mx-auto p-4 flex flex-col">
        {/* Quiz Title Input */}
        <div className='w-4/6 mb-4 mx-auto'><input type="text" placeholder="Enter quiz title" className="input w-full" /></div>
        {/* Add Question Button */}
        <button 
            className="btn btn-primary mt-4 mx-auto" 
            onClick={() => {/* function to add a question */}}
        >
            + Add Question
        </button>

        {/* Quiz Questions Section */}
        <div className=" mx-auto p-4 flex flex-col justify-evenly w-full">
            <div className="space-y-6 w-4/6 mx-auto"> {/* Limiting width to 'max-w-lg' */}
                {/* Example of a Single Question Card */}
                <div className="card bg-base-100 p-6 shadow-xl rounded-lg">
                <input
                    type="text"
                    className="input input-bordered input-primary w-full mb-3"
                    placeholder="Enter question"
                    // disabled // Remove 'disabled' when integrating logic
                />
                {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="flex items-center mb-1">
                    <input
                        type="text"
                        className="input input-bordered flex-grow mr-1"
                        placeholder={`Option ${idx + 1}`}
                        // disabled // Remove 'disabled' when integrating logic
                    />
                    <input
                        type="radio"
                        name="correctOption"
                        className="radio radio-primary"
                        // disabled // Remove 'disabled' when integrating logic
                    />
                    </div>
                ))}
                <button className="btn btn-error btn-sm mt-2 mx-auto w-2/6">Delete Question</button>
                </div>

                {/* Placeholder for additional questions */}
            </div>
            
        </div>
        
        {/* Create Button */}
    </div>
  )
}
