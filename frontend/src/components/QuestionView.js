import React, { Component } from 'react';
import '../stylesheets/App.css';
import Question from './Question';
import Search from './Search';
import $ from 'jquery';

class QuestionView extends Component {
  constructor() {
    super();
    this.state = {
      questions: [],
      page: 1,
      totalQuestions: 0,
      categories: {},
      currentCategory: null,
      currentDataSource: '',
      currentSearchTerm: '',
    };
  }

  componentDidMount() {
    this.getCategories();
    this.getQuestions();
  }

  getCategories = () => {
    $.ajax({
      url: `/categories`,
      type: 'GET',
      success: (result) => {
        this.setState({
          categories: result.categories,
        });
        return;
      },
      error: (error) => {
        alert('Unable to load categories. Please try your request again');
        return;
      },
    });
  };

  getQuestions = () => {
    $.ajax({
      url: `/questions?page=${this.state.page}`, //TODO: update request URL
      type: 'GET',
      success: (result) => {
        this.setState({
          currentDataSource: 'all',
          questions: result.questions,
          totalQuestions: result.total_questions,
          currentCategory: '0',
        });
        return;
      },
      error: (error) => {
        alert('Unable to load questions. Please try your request again');
        return;
      },
    });
  };

  selectPage(num) {
    this.setState({ page: num }, () => {

      switch (this.state.currentDataSource) {
        case 'cate':
          this.getByCategory(this.state.currentCategory);
          break;
        case 'search':
          this.launchSearch(this.state.currentSearchTerm, true);
          break;
        default:
          // currentDataSource : all
          this.getQuestions();
      }
      
    });
  }

  createPagination() {
    let pageNumbers = [];
    let maxPage = Math.ceil(this.state.totalQuestions / 10);
    for (let i = 1; i <= maxPage; i++) {
      pageNumbers.push(
        <span
          key={i}
          className={`page-num ${i === this.state.page ? 'active' : ''}`}
          onClick={() => {
            this.selectPage(i);
          }}
        >
          {i}
        </span>
      );
    }
    return pageNumbers;
  }

  getByCategory = (id) => {
    $.ajax({
      url: `/categories/${id}/questions?page=${this.state.page}`, //TODO: update request URL
      type: 'GET',
      success: (result) => {
        this.setState({
          currentDataSource: 'cate',
          questions: result.questions,
          totalQuestions: result.total_questions,
          currentCategory: id, //result.current_category,
        });
        return;
      },
      error: (error) => {
        alert('Unable to load questions. Please try your request again');
        return;
      },
    });
  };

  launchSearch = (searchTerm, isFormPage = false) => {
    if (isFormPage) {
      this.submitSearch(searchTerm);
      return;
    }

    this.setState({ page: 1}, () => {
      this.submitSearch(searchTerm);
    })
  };

  submitSearch = (searchTerm) => {
    $.ajax({
      url: `/filter/questions?page=${this.state.page}`, //TODO: update request URL
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({ keyword: searchTerm }),
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      success: (result) => {
        this.setState({
          currentSearchTerm: searchTerm,
          currentDataSource: 'search',
          questions: result.questions,
          totalQuestions: result.total_questions,
          currentCategory: '0',
        });
        return;
      },
      error: (error) => {
        alert('Unable to load questions. Please try your request again');
        return;
      },
    });
  };

  questionAction = (id) => (action) => {
    if (action === 'DELETE') {
      if (window.confirm('are you sure you want to delete the question?')) {
        $.ajax({
          url: `/questions/${id}`, //TODO: update request URL
          type: 'DELETE',
          success: (result) => {
            this.getQuestions();
          },
          error: (error) => {
            alert('Unable to load questions. Please try your request again');
            return;
          },
        });
      }
    }
  };

  render() {
    return (
      <div className='question-view'>
        <div className='categories-list'>
          <h2>
            Categories
          </h2>
          <ul>
              <li
                onClick={() => {
                  this.setState({ page: 1}, () => {
                    this.getQuestions();
                  });
                }}
                className={this.state.currentCategory === '0' ? 'selected' : ''}
              >
                All
              </li>
            {Object.keys(this.state.categories).map((id) => (
              <li
                key={id}
                onClick={() => {
                  this.setState({ page: 1}, () => {
                    this.getByCategory(id);
                  });
                }}
                className={this.state.currentCategory === id ? 'selected' : ''}
              >
                <img
                  className='category'
                  alt={`${this.state.categories[id].toLowerCase()}`}
                  src={`${this.state.categories[id].toLowerCase()}.svg`}
                />
                <p>{this.state.categories[id]}</p>
              </li>
            ))}
          </ul>
          <Search submitSearch={this.launchSearch} />
        </div>
        <div className='questions-list'>
          <h2>Questions</h2>
          {this.state.questions.length === 0 && 
            <div className='no-questions'>There are no questions can be showed for this operation.</div>
          }
          {this.state.questions.map((q, ind) => (
            <Question
              key={q.id}
              question={q.question}
              answer={q.answer}
              category={this.state.categories[q.category]}
              difficulty={q.difficulty}
              questionAction={this.questionAction(q.id)}
            />
          ))}
          <div className='pagination-menu'>{this.createPagination()}</div>
        </div>
      </div>
    );
  }
}

export default QuestionView;
