const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestion = [];

let questions = [];

// fetch data from questions.json 
fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple").then(res => {
    // console.log(res);
    return res.json();
}).then(loadedQuestions => {
    console.log(loadedQuestions.results);
    questions = loadedQuestions.results.map( loadedQuestion => {
        const formattedQuestion = {
            question: loadedQuestion.question
        };

        const answerChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
        answerChoices.splice(formattedQuestion.answer -1, 0, loadedQuestion.correct_answer);

        answerChoices.forEach((choice, index) => {
            formattedQuestion["choice" + (index+1)] = choice;
        });

        return formattedQuestion;
    });
    // questions = loadedQuestions;    

    //start GAME 
    startGame();

}).catch(err => {  // to cath the error
    console.error(err);
});

// CONSTANT
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions]; //* ...question : this will copy the ArrayItems from the 'question'    
    getNewQuestion();

    // remove the hidden class from game div to show the game after question loading, and include the the hidden class to looader div.
    game.classList.remove("hidden");
    loader.classList.add("hidden")
};

getNewQuestion = () => {
    if (availableQuestions.length == 0 || questionCounter >= MAX_QUESTIONS) {

        // store the Recent Score
        localStorage.setItem("mostRecentScore", score);

        // go to the end page
        return window.location.assign("/end.html");
    }

    questionCounter++;
    // display the question counter in HUD-TEXT
    progressText.innerText = "Question " + questionCounter + "/" + MAX_QUESTIONS;

    // update the progress bar
    // console.log((questionCounter/MAX_QUESTIONS)*100);
    progressBarFull.style.width = (questionCounter / MAX_QUESTIONS) * 100 + "%";

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    // splice out the question which we already answered
    availableQuestions.splice(questionIndex, 1);

    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        // console.log(e.target);
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        // const classToApply = "incorrect";
        // if (selectedAnswer == currentQuestion.answer) {
        //     classToApply = "correct";
        // }
        //? same thing with the help of turnery operator
        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
        // console.log(classToApply);        

        // console.log(selectedAnswer); //? to show the 'data-number' value of the selected answer
        // console.log(selectedAnswer == currentQuestion.answer); //? to find out wether our answer is TRUE or FALSE

        // HUD score after condition checked
        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);
        // to delay the the remove part so we can feel the color effect
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

// function for score increment
incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}
