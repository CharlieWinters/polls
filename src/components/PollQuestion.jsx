import React from 'react';
import './PollQuestion.css'; // Assume you have a CSS file for styles

const PollQuestion = ({question, setVote}) => {
  const [message, setMessage] = React.useState(''); // Add this line to initialize state for the message
  const [isAnswered, setIsAnswered] = React.useState(false); // Add this line to initialize state for isAnswered
  const [selectedAnswer, setSelectedAnswer] = React.useState(null);

  const maxScore = 100; // maximum score

  // Assume startTime is the time when the question was shown
  let startTime = Date.now();

  const handleAnswerClick = (answer,index) => {
    if (!isAnswered) {
      setIsAnswered(true);
      setSelectedAnswer(answer); // Set the selected answer
      setVote(question.id, index); // Call the setVote function to update the vote
    }
  };

  const formatTime = (time) => {
    // Formats time as minutes:seconds
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  //console.log('isanswered and selectedanswer',isAnswered, selectedAnswer)

  return (
    <div className="quiz-container">
      <div className="question-box">
        <h2>{question.question}</h2>
      </div>
      <div className="options-container">
      {question.answers.map((answer, index) => {
        return (
          <div 
            key={index} 
            style={{ backgroundColor: isAnswered && answer.text === selectedAnswer.text ? 'blue' : 'initial' }} 
            className='option'
            onClick={() => handleAnswerClick(answer, index)}
          >
            {answer.text}
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default PollQuestion;
