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
    
    def test_01_get_questions(self):
        res = self.client().get('/questions')
        body = json.loads(res.data)
        
        question_number = None
        with self.app.app_context():
            question_number = self.db.session.query(Question).count()

        self.assertEqual(body['success'], True)
        self.assertEqual(body['total_questions'], question_number)
        self.assertLessEqual(len(body['questions']), 10)


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()