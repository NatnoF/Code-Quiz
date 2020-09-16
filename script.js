// Hooking elements
var displayQuestionEl = document.querySelector(".displayQuestions");
var timerEl = document.querySelector(".timer");
var resultsEl = document.querySelector(".results");

// Creating dynamic elements
var mainDisplay = document.createElement("h2");
var startButton = document.createElement("button");
var submitButton = document.createElement("button");
var clearButton = document.createElement("button");
var highscore = document.createElement("input"); 
var subDisplay = document.createElement("p");

// Declaring global variables
var timer = 75;
var index = 0;
var questionTimer;
var highscores = [];

// Function that loads content when page first loads
function openingPage()
{
    // Adding a description of the game
    mainDisplay.textContent = "Try to answer the following code-related questions. You will have four choices, if you are incorrect your timer will be penalized by 10 seconds. You start with 75 seconds, if you hit 0 seconds the quiz will finish. Alternatively, if you manage to complete all questions, the time remaining will be your final score.";
    mainDisplay.setAttribute("style", "font-size: 1.15em; font-weight: normal; text-align: center;")
    // Adding text to the button
    startButton.textContent = "Start Quiz";
    startButton.setAttribute("style", "background-color: indigo; color: white; border-radius: 5px; cursor: pointer; display: flex; justify-content: center; margin: 0 auto;");
    // Adding both to screen
    displayQuestionEl.append(mainDisplay, startButton);

    var storedHighscores = JSON.parse(localStorage.getItem("highscores"));

    // If highscores were retrieved from localStorage, update the highscores array to it
    if (storedHighscores !== null) 
    {
        highscores = storedHighscores;
    }
}

function highscoresPage()
{
    displayQuestionEl.textContent = "";
    var storedHighscores = JSON.parse(localStorage.getItem("highscores"));

    // If highscores were retrieved from localStorage, update the highscores array to it
    if (storedHighscores !== null) 
    {
        highscores = storedHighscores;
    }
    // Render a new li for each highscore
    for (var i = 0; i < highscores.length; i++) 
    {
        var highscore = highscores[i];

        var li = document.createElement("li");
        li.textContent = highscore;
        li.setAttribute("data-index", i);

        displayQuestionEl.append(li);
    }

    submitButton.textContent = "Go Back";
    submitButton.setAttribute("style", "background-color: indigo; color: white; border-radius: 5px; cursor: pointer; margin-right: 5px; margin-top: 10px;");
    clearButton.textContent = "Clear Highscores";
    clearButton.setAttribute("style", "background-color: indigo; color: white; border-radius: 5px; cursor: pointer; margin-right: 5px; margin-top: 10px;");

    displayQuestionEl.append(submitButton, clearButton);

    submitButton.addEventListener("click", function(event) 
    {
        event.preventDefault();
        location.href="index.html";

    });

    clearButton.addEventListener("click", function(event) 
    {
        event.preventDefault();
        highscores = [];
        saveHighscore();
        highscoresPage();
    });
}
function startQuiz()
{
    // Displaying timer to screen
    showTimer("start");
    nextQuestion();

}

function showTimer(string)
{
    timerEl.textContent = "Time: " + timer;

    if (string == "stop")
    {
        clearInterval(questionTimer);
    }
    else
    {
        questionTimer = setInterval(function()
        {
            // Decreasing timer by 1 second
            timer--;
            //Displaying new time left
            timerEl.textContent = "Time: " + timer;
            
            if (timer <= 0)
            {
                clearInterval(questionTimer);
            }
        }, 1000);
    }
    
}

function nextQuestion()
{
    var currentQuestion = questions[index];

    // Emptying question container element
    displayQuestionEl.textContent = "";
    // Add current question title to page
    mainDisplay.textContent = currentQuestion.title;
    mainDisplay.setAttribute("style", "font-size: 1.5em; font-weight: bold; text-align: left;")
    // Append it to the display variable so it actually shows
    displayQuestionEl.append(mainDisplay);
    // create a div element to wrap the "choices"
    var choicesContainer = document.createElement("div");
    // use a loop to:
    for (let i = 0; i < currentQuestion.choices.length; i++)
    {
        // Creating the answer choices in the form of buttons
        var choiceButton = document.createElement("button");
        choiceButton.setAttribute("style", "background-color: indigo; color: white; border-radius: 5px; cursor: pointer; display: flex; margin-top: 3px;");
        choiceButton.textContent = currentQuestion.choices[i];
        choiceButton.addEventListener("click", checkAnswer);
        choicesContainer.append(choiceButton);
    }

    displayQuestionEl.append(choicesContainer);
}

function checkAnswer(event)
{
    // Empyting results container and making it ready to show text once again
    resultsEl.textContent = "";
    resultsEl.setAttribute("style", "display: block;")
    // Logic for answer
    var responseText = event.target.textContent;
    if (responseText === questions[index].answer)
    {
        // Creating an h3 element that will tell you that you got the question correct and will disappear after 1 second
        var resultText = document.createElement("h3");
        resultText.textContent = "Correct!";
        resultText.setAttribute("style", "border-top: 3px solid gray; opacity: 0.33; font-style: italic; padding-top: 5px;");
        resultsEl.append(resultText);
        setTimeout(function(){ resultsEl.setAttribute("style", "display: none;") }, 1000);
    }
    else
    {
        // Penalizing the user's score/time for getting the question wrong
        timer = timer - 10;
        timerEl.textContent = "Time: " + timer;
        // Creating an h3 element that will tell you that you got the question wrong and will disappear after 1 second
        var resultText = document.createElement("h3");
        resultText.textContent = "Wrong!";
        resultText.setAttribute("style", "border-top: 3px solid gray; opacity: 0.33; font-style: italic; padding-top: 5px;");
        resultsEl.append(resultText);
        setTimeout(function(){ resultsEl.setAttribute("style", "display: none;") }, 1000);
    }
    // Checking to see if they've reached the end of the questions, otherwise it will continue asking more questions.
    if (index >= questions.length - 1)
    {
        stopGame();
    }
    else
    {
        index++;
         // Show next question
        nextQuestion();
    }

}

function stopGame()
{
    showTimer("stop");
    // Clearing screen
    displayQuestionEl.textContent = "";
    // Final screen text
    mainDisplay.textContent = "All Done!"
    subDisplay.textContent = "Your final score is: " + timer;
    // Making an input for the user's initials
    highscore.setAttribute("type", "text"); 
    highscore.setAttribute("name", "FullName"); 
    highscore.setAttribute("placeholder", "Enter Initials");
    highscore.setAttribute("id", "highscore-text")
    // Creating the submit button
    submitButton.textContent = "Submit";
    submitButton.setAttribute("style", "background-color: indigo; color: white; border-radius: 5px; cursor: pointer; margin-left: 5px;");
    // Making all this appear on screen
    displayQuestionEl.append(mainDisplay, subDisplay, highscore, submitButton);

    var highscore_text = document.querySelector("#highscore-text");

    submitButton.addEventListener("click", function(event) {
        event.preventDefault();
        
        var highscoreText = highscore_text.value.trim() + ": " + timer;
      
        // Return from function early if submitted highscoreText is blank
        if (highscoreText === "") 
        {
          return;
        }
      
        // Add new highscoreText to highscores array
        highscores.push(highscoreText);
        console.log(highscores.length);
        
        // Store updated highscores in localStorage and send them to highscore page
        saveHighscore();
        location.href="zHighscores.html";

      });
   
}

function saveHighscore()
{
    localStorage.setItem("highscores", JSON.stringify(highscores));
}

startButton.addEventListener("click", startQuiz);

// Detecting which html the user is on
var path = window.location.pathname;
var page = path.split("/").pop();

if (page == "index.html")
{
    openingPage();
}
else
{
    highscoresPage();
}
