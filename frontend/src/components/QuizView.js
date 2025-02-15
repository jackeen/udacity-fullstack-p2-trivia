import React, { Component } from 'react';
import $ from 'jquery';
import '../stylesheets/QuizView.css';

const questionsPerPlay = 5;

class QuizView extends Component {
  constructor(props) {
    super();
    this.state = {
      quizCategory: null,
      previousQuestions: [],
      showAnswer: false,
      categories: {},
      numCorrect: 0,
      currentQuestion: {},
      guess: '',
      forceEnd: false,
    };
  }

  componentDidMount() {
    $.ajax({
      url: `/categories`, //TODO: update request URL
      type: 'GET',
      success: (result) => {
        this.setState({ categories: result.categories });
        return;
      },
      error: (error) => {
        alert('Unable to load categories. Please try your request again');
        return;
      },
    });
  }

  selectCategory = ({ type, id }) => {
    this.setState({ quizCategory: { type, id } }, this.getNextQuestion);
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  getNextQuestion = () => {
    const previousQuestions = [...this.state.previousQuestions];
    if (this.state.currentQuestion.id) {
      previousQuestions.push(this.state.currentQuestion.id);
    }

    $.ajax({
      url: '/quizzes', //TODO: update request URL
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        previous_questions: previousQuestions,
        quiz_category: parseInt(this.state.quizCategory.id),
      }),
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      success: (result) => {
        this.setState({
          showAnswer: false,
          previousQuestions: previousQuestions,
          currentQuestion: result.question,
          guess: '',
          forceEnd: result.question ? false : true,
        });
        return;
      },
      error: (error) => {
        alert('Unable to load question. Please try your request again');
        return;
      },
    });
  };

  submitGuess = (event) => {
    event.preventDefault();
    let evaluate = this.evaluateAnswer();
    this.setState({
      numCorrect: !evaluate ? this.state.numCorrect : this.state.numCorrect + 1,
      showAnswer: true,
    });
  };

  restartGame = () => {
    this.setState({
      quizCategory: null,
      previousQuestions: [],
      showAnswer: false,
      numCorrect: 0,
      currentQuestion: {},
      guess: '',
      forceEnd: false,
    });
  };

  renderPrePlay() {
    return (
      <div className='quiz-holder'>
        <h2 className='choose-header'>Choose Category</h2>
        <div className='category-holder'>
          <div 
            value='0' 
            className='play-category' 
            onClick={() => 
              this.selectCategory({type: 'All', 'id': '0'})
            }>
            All
          </div>
          {Object.keys(this.state.categories).map((id) => {
            return (
              <div
                key={id}
                value={id}
                className='play-category'
                onClick={() =>
                  this.selectCategory({ type: this.state.categories[id], id })
                }
              >
                <p className='img-box'>
                  <img 
                    alt={`${this.state.categories[id].toLowerCase()}`}
                    src={`${this.state.categories[id].toLowerCase()}.svg`} 
                  />
                </p>
                <p>{this.state.categories[id]}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  renderFinalScore() {
    return (
      <div className='quiz-holder'>
        <div className='quiz-play-holder'>
          <div className='final-header'>
            Your final score is: <b>{this.state.numCorrect}</b>
          </div>
          <button onClick={this.restartGame}>
            Play Again?
          </button>
        </div>
      </div>
    );
  }

  evaluateAnswer = () => {
    const formatGuess = this.state.guess
      // eslint-disable-next-line
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .toLowerCase();
    const answerArray = this.state.currentQuestion.answer
      .toLowerCase()
      .split(' ');
    return answerArray.every((el) => formatGuess.includes(el));
  };

  renderCorrectAnswer() {
    let evaluate = this.evaluateAnswer();
    return (
      <div className='quiz-holder'>
        <div className='quiz-play-holder'>
          <div className='quiz-question'>
            {this.state.currentQuestion.question}
          </div>
          <div className='quiz-result'>
            <div className={`${evaluate ? 'correct' : 'wrong'}`}>
              {evaluate ? 'You were correct!' : 'You were incorrect'}
            </div>
            <div className='quiz-answer'>
              <span>Answer: </span>
              <b>{this.state.currentQuestion.answer}</b>
            </div>
            <button onClick={this.getNextQuestion}>
              Next Question
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderPlay() {
    return this.state.previousQuestions.length === questionsPerPlay ||
      this.state.forceEnd ? (
      this.renderFinalScore()
    ) : this.state.showAnswer ? (
      this.renderCorrectAnswer()
    ) : (
      <div className='quiz-holder'>
        <div className='quiz-play-holder'>
          <div className='quiz-question'>
            {this.state.currentQuestion.question}
          </div>
          <form className='answer-form' onSubmit={this.submitGuess}>
            <input 
              type='text' name='guess' autoComplete='off' 
              onChange={this.handleChange} 
            />
            <button type='submit'>Submit Answer</button>
          </form>
        </div>
      </div>
    );
  }

  render() {
    return this.state.quizCategory ? this.renderPlay() : this.renderPrePlay();
  }
}

export default QuizView;
