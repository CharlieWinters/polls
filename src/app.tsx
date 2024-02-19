import * as React from 'react';
import {createRoot} from 'react-dom/client';
import QuestionAnswerItem from './components/SetPollQuestion';
import { v4 as uuidv4 } from 'uuid';


import '../src/assets/style.css';

type QuestionType = {
  id: string;
  question: string;
  answers: any[];
};

const App: React.FC = () => {
  const [questions, setQuestions] = React.useState<QuestionType[]>([]);
  const [host, setHost] = React.useState<boolean>(false);

  const [pollInfo, setPollInfo] = React.useState<any>(null);


  React.useEffect(() => {
    const checkStatus = async () => {
      miro.board.events.broadcast("RUNNING_POLL?", {});
    }
  
    checkStatus(); // Call immediately on component mount
  
    const intervalId = setInterval(checkStatus, 5000); // Call every 5 seconds
  
    // Clear interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  React.useEffect(() => {
    miro.board.events.on('RUNNING_POLL', (message) => {
      console.log('RUNNING_POLL', message);
      setPollInfo(message);
    });
  }, []);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: uuidv4(),
        question: '',
        answers: [],
      },
    ]);
  };

  const saveQuestion = (id, question, answers) => {
    const index = questions.findIndex((question) => question.id === id);
    let newQuestions = [...questions];
    newQuestions.splice(index, 1, { id, question, answers });
    setQuestions(newQuestions);
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((question) => question.id !== id));
  };

  const startPoll = async () => {
    const questionsString = JSON.stringify(questions);
    miro.board.ui.openModal({ url: `poll-host.html?questions=${encodeURIComponent(questionsString)}&host=${true}`, width: 800, height: 800});
  }

  const joinPoll = async () => {
    miro.board.ui.openModal({ url: `poll-participant.html`, width: 800, height: 800});
  }

  const alreadyRunningPoll = () => {
    return <div className="grid wrapper">
          <div className="cs1 ce12">
              <button className="button button-primary centered" onClick={joinPoll}>
                Join Poll
              </button>
          </div>
        </div>
  };

  const createPoll = () => {
    return <div className="grid wrapper">
      <div className="cs1 ce12">
        {questions.length == 0 && <h3>There are no currently running polls, Add a question to get started!</h3>}
        {questions.length > 0 && <h3>Fill in question details below and click start poll when ready.</h3>}
      </div>
      {questions.map((question, index) => (
      <div className="cs1 ce12" key={question.id}>
        <QuestionAnswerItem saveFn={saveQuestion} deleteFn={deleteQuestion} index={index} questionObj={question} />
      </div>
    ))}
    <div className="cs1 ce12 centered">
        <button className="button button-secondary" onClick={addQuestion}>
          Add Question
        </button>
        
      </div>
      <div className="cs1 ce12 centered">
      {questions.length > 0 && <button className="button button-primary" onClick={startPoll}>
          Start Poll
        </button>
        }
      </div>
    </div>
  };

  return (
    <div>
      {pollInfo ? alreadyRunningPoll() : createPoll()}
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
