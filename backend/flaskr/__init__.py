import os
from flask import Flask, after_this_request, request, abort, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import random

from models import setup_db, db, Question, Category

QUESTIONS_PER_PAGE = 10

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__)
    if test_config is None:
        setup_db(app)
    else:
        setup_db(app, database_path=test_config['database_path'])

    """
    @TODO: Set up CORS. Allow '*' for origins. Delete the sample route after completing the TODOs
    """
    CORS(app, origins=['*'])


    """
    @TODO: Use the after_request decorator to set Access-Control-Allow
    """
    @app.after_request
    def after_request(res):
        res.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,true')
        res.headers.add('Access-Control-Allow-Methods', 'GET,PATCH,POST,DELETE,OPTIONS')
        return res


    """
    @TODO:
    Create an endpoint to handle GET requests
    for all available categories.
    """
    @app.route('/categories')
    def get_categories():
        cates = db.session.query(Category).all()
        cate_dict = {}
        for c in cates:
            cate_dict[c.id] = c.type

        return jsonify(categories = cate_dict)


    """
    @TODO:
    Create an endpoint to handle GET requests for questions,
    including pagination (every 10 questions).
    This endpoint should return a list of questions,
    number of total questions, current category, categories.

    TEST: At this point, when you start the application
    you should see questions and categories generated,
    ten questions per page and pagination at the bottom of the screen for three pages.
    Clicking on the page numbers should update the questions.
    """
    @app.route('/questions')
    def get_questions():
        page = request.args.get('page', 1, type=int)
        offset = (page - 1) * QUESTIONS_PER_PAGE
        
        total_number = db.session.query(Question).count()
        questions = db.session.query(Question).\
                        order_by('id').\
                        offset(offset).limit(QUESTIONS_PER_PAGE).\
                        all()

        return jsonify({
            'success': True,
            'total_questions': total_number,
            'questions': [q.format() for q in questions],
        })


    """
    @TODO:
    Create an endpoint to DELETE question using a question ID.

    TEST: When you click the trash icon next to a question, the question will be removed.
    This removal will persist in the database and when you refresh the page.
    """
    @app.route('/questions/<int:question_id>', methods = ['DELETE'])
    def delete_question(question_id):
        question = db.session.query(Question).get(question_id)
        if question is None:
            abort(404)
        
        try:
            question.delete()
            db.session.commit()
        except:
            db.session.rollback()
            abort(500)
        finally:
            db.session.close()

        return jsonify({
            'success': True
        })


    """
    @TODO:
    Create an endpoint to POST a new question,
    which will require the question and answer text,
    category, and difficulty score.

    TEST: When you submit a question on the "Add" tab,
    the form will clear and the question will appear at the end of the last page
    of the questions list in the "List" tab.
    """
    @app.route('/questions', methods = ['POST'])
    def create_new_question():
        body = request.get_json()
        if body is None:
            abort(422)

        question = body.get('question')
        answer = body.get('answer')
        category = body.get('category')
        difficulty = body.get('difficulty')

        if not ((isinstance(question, str) and question != '') and\
            (isinstance(answer, str) and answer != '') and\
            (isinstance(category, int) and category > 0) and\
            (isinstance(difficulty, int) and difficulty > 0)):
            abort(422)

        try:
            db.session.add(Question(
                question = question,
                answer = answer,
                category = category,
                difficulty = difficulty,
            ))
            db.session.commit()
        except:
            db.session.rollback()
            abort(500)
        finally:
            db.session.close()

        return jsonify({
            'success': True,
        })


    """
    @TODO:
    Create a POST endpoint to get questions based on a search term.
    It should return any questions for whom the search term
    is a substring of the question.

    TEST: Search by any phrase. The questions list will update to include
    only question that include that string within their question.
    Try using the word "title" to start.
    """
    @app.route('/filter/questions', methods = ['POST'])
    def searching_for_questions():
        body = request.get_json()
        if body is None:
            abort(422)
        
        keyword = body.get('keyword')
        page = request.args.get('page', 1, type=int)
        offset = (page - 1) * QUESTIONS_PER_PAGE
        
        query = db.session.query(Question).\
                    filter(Question.question.like(f'%{keyword}%'))
        
        total = query.count()
        result = query.order_by('id').\
                    offset(offset).limit(QUESTIONS_PER_PAGE).\
                    all()

        return jsonify({
            'success': True,
            'total_questions': total,
            'questions': [q.format() for q in result]
        })


    """
    @TODO:
    Create a GET endpoint to get questions based on category.

    TEST: In the "List" tab / main screen, clicking on one of the
    categories in the left column will cause only questions of that
    category to be shown.
    """
    @app.route('/categories/<int:category_id>/questions')
    def get_questions_by_category(category_id):
        page = request.args.get('page', 1, type=int)
        offset = (page - 1) * QUESTIONS_PER_PAGE
        
        query = db.session.query(Question).\
                    filter(Question.category == category_id)
        
        total = query.count()
        result = query.order_by('id').\
                    offset(offset).limit(QUESTIONS_PER_PAGE).\
                    all()
        
        return jsonify({
            'success': True,
            'total_questions': total,
            'questions': [q.format() for q in result],
        })


    """
    @TODO:
    Create a POST endpoint to get questions to play the quiz.
    This endpoint should take category and previous question parameters
    and return a random questions within the given category,
    if provided, and that is not one of the previous questions.

    TEST: In the "Play" tab, after a user selects "All" or a category,
    one question at a time is displayed, the user is allowed to answer
    and shown whether they were correct or not.
    """
    @app.route('/quizzes', methods = ['POST'])
    def get_quizzes():
        body = request.get_json()
        if body is None:
            abort(422)
        
        check_list = body.get('previous_questions')
        cate_id = body.get('quiz_category')

        if check_list is None or cate_id is None:
            abort(422)
        
        query = db.session.query(Question)
        result = None
        if cate_id > 0:
            result = query.filter(Category.id == cate_id).all()
        else:
            result = query.all()
        
        candidates = []
        next_question = None
        for q in result:
            if q.id not in check_list:
                candidates.append(q.format())

        candidates_num = len(candidates)
        if candidates_num > 0:
            random_index = random.randint(0, candidates_num - 1)
            next_question = candidates[random_index]

        return jsonify(success = True, question = next_question)


    """
    @TODO:
    Create error handlers for all expected errors
    including 404 and 422.
    """
    @app.errorhandler(404)
    def not_found(err):
        return jsonify({
            'success': False,
            'error': 404,
            'message': 'Not found',
        }), 404

    @app.errorhandler(422)
    def unprocessable_entity(err):
        return jsonify({
            'success': False,
            'error': 422,
            'message': 'Unprocessable entity',
        }), 422

    @app.errorhandler(405)
    def method_not_allowed(err):
        return jsonify({
            'success': False,
            'error': 405,
            'message': 'Method not allowed',
        }), 405

    @app.errorhandler(500)
    def method_not_allowed(err):
        return jsonify({
            'success': False,
            'error': 500,
            'message': 'Please try again later',
        }), 500

    return app

