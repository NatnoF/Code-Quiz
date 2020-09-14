// Hooking elements
var displayQuestionEl = document.querySelector(".displayQuestions");
var timerEl = document.querySelector(".timer");
var resultsEl = document.querySelector(".results");

// Creating dynamic elements
var mainDisplay = document.createElement("h3");
var startButton = document.createElement("button");

// Declaring global variables
var timer = 75;
var index = 0;

// Function that loads content when page first loads
function openingPage()
{
    // Adding a description of the game
    mainDisplay.textContent = "Try to answer the following code-related questions. You will have four choices, if you are incorrect you will be penalized 10 seconds from your timer. Whatever time you finish the quiz with will be your score."
    // Adding text to the button
    startButton.textContent = "Start"
    // Adding both to screen
    displayQuestionEl.append(mainDisplay, startButton);
}

function startQuiz()
{
    // Displaying timer to screen
    showTimer();
    nextQuestion();

}

function showTimer()
{
    timerEl.textContent = timer;
    var questionTimer = setInterval(function()
    {
        // Decreasing timer by 1 second
        timer--;
        //Displaying new time left
        timerEl.textContent = timer;
        
        if (timer <= 0)
        {
            clearInterval(questionTimer);
        }
    }, 1000);
}

function nextQuestion()
{
    var currentQuestion = questions[index];
    console.log(currentQuestion);

    // Emptying question container element
    displayQuestionEl.textContent = "";
    // Add current question title to page
    mainDisplay.textContent = currentQuestion.title;
    // Append it to the display variable so it actually shows
    displayQuestionEl.append(mainDisplay);
    // create a div element to wrap the "choices"
    var choicesContainer = document.createElement("div");
    // use a loop to:
    for (let i = 0; i < currentQuestion.choices.length; i++)
    {
        var choiceButton = document.createElement("button");
        choiceButton.textContent = currentQuestion.choices[i];
        choiceButton.addEventListener("click", checkAnswer);
        choicesContainer.append(choiceButton);
    }

    displayQuestionEl.append(choicesContainer);
}

function checkAnswer(event)
{
    // Logic for answer
    var responseText = event.target.textContent;
    if (responseText === questions[index].answer)
    {
        console.log("correct");
    }
    else
    {
        console.log("incorrect");
    }

    index++;
    // Show next question
    nextQuestion();

}

startButton.addEventListener("click", startQuiz);

openingPage();