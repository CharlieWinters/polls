import React, { useState } from 'react';

const SetPollQuestion = ({deleteFn, saveFn, index, questionObj}) => {
    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState([{text: '', isCorrect: false}, {text: '', isCorrect: false}, {text: '', isCorrect: false}, {text: '', isCorrect: false}]);

    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
    };

    const handleAnswerChange = (e, index) => {
        const newAnswers = [...answers];
        newAnswers[index].text = e.target.value;
        setAnswers(newAnswers);
    };

    const handleToggleChange = (index) => {
        const newAnswers = [...answers];
        newAnswers[index].isCorrect = !newAnswers[index].isCorrect;
        setAnswers(newAnswers);
    };

    React.useEffect(() => {
        saveFn(questionObj.id, question, answers);
    }, [question, answers]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('submitting');
        // Add your submit logic here
    };

    return (
            <form onSubmit={handleSubmit} className="cs1 ce12" style={{ backgroundColor: '#F5F5F5' }}>
                <div class="form-group">
                    <label>
                        {`Question ${index+1}:`}
                    </label>
                    <input className='input' type="text" value={question} onChange={handleQuestionChange} />
                </div>
                <div class="form-group">
                    <label>
                        Answer 1:
                    </label>
                    <input className='input' type="text" value={answers[0].text} onChange={(e) => handleAnswerChange(e, 0)} />
                </div>
                <div class="form-group">
                    <label>
                        Answer 2:
                    </label>
                    <input className='input' type="text" value={answers[1].text} onChange={(e) => handleAnswerChange(e, 1)} />
                </div>
                <div class="form-group">
                    <label>
                        Answer 3:
                    </label>
                    <input className='input' type="text" value={answers[2].text} onChange={(e) => handleAnswerChange(e, 2)} />
                </div>
                <div class="form-group">
                    <label>
                        Answer 4:
                    </label>
                    <input className='input' type="text" value={answers[3].text} onChange={(e) => handleAnswerChange(e, 3)} />
                </div>
                <button onClick={(event) => { event.preventDefault(); deleteFn(questionObj.id); }} className="button button-danger">Delete</button>
            </form>
    );
};

export default SetPollQuestion;
