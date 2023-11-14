import React, { useState, useEffect} from "react"
import { decode } from "html-entities"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"


export default function Questions(props) {
    const [questions, setQuestions] = useState([])      // store the questions from the API
    const [selectedAnswer, setSelectedAnswer] = useState({
        question_0: "",
        question_1: "",
        question_2: "",
        question_3: "",
        question_4: "",
    })
    const [showAnswer, setShowAnswer] = useState(false)
    const [isChecked, setIsChecked] = useState(false)   
  
   // Function to handle showing answers
    function showAnswerHandler(){
        setShowAnswer(true)
    }
    
     // Function to handle radio button change
    const handleRadioChange = (event, questionId) => {
        const { value } = event.target
        setSelectedAnswer((prevSelectedAnswer) => ({
            question_0: selectedAnswer.question_0,
            question_1: selectedAnswer.question_1,
            question_2: selectedAnswer.question_2,
            question_3: selectedAnswer.question_3,
            question_4: selectedAnswer.question_4,
            [questionId] : value,
        }))    
   }   
    
    
    function shuffleItems(array, item) {
        const newArray = item
        const randomIndex = Math.floor(Math.random() * (newArray.length + 1))
        newArray.splice(randomIndex, 0, array)
        return newArray
    }
    
    useEffect(() => {
            fetch(`https://opentdb.com/api.php?amount=5&category=${props.category}&difficulty=${props.difficulty}&type=${props.type}`)
                .then(res => res.json())
                .then((data) => { 
                    // Shuffle the answers for each quiz item
                    const quizShuffledAnswers = data.results.map((quiz) =>({
                        category: quiz.category,
                        type: quiz.type,
                        difficulty: quiz.difficulty,
                        question: quiz.question,
                        correct_answer: quiz.correct_answer,
                        incorrect_answers: quiz.incorrect_answers,
                        answersArray: shuffleItems(quiz.correct_answer, quiz.incorrect_answers) 
                        // Shuffle the answers including the correct one
                    }))
                    setQuestions(quizShuffledAnswers)
            })
            return () => {
                setQuestions([])
                setSelectedAnswer({})
            }
    }, []) 
     
    function renderQuestions() {
        return questions.map((quiz, index) => {
            const question = decode(quiz.question)
            const correctAnswer = decode(quiz.correct_answer)
            const questionId = `question_${index}`
            const answersArray = quiz.answersArray
            const isCorrect = selectedAnswer[questionId] === correctAnswer
            const isWrong = isChecked && !isCorrect

        return (
            <div key={nanoid()} className="quiz-item">
            <p className="question">{question}</p>
            <form className="choices">
                {answersArray.map((answer, ansIndex) => (
                <label 
                    key={ansIndex}
                        className={`label-radio ${
                        selectedAnswer[questionId] === answer
                            ? "checked"
                            : ""
                        } ${
                        isChecked
                            ? answer === correctAnswer
                                ? "correct-answer"
                                : selectedAnswer[questionId] === answer
                                ? "checked"
                                : ""
                            : ""
                        }`}
                        
                        style={{
                                backgroundColor: bgAnswers(quiz, answer, questionId),
                                opacity: btnOpacity(quiz, answer)
                            }}
                    >
                    <input
                    type="radio"
                    name={questionId}
                    value={answer}
                    checked={selectedAnswer[questionId] === answer}
                    onChange={(event) =>
                        handleRadioChange(event, questionId)
                    }
                    disabled = {isChecked}
                    />
                    {decode(answer)}
                </label>
                ))}
            </form>
            </div>
        )
        })
    }
    
    
    function bgAnswers(quiz, answer, questionId) {
        const selected = selectedAnswer[questionId];
        if (isChecked) {
            if (quiz.correct_answer === answer) {
            return '#94D7A2'; // Green background for correct answers
            } else if (selected === answer) {
            return '#F8BCBC'; // Light red background for selected incorrect answers
            }
        } else if (selected === answer) {
            return '#219EBC'; // Blue background for the selected answer before checking
        }
        return '#F5F7FB'; // Default background color for other answers
    }
    
    function btnOpacity(quiz, answer) {
        if (isChecked) {
            if (quiz.correct_answer === answer) {
                return 1
            } else {
                return 0.5
            }
        } else {
            return 1
        }
    }

  
  function checkAnswer() {
        setIsChecked(true)
  }
  
 function generateNewQuestion() {
    setIsChecked(false);

    fetch(`https://opentdb.com/api.php?amount=5&category=${props.category}&difficulty=${props.difficulty}&type=${props.type}`)
        .then((res) => res.json())
        .then((data) => {
            const quizShuffledAnswers = data.results.map((quiz) => ({
                category: quiz.category,
                type: quiz.type,
                difficulty: quiz.difficulty,
                question: quiz.question,
                correct_answer: quiz.correct_answer,
                incorrect_answers: quiz.incorrect_answers,
                answersArray: shuffleItems(quiz.correct_answer, quiz.incorrect_answers),
            }));

            setSelectedAnswer({});
            setQuestions(quizShuffledAnswers)
        })
        .catch((error) => {
            console.error("Error fetching new questions:", error)
        })
    }
  
  const countCorrectAnswer = () => {
      let correctCount = 0
      
      questions.forEach((quiz, index) => {
          const questionId = `question_${index}`
          const selectedChoice = selectedAnswer[questionId]
          const correctAnswer = quiz.correct_answer
          
          if(selectedChoice === correctAnswer) {
              correctCount++
          }
      })
      return correctCount
  }

const totalScore = countCorrectAnswer()

  
 //render questions and answer choices
    return (
      <section className="question-page">
        <img src="./assets/blob.svg" alt="" className="blob" />
        <img src= "./assets/blob1.svg" alt="" className="blob1" />
        <div className="quiz-page">
             {renderQuestions()}
        </div>
    {isChecked ? (
        <div className="total-score">
            <span className="score-msg">
            You Scored: {totalScore} / {questions.length} {" "}{totalScore === 0 
                ? "Try again!"
                : totalScore === questions.length // Check if totalScore 5/5
                ? "Congratulations, you got all correct answers!"
                :  totalScore > 1
                ? "correct answers!" 
                : "correct answer!" }
            </span>
        <button className="play-again-btn" onClick={generateNewQuestion}>Play Again</button>
        <button className="back-to-home" onClick={() => window.location.reload()}>Back To Main</button>
        </div>
    ) : (
        <button className="check-answer-btn" onClick={checkAnswer}>Check Answers</button>
    )}
    {isChecked && totalScore === questions.length && (
        <Confetti />
    )}
      </section>  
    )
}

