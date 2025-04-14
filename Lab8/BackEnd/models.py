from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

# Models
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    user_type = db.Column(db.String(10), nullable=False)  # 'student' or 'teacher' or 'admin'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    classes_teaching = db.relationship('Class', backref='teacher', lazy=True)
    enrollments = db.relationship('Enrollment', backref='student', lazy=True, cascade='all, delete-orphan')

    def __str__(self):
        return (self.first_name +" "+  self.last_name)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        data = {
            'id': self.id,
            'username': self.username,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'user_type': self.user_type,
            'created_at': self.created_at.isoformat()
        }
        
        if self.user_type == 'student':
            data['graduation_year'] = None
        elif self.user_type == 'teacher':
            data['department'] = None
            
        return data

class Class(db.Model):
    __tablename__ = 'classes'
    
    id = db.Column(db.Integer, primary_key=True)
    class_code = db.Column(db.String(10), unique=True, nullable=False)
    class_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    capacity = db.Column(db.Integer, nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    course_time = db.Column(db.String(50), nullable=True)

    # Relationships
    enrollments = db.relationship('Enrollment', backref='course', lazy=True, cascade='all, delete-orphan')

    # teacher_name = db.relationship('User', viewonly=True)
    teacher_name = db.relationship('User', overlaps = "teacher,classes_teaching")

    def __str__(self):
        return self.class_name

    def to_dict(self):
        return {
            'id': self.id,
            'class_code': self.class_code,
            'class_name': self.class_name,
            'description': self.description,
            'capacity': self.capacity,
            'teacher_id': self.teacher_id,
            'teacher_name': f"{self.teacher.first_name} {self.teacher.last_name}",
            'enrolled_count': len(self.enrollments),
            'course_time': self.course_time,
        }

class Enrollment(db.Model):
    __tablename__ = 'enrollments'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=True)
    grade = db.Column(db.Float, nullable=True)
    enrollment_date = db.Column(db.DateTime, default=datetime.utcnow)

    # student_enrolled = db.relationship('User', viewonly=True)
    # class_enrolled = db.relationship('Class', viewonly=True)
    #to fix the enrollment creating in admin panel problem
    student_enrolled = db.relationship('User', overlaps="student,enrollments")
    class_enrolled = db.relationship('Class', overlaps="course,enrollments")

    __table_args__ = (db.UniqueConstraint('student_id', 'class_id', name='_student_class_uc'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'class_id': self.class_id,
            'grade': self.grade,
            'enrollment_date': self.enrollment_date.isoformat()
        }