import React, {useState, useEffect} from "react"
import Homepg from "./components/Homepg"
import Questions from "./components/Questions"
import Footer from "./components/Footer"

function App() {
    
    const [startQuiz, setStartQuiz] = useState(false)  
    const [formCategoryData, setFormCategoryData] = useState({
        difficulty: "",
        type: "",
        category: ""
    })

    function handleChange(event) {
        const {name, value} = event.target
        
        setFormCategoryData((prevState) => ({
                category: formCategoryData.category,
                difficulty: formCategoryData.difficulty,
                type: formCategoryData.type,
                [name]: value,
            }))
    }
    
    function startQuizFunc() {
            const questionApi = `https://opentdb.com/api.php?amount=5&category=${formCategoryData.category}&difficulty=${formCategoryData.difficulty}&type=${formCategoryData.type}`
            
            const apiUrl = questionApi
            
            fetch(apiUrl)
            .then((res) => res.json())
            .then((data) => {
                startQuizHandler()
            })
            .catch((error) => {
                console.error("Error fetching question:", error)
            })
        }
    
    function handleSubmitForm(event) {
        event.preventDefault()
    }
      
        
    function startQuizHandler() {
        setStartQuiz(true)    
    }
    
    
    return (
        <div>
        <main>
        
        {startQuiz ? <Questions 
                                category = {formCategoryData.category}
                                difficulty = {formCategoryData.difficulty}
                                type = {formCategoryData.type}/> 
                    : <Homepg>
            <div className="inner-homepg">
                <h1 className="title">Quizzical</h1>
                <p className="game-desc">Are you ready to put your knowledge to the test and have fun while doing it?</p>
            <div>
                <form onSubmit={handleSubmitForm} className="form-category">
                <label htmlFor="category" className="select">Select Category</label>
                    <br />
                    <select 
                            id="category"
                            value={formCategoryData.category}
                            onChange={handleChange}
                            name="category"
                    >
                        <option value="">Any Category</option>
                        <option value="9">General knowledge</option>
                        <option value="10">Entertainment: Books</option>
                        <option value="11">Entertainment: Film</option>
                        <option value="12">Entertainment: Music</option>
                        <option value="13">Entertainment: Musicals and Theaters</option>
                        <option value="14">Entertainment: Television</option>
                        <option value="15">Entertainment: Video Games</option>
                        <option value="16">Entertainment: Board Games</option>
                        <option value="17">Entertainment: Japanese Anime and Manga</option>
                        <option value="18">Entertainment: Cartoon and Animations</option>
                        <option value="19">Entertainment: Comics</option>
                        <option value="20">Science and Nature</option>
                        <option value="21">Science: Computers</option>
                        <option value="22">Science: Mathematics</option>
                        <option value="23">Science: Gadgets</option>
                        <option value="24">Mythology</option>
                        <option value="25">Sports</option>
                        <option value="26">Geography</option>
                        <option value="27">History</option>                
                        <option value="28">Politics</option>
                        <option value="29">Art</option>
                        <option value="30">Celebrities</option>
                        <option value="31">Animals</option>
                        <option value="32">Vehicles</option>  
                    </select>
                    <br />
                    
                    <label htmlFor="difficulty" className="select">Select Difficulty</label>
                    <br />
                    <select 
                            id="difficulty"
                            value={formCategoryData.difficulty}
                            onChange={handleChange}
                            name="difficulty"
                    >
                        <option value="">Any Difficulty</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                    <br />
                    
                    <label htmlFor="type" className="select">Select Type</label>
                    <br />
                    <select 
                            id="type"
                            value={formCategoryData.type}
                            onChange={handleChange}
                            name="type"
                    >
                        <option value="">Any Type</option>
                        <option value="multiple">Multiple Choice</option>
                        <option value="boolean">True/False</option>
                    </select>
                    <br />
                    <button className="start-quiz-btn" onClick={startQuizFunc}>Start Quiz</button> 
                </form>
            </div>        
            </div>
            </Homepg> }
        </main> 
        <Footer />
    </div>
    )
}

export default App