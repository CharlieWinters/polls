import * as React from 'react';
import {createRoot} from 'react-dom/client';
import PollQuestion from './components/PollQuestion';

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

  React.useEffect(() => {

    const init = async () => {
      await miro.board.events.on('CURRENT_QUESTION', (message) => {
        console.log('QUESTION_INFO', message);
        setCurrentQuestionInfo(message);
      });

      await miro.board.events.broadcast("CURRENT_QUESTION?", {});
    }

    init();
  }, []);

  const onVote = async(questionId, answerIndex) => {
    await miro.board.events.broadcast("VOTE", {questionId, answerIndex});
  };

  return (
    <div className="grid wrapper">
      <div className="cs1 ce12">
          {currentQuestionInfo && <PollQuestion key={currentQuestionInfo.id} question={currentQuestionInfo} setVote={onVote} /> }
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
