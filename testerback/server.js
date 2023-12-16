const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "testerdb"
})


app.get('/get/student', (req, res) => {
    const sqlSelect = "SELECT * FROM student";
    db.query(sqlSelect, (err, result) => {
        if (err) return res.send(err);
        res.send(result);
    });
});

app.get('/get/admin', (req, res) => {
    const sqlSelect = "SELECT * FROM admin";
    db.query(sqlSelect, (err, result) => {
        if (err) return res.send(err);
        res.send(result);
    });
});

app.get('/get/admin/:id', (req, res) => {
    const login = req.params.id;
    const sqlSelect = "SELECT * FROM admin WHERE login = ?";
    db.query(sqlSelect, login, (err, result) => {
        if (err) return res.send(err);
        res.send(result);
    });
})

app.get('/get/subject', (req, res) => {
    const sqlSelect = "SELECT * FROM subject";
    db.query(sqlSelect, (err, result) => {
        if (err) return res.send(err);
        res.send(result);
    });
});

app.get('/get/subject/:id', (req, res) => {
    const id = req.params.id;
    const sqlSelect = "SELECT * FROM subject WHERE id = ?";
    db.query(sqlSelect, id, (err, result) => {
        if (err) return res.send(err);
        res.send(result);
    });
});

// get '/get/test'
app.get('/get/test', (req, res) => {
    const sqlSelect = "SELECT * FROM test";
    db.query(sqlSelect, (err, result) => {
        if (err) return res.send(err);
        res.send(result);
    });
});

app.get('/get/test/:id', (req, res) => {
    const id = req.params.id;
    const sqlSelect = "SELECT * FROM test WHERE id = ?";
    db.query(sqlSelect, id, (err, result) => {
        if (err) return res.send(err);
        res.send(result);
    });
});

app.get('/get/question/:id', (req, res) => {
    const id = req.params.id;
    const sqlSelect = "SELECT * FROM question WHERE id = ?";
    db.query(sqlSelect, id, (err, result) => {
        if (err) return res.send(err);
        res.send(result);
    });
});

app.get('/get/test/:id/questions', (req, res) => {
    const id = req.params.id;
    const sqlSelect = "SELECT q.id, q.title, q.total_mark, q.comment, q.answertype FROM question q INNER JOIN test_question tq ON q.id = tq.question_id " +
        "WHERE tq.test_id = ?";
    db.query(sqlSelect, id, (err, result) => {
        if (err) return res.send(err);
        res.send(result);
    });
});


app.get('/get/question/:id/answers/', (req, res) => {
    const id = req.params.id;
    const sqlSelect = "SELECT * FROM answer WHERE question_id = ?";
    db.query(sqlSelect, id, (err, result) => {
        if (err) return res.send(err);
        res.send(result);
    });
});

app.get('/get/attempt/', (req, res) => {
    const sqlSelect = "SELECT a.id, a.student_id, t.title, a.start_date, a.end_date, t.id as test_id FROM attemp as a " +
        "inner join test as t on a.test_id = t.id";
    db.query(sqlSelect, (err, result) => {
        if (err) return res.send(err);
        res.send(result);
    });
});

app.get('/get/attempt/:id', (req, res) => {
    const id = req.params.id;
    const sqlSelect = "SELECT * FROM attemp WHERE id = ?";
    db.query(sqlSelect, id, (err, result) => {
        if (err) return res.send(err);
        res.send(result);
    });
});

app.get('/get/attempt/:id/results', (req, res) => {
    const id = req.params.id;
    const sqlSelect = "SELECT * FROM result AS r " +
        "inner join answer AS a on r.choosen_answer_id = a.id " +
        "inner join question AS q on r.question_id = q.id " +
        "WHERE r.attemp_id = ?";
    db.query(sqlSelect, id, (err, result) => {
        if (err) return res.send(err);
        res.send(result);
    });
});

app.post('/post/attempt', (req, res) => {
    const { student_id, test_id } = req.body;
    console.log(student_id, test_id);

    const queryString = 'INSERT INTO attemp (student_id, test_id) VALUES (?, ?)';
    const values = [student_id, test_id];

    db.query(queryString, values, (error, results, fields) => {
        if (error) {
            console.error('Error saving attempt data:', error);
            res.status(500).send('Error saving attempt data');
        } else {
            const attemptId = results.insertId;
            console.log('Attempt data saved successfully with ID:', attemptId);
            res.status(200).send({ attemptId }); // Send the attempt ID in the response
        }
    });
});

app.put('/put/attempt/:id/finish', (req, res) => {
    const attemptId = req.params.id;

    const queryString = 'UPDATE attemp SET end_date = CURRENT_TIMESTAMP WHERE id = ?';
    const values = [attemptId];

    db.query(queryString, values, (error, results, fields) => {
        if (error) {
            console.error('Error finishing attempt:', error);
            res.status(500).send('Error finishing attempt');
        } else {
            console.log('Attempt finished successfully');
            res.status(200).send('Attempt finished');
        }
    });
});

app.post('/post/result', (req, res) => {
    const { attempt_id, question_id, choosen_answer_id, is_comment } = req.body;

    const queryString = 'INSERT INTO result (attemp_id, question_id, choosen_answer_id) VALUES (?, ?, ?)';
    const values = [attempt_id, question_id, choosen_answer_id, is_comment];

    db.query(queryString, values, (error, results, fields) => {
        if (error) {
            console.error('Error saving result data:', error);
            res.status(500).send('Error saving result data');
        } else {
            const resultId = results.insertId;
            console.log('Result data saved successfully with ID:', resultId);
            res.status(200).send({ resultId }); // Send the result ID in the response
        }
    });
});


// post

app.post('/post/test', (req, res) => {
    const { title, difficult, time, allow_comments, admin_id, allow_result, subject_id } = req.body;

    const queryString = 'INSERT INTO test (title, difficult, time, allow_comments, admin_id, allow_result, subject_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [title, difficult, time, allow_comments, admin_id, allow_result, subject_id];

    db.query(queryString, values, (error, results, fields) => {
        if (error) {
            console.error('Error saving test data:', error);
            res.status(500).send('Error saving test data');
        } else {
            const testId = results.insertId;
            console.log('Test data saved successfully with ID:', testId);
            res.status(200).send({ testId }); // Send the test ID in the response
        }
    });
});

app.post('/post/question', (req, res) => {
    const { title, total_mark, comment, answertype, test_id } = req.body;

    const queryString = 'INSERT INTO question (title, total_mark, comment, answertype) VALUES (?, ?, ?, ?)';
    const values = [title, total_mark, comment, answertype];

    db.query(queryString, values, (error, results, fields) => {
        if (error) {
            console.error('Error saving question data:', error);
            res.status(500).send('Error saving question data');
        } else {
            const questionId = results.insertId;
            console.log('Question data saved successfully with ID:', questionId);

            const testQuestionQueryString = 'INSERT INTO test_question (test_id, question_id) VALUES (?, ?)';
            const testQuestionValues = [test_id, questionId];

            db.query(testQuestionQueryString, testQuestionValues, (error, results, fields) => {
                if (error) {
                    console.error('Error saving test-question data:', error);
                    res.status(500).send('Error saving test-question data');
                } else {
                    console.log('Test-question data saved successfully');
                    res.status(200).send({ questionId }); // Send the question ID in the response
                }
            });
        }
    });
});

app.post('/post/answer', (req, res) => {
    const { title, answer_mark, question_id } = req.body;

    const queryString = 'INSERT INTO answer (title, answer_mark, question_id) VALUES (?, ?, ?)';
    const values = [title, answer_mark, question_id];

    db.query(queryString, values, (error, results, fields) => {
        if (error) {
            console.error('Error saving answer data:', error);
            res.status(500).send('Error saving answer data');
        } else {
            const answerId = results.insertId;
            console.log('Answer data saved successfully with ID:', answerId);
            res.status(200).send({ answerId }); // Send the answer ID in the response
        }
    });
});

app.listen(8081, () => {
    console.log("Server is running on port 8081");

});