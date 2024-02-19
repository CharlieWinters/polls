import * as React from 'react';
import {createRoot} from 'react-dom/client';
import PollQuestion from './components/PollQuestion';
import SimpleBarChart from './components/SimpleBarChart';


import '../src/assets/style.css';

type AnswerType = {
  text: string;
  isCorrect: boolean;
  votes: number;
};

type QuestionType = {
  id: string;
  question: string;
  answers: AnswerType[];
};

const App: React.FC = () => {
  const [questions, setQuestions] = React.useState<QuestionType[]>([]);
  const questionsRef = React.useRef<QuestionType[]>([]);
  React.useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState<number>(0);
  const currentQuestionIndexRef = React.useRef<number>(0);
  React.useEffect(() => {
    currentQuestionIndexRef.current = currentQuestionIndex;
  }, [currentQuestionIndex]);

  const[currentQuestionInfo, setCurrentQuestionInfo] = React.useState<QuestionType>(questions[0]);
  const currentQuestionInfoRef = React.useRef<QuestionType>(questions[0]);
  React.useEffect(() => {
    currentQuestionInfoRef.current = currentQuestionInfo;
  }, [currentQuestionInfo]);

  const [host, setHost] = React.useState<boolean>(false);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const questionsParam = urlParams.get('questions');
    if (questionsParam) {
      const questionsArray: QuestionType[] = JSON.parse(decodeURIComponent(questionsParam));
      questionsArray.forEach(question => {
        question.answers.forEach(answer => {
          answer.votes = 0; // Initialize votes to 0 for each answer
        });
      });
      setQuestions(questionsArray);
      setCurrentQuestionInfo(questionsArray[0]);
    }

    const hostParam = urlParams.get('host');
    if (hostParam === 'true') {
      setHost(true);
      miro.board.events.on('RUNNING_POLL?', (message) => {
        miro.board.events.broadcast("RUNNING_POLL", currentQuestionInfoRef.current);
      });
      miro.board.events.on('CURRENT_QUESTION?', (message) => {
        miro.board.events.broadcast("CURRENT_QUESTION", currentQuestionInfoRef.current);
      });
      miro.board.events.on('VOTE', (message) => {
        const newQuestions = [...questionsRef.current];
        const question = newQuestions.find(question => question.id === message.questionId);
        const answer = question.answers[message.answerIndex];
        answer.votes++;
        setQuestions(newQuestions);
      });
    }
      
  }, []);

  React.useEffect(() => {
    miro.board.events.broadcast("CURRENT_QUESTION", currentQuestionInfoRef.current);
  }, [currentQuestionInfo]);

  const onNextQuestion = () => {
    const nextIndex = currentQuestionIndexRef.current + 1;
    if (nextIndex < questionsRef.current.length) {
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestionInfo(questionsRef.current[nextIndex]);
    }

  }

  const openForParticipants = () => {
    miro.board.events.broadcast("OPEN_MODAL", {});
  }

  return (
    <div className="grid wrapper">
      <div className="cs1 ce12">
          {currentQuestionInfo &&  <SimpleBarChart key={currentQuestionInfo.id} question={currentQuestionInfo} onNext={onNextQuestion} openForParticipants={openForParticipants}/>      }
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
