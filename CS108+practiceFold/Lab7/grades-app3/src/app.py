from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///grades.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Grade(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    student = db.Column(db.String(100), nullable = False, unique = True)
    grade = db.Column(db.String(10), nullable = False)
    
    def toDict(self):
        return {
            'id': self.id,
            'student': self.student,
            'grade': self.grade
        }


with app.app_context():
    db.create_all()


@app.route('/grades/<string:student>', methods=['GET'])
def getStudentGrade(student):
    grade = Grade.query.filter_by(student = student).first()
    if grade:
        return jsonify(grade.toDict())
    return jsonify({'Error': 'Student N/A'}), 404


@app.route('/grades', methods=['GET'])
def getGrades():
    grades = Grade.query.all()
    return jsonify([g.toDict() for g in grades])


@app.route('/grades', methods=['POST'])
def addStudent():
    data = request.json
    
    if not data or 'student' not in data or 'grade' not in data:
        return jsonify({'Error': 'Invalid inputs entered'}), 400
    exists = Grade.query.filter_by(student = data['student']).first()
    
    if exists:
        return jsonify({'Error': 'Student already alive why clone'}), 409
    newGrade = Grade(student = data['student'], grade = data['grade'])
    
    db.session.add(newGrade)
    db.session.commit()
    return jsonify(newGrade.toDict()), 201


@app.route('/grades/<string:student>', methods=['PUT'])
def updateStudent(student):
    data = request.json
    grade = Grade.query.filter_by(student = student).first()
    
    if grade:
        grade.grade = data.get('grade', grade.grade)
        db.session.commit()
        return jsonify(grade.toDict())
    return jsonify({'Error': 'Student N/A'}), 404
            

@app.route('/grades/<string:student>', methods=['DELETE'])
def deleteStudent(student):
    grade = Grade.query.filter_by(student = student).first()
    if grade:
        db.session.delete(grade)
        db.session.commit()
        return jsonify({'Message': f'{student} deleted'})
    return jsonify({'Error': 'Student no exist'}), 404
    

@app.route('/grades', methods=['OPTIONS'])
@app.route('/grades/<string:student>', methods=['OPTIONS'])
def optionsResponse(student = None):
    return '', 204


if __name__ == '__main__':
    app.run(debug=True)

