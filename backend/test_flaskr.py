import os
import unittest
import json

from flask_sqlalchemy import SQLAlchemy

from flaskr import create_app
from models import Question, Category


class TriviaTestCase(unittest.TestCase):
    """This class represents the trivia test case"""

    def setUp(self):
        """Define test variables and initialize app."""
        self.database_name = "trivia_test"
        self.database_path = "postgresql://{}/{}".format('localhost:5432', self.database_name)
        self.app = create_app({
            'database_path': self.database_path
        })
        self.client = self.app.test_client

        # binds the app to the current context
        with self.app.app_context():
            self.db = SQLAlchemy()
            self.db.init_app(self.app)
            # create all tables
            self.db.create_all()
    
    def tearDown(self):
        """Executed after reach test"""
        pass

    """
    TODO
    Write at least one test for each test for successful operation and for expected errors.
    """
    
    def test_get_questions(self):
        res = self.client().get('/questions')
        body = json.loads(res.data)
        
        question_number = None
        with self.app.app_context():
            question_number = self.db.session.query(Question).count()

        self.assertEqual(body['success'], True)
        self.assertEqual(body['total_questions'], question_number)
        self.assertLessEqual(len(body['questions']), 10)


    def test_create_question_without_data(self):
        res = self.client().post('/questions')
        body = json.loads(res.data)

        self.assertEqual(body['success'], False)
        self.assertEqual(body['error'], 422)


    def test_create_question_with_data(self):
        res = self.client().post('/questions', json = {
            'question': 'create testing',
            'answer': 'create testing',
            'category': 1,
            'difficulty': 1,
        })
        body = json.loads(res.data)

        self.assertEqual(body['success'], True)


    def test_create_question_with_wrong_data(self):
        res = self.client().post('/questions', json = {
            'question': '',
            'answer': '',
            'category': 1,
            'difficulty': 1,
        })
        body = json.loads(res.data)

        self.assertEqual(body['success'], False)
        self.assertEqual(body['error'], 422)


    def test_get_questions_by_category(self):
        res = self.client().get('/categories/1/questions')
        body = json.loads(res.data)

        question_number = None
        with self.app.app_context():
            question_number = self.db.session.\
                                query(Question).\
                                filter(Question.category == 1).\
                                count()
        
        self.assertEqual(body['success'], True)
        self.assertEqual(body['total_questions'], question_number)
        self.assertLessEqual(len(body['questions']), 10)


    def test_delete_question(self):
        target_question = Question(
            question = 'testing',
            answer = 'testing',
            category = 1,
            difficulty = 1,
        )
        target_question.insert()
        
        res = self.client().delete(f'/questions/{target_question.id}')
        body = json.loads(res.data)
        self.assertEqual(body['success'], True)


    def test_search_questions(self):
        res = self.client().post('/filter/questions', json = {
            'keyword': 'What'
        })
        body = json.loads(res.data)
        
        question_number = None
        with self.app.app_context():
            question_number = self.db.session.query(Question).\
                                filter(Question.question.like('%What%')).\
                                count()

        self.assertEqual(body['success'], True)
        self.assertEqual(body['total_questions'], question_number)
        self.assertLessEqual(len(body['questions']), 10)


    def test_quiz_fetching(self):
        res = self.client().post('/quizzes', json = {
            'quiz_category': 0,
            'previous_questions': [],
        })
        body = json.loads(res.data)

        self.assertEqual(body['success'], True)
        self.assertIsNotNone(body['question'])
        


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()