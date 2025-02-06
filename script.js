// Function to check the selected radio button and change the color of the "Svara" button
function checkAnswer(question) {
  const answers = question.querySelectorAll('.answer input[type="radio"]');
  const svaraButton = question.querySelector('.svara-button');
  
  let answerCorrect = false;

  // Loop through each answer option
  answers.forEach(answer => {
    if (answer.checked) {
      // Check if the value is true (correct answer)
      if (answer.value === 'true') {
        answerCorrect = true;
      }
    }
  });

  // Change the button color based on the selected answer
  if (answerCorrect) {
    svaraButton.style.backgroundColor = 'green'; // Correct answer
  } else {
    svaraButton.style.backgroundColor = 'red'; // Incorrect answer
  }
}

// Initialize event listeners for each question to check answers on button click
document.addEventListener('DOMContentLoaded', function() {
  const questions = document.querySelectorAll('.question');

  // Loop through all the questions
  questions.forEach(question => {
    const svaraButton = question.querySelector('.svara-button');
    
    // Add click event to "Svara" button of each question
    svaraButton.addEventListener('click', function() {
      checkAnswer(question);  // Check the answer for the specific question
    });
  });
});
