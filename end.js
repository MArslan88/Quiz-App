const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');

const finalScore = document.getElementById('finalScore'); 
const mostRecentScore = localStorage.getItem('mostRecentScore'); // call the Recent Score from the localStorage

// localStorage.setItem("highScore", JSON.stringify([])); //? Create a highScore Array in a local Storage
// console.log(JSON.parse(localStorage.getItem("highScores")));
const highScores = JSON.parse(localStorage.getItem("highScores")) || []; 

const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore; // display the Recent Score in Final Score H1 tag

username.addEventListener("keyup", () => {
    // console.log(username.value);
    saveScoreBtn.disabled = !username.value;
});

saveHighScore = e => {
    console.log('Clicked the save button');
    e.preventDefault();

    // object of score
    const score = {
        score: Math.floor(Math.random()*100),
        name: username.value
    };
    highScores.push(score);    

    // highScores.sort((a,b) => {
    //     return b.score - a.score;
    // })
    //* if 'b' is higher than the 'a' then put 'b' before 'a' 
    highScores.sort((a,b) => b.score - a.score)
    highScores.splice(5);

    localStorage.setItem('highScores', JSON.stringify(highScores));
    window.location.assign("/");

}