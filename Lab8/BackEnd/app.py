from flask import Flask, request, jsonify, session, render_template, redirect
from flask_cors import CORS
import os
from werkzeug.security import generate_password_hash

from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_admin.menu import MenuLink

from default_data import load_default_data
from models import db, User, Class, Enrollment

app = Flask(__name__)
CORS(app, supports_credentials=True)  # Enable CORS to allow requests from the React frontend

# Configure SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///student_grades.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# for the admin panel to allow editing and creating, the package WTForms must be 3.1.2
# (to see version of it) pip show WTForms
# use pip install WTForms==3.1.2
class AdminOnlyView(ModelView):
    def is_accessible(self):
        return session.get('user_type') == 'admin'

class EnrollmentAdmin(AdminOnlyView):
    form_columns = ['student_enrolled', 'class_enrolled', 'grade', 'enrollment_date']
    column_list = ['student_enrolled', 'class_enrolled', 'grade', 'enrollment_date']

    column_labels = {
        'student_enrolled': 'Student Name',
        'class_enrolled': 'Class Name',
        'grade': 'Grade',
        'enrollment_date': 'Enrollment Date'
    }

class UserAdmin(AdminOnlyView):
    form_columns = ['username', 'first_name', 'last_name', 'user_type', 'created_at', 'password_hash']
    column_list = ['username', 'first_name', 'last_name', 'user_type', 'created_at', 'password_hash']

    column_labels = {
        'username': 'Username',
        'first_name': 'First Name',
        'last_name': 'Last Name',
        'user_type': 'User Type',
        'created_at': 'Created At',
        'password_hash': 'Password Hash'
    }

    def on_model_change(self, form, model, is_created):
        if is_created and form.password_hash.data:
            model.password_hash = generate_password_hash(form.password_hash.data)

class ClassAdmin(AdminOnlyView):
    form_columns = ['class_code', 'class_name', 'description', 'capacity', 'teacher_name', 'course_time']
    column_list = ['class_code', 'class_name', 'description', 'capacity', 'teacher_name', 'course_time']

    column_labels = {
        'class_code': 'Class Code',
        'class_name': 'Class Name',
        'description': 'Class Description',
        'capacity': 'Capacity',
        'teacher_name': 'Teacher Name',
        'course_time': 'Class Time'
    }

app.secret_key = "super secret key" # Add this to avoid an error
admin = Admin(app, name='Admin Panel', template_mode="bootstrap3")
admin.add_view(UserAdmin(User, db.session))
admin.add_view(ClassAdmin(Class, db.session))
admin.add_view(EnrollmentAdmin(Enrollment, db.session))
admin.add_link(MenuLink(name='Sign Out', category='', url="/admin/logout"))

# Authentication Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['username', 'password', 'first_name', 'last_name', 'user_type']
    for field in required_fields:
        if field not in data:
            return jsonify({'success': False, 'message': f'Missing required field: {field}'}), 400
    
    # Check if username already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'success': False, 'message': 'Username already exists'}), 400
    
    # Create new user
    user = User(
        username=data['username'],
        first_name=data['first_name'],
        last_name=data['last_name'],
        user_type=data['user_type']
    )
        
    user.set_password(data['password'])
    
    try:
        db.session.add(user)
        db.session.commit()
        return jsonify({'success': True, 'message': 'User registered successfully', 'user_id': user.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if 'username' not in data or 'password' not in data:
        return jsonify({'success': False, 'message': 'Username and password required'}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'success': False, 'message': 'Invalid username or password'}), 401
    
    # Store user info in session
    session['user_id'] = user.id
    session['user_type'] = user.user_type
    
    return jsonify({
        'success': True,
        'message': 'Login successful',
        'user': user.to_dict()
    }), 200

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    session.pop('user_type', None)
    return jsonify({'success': True, 'message': 'Logged out successfully'}), 200

@app.route("/admin/logout", methods=['GET'])
def admin_logout():
    session.clear()
    return redirect("http://localhost:3000/login")

# session cookies saving user sign in for reload page
@app.route('/api/check-session', methods=['GET'])
def check_session():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False}), 401

    user = User.query.get(user_id)
    if not user:
        return jsonify({'success': False}), 404

    return jsonify({'success': True, 'user': user.to_dict()}), 200

# Class Routes
@app.route('/api/classes', methods=['GET'])
def get_all_classes():
    """Get all classes with enrollment counts"""
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Authentication required'}), 401
    
    classes = Class.query.all()
    return jsonify({
        'success': True,
        'classes': [cls.to_dict() for cls in classes]
    }), 200

@app.route('/api/classes/<int:class_id>', methods=['GET'])
def get_class_details(class_id):
    """Get details of a specific class"""
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Authentication required'}), 401
    
    cls = Class.query.get(class_id)
    if not cls:
        return jsonify({'success': False, 'message': 'Class not found'}), 404
    
    class_data = cls.to_dict()
    
    # If user is a teacher and teaches this class, include student details
    if session['user_type'] == 'teacher' and cls.teacher_id == session['user_id']:
        students = []
        for enrollment in cls.enrollments:
            student = User.query.get(enrollment.student_id)
            students.append({
                'id': student.id,
                'first_name': student.first_name,
                'last_name': student.last_name,
                'enrollment_id': enrollment.id,
                'grade': enrollment.grade
            })
        class_data['students'] = students
    
    return jsonify({
        'success': True,
        'class': class_data
    }), 200

@app.route('/api/classes', methods=['POST'])
def create_class():
    """Create a new class (teachers only)"""
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Authentication required'}), 401
    
    if session['user_type'] != 'teacher':
        return jsonify({'success': False, 'message': 'Only teachers can create classes'}), 403
    
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['class_code', 'class_name', 'capacity']
    for field in required_fields:
        if field not in data:
            return jsonify({'success': False, 'message': f'Missing required field: {field}'}), 400
    
    # Check if class code already exists
    if Class.query.filter_by(class_code=data['class_code']).first():
        return jsonify({'success': False, 'message': 'Class code already exists'}), 400
    
    # Create new class
    new_class = Class(
        class_code=data['class_code'],
        class_name=data['class_name'],
        description=data.get('description'),
        capacity=data['capacity'],
        teacher_id=session['user_id'],
        course_time=data.get('course_time'),
    )    
    try:
        db.session.add(new_class)
        db.session.commit()
        return jsonify({
            'success': True, 
            'message': 'Class created successfully',
            'class': new_class.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

# Teacher Routes
@app.route('/api/teacher/classes', methods=['GET'])
def get_teacher_classes():
    """Get classes taught by the logged-in teacher"""
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Authentication required'}), 401
    
    if session['user_type'] != 'teacher':
        return jsonify({'success': False, 'message': 'Access denied'}), 403
    
    classes = Class.query.filter_by(teacher_id=session['user_id']).all()
    return jsonify({
        'success': True,
        'classes': [cls.to_dict() for cls in classes]
    }), 200

@app.route('/api/teacher/grades/<int:enrollment_id>', methods=['PUT'])
def update_grade(enrollment_id):
    """Update a student's grade (teachers only)"""
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Authentication required'}), 401
    
    if session['user_type'] != 'teacher':
        return jsonify({'success': False, 'message': 'Only teachers can update grades'}), 403
    
    data = request.get_json()
    if 'grade' not in data:
        return jsonify({'success': False, 'message': 'Grade is required'}), 400
    
    enrollment = Enrollment.query.get(enrollment_id)
    if not enrollment:
        return jsonify({'success': False, 'message': 'Enrollment not found'}), 404
    
    # Verify teacher teaches this class
    if enrollment.course.teacher_id != session['user_id']:
        return jsonify({'success': False, 'message': 'Access denied'}), 403
    
    try:
        enrollment.grade = data['grade']
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Grade updated successfully',
            'enrollment': enrollment.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

# Student Routes
@app.route('/api/student/classes', methods=['GET'])
def get_student_classes():
    """Get classes enrolled by the logged-in student"""
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Authentication required'}), 401
    
    if session['user_type'] != 'student':
        return jsonify({'success': False, 'message': 'Access denied'}), 403
    
    enrollments = Enrollment.query.filter_by(student_id=session['user_id']).all()
    
    classes = []
    for enrollment in enrollments:
        class_data = enrollment.course.to_dict()
        class_data['grade'] = enrollment.grade
        classes.append(class_data)
    
    return jsonify({
        'success': True,
        'classes': classes
    }), 200

@app.route('/api/student/enroll', methods=['POST'])
def enroll_in_class():
    """Enroll a student in a class"""
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Authentication required'}), 401
    
    if session['user_type'] != 'student':
        return jsonify({'success': False, 'message': 'Only students can enroll in classes'}), 403
    
    data = request.get_json()
    if 'class_id' not in data:
        return jsonify({'success': False, 'message': 'Class ID is required'}), 400
    
    # Check if class exists
    cls = Class.query.get(data['class_id'])
    if not cls:
        return jsonify({'success': False, 'message': 'Class not found'}), 404
    
    # Check if already enrolled
    existing_enrollment = Enrollment.query.filter_by(
        student_id=session['user_id'],
        class_id=data['class_id']
    ).first()
    
    if existing_enrollment:
        return jsonify({'success': False, 'message': 'Already enrolled in this class'}), 400
    
    # Check if class is full
    if len(cls.enrollments) >= cls.capacity:
        return jsonify({'success': False, 'message': 'Class has reached maximum capacity'}), 400
    
    # Create enrollment
    enrollment = Enrollment(
        student_id=session['user_id'],
        class_id=data['class_id']
    )
    
    try:
        db.session.add(enrollment)
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Enrolled successfully',
            'enrollment': enrollment.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/student/unenroll', methods=['POST'])
def unenroll_from_class():
    data = request.get_json()
    class_id = data.get('class_id')

    enrollment = Enrollment.query.filter_by(
        student_id=session['user_id'],
        class_id=class_id
    ).first()

    db.session.delete(enrollment)
    db.session.commit()
    return jsonify({'success': True}), 200

# For direct execution
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print(load_default_data())
    app.run(debug=True)


    # Error Checks

    # if 'user_id' not in session:
    #     return jsonify({'success': False, 'message': 'Authentication required'}), 401
    #
    # if session['user_type'] != 'PROPER_USER':
    #     return jsonify({'success': False, 'message': 'Only PROPER_USER can enroll in classes'}), 403
    #
    # if 'class_id' not in data:
    #     return jsonify({'success': False, 'message': 'Class ID is required'}), 400
    #
    # Check if class exists
    # if not cls:
    #     return jsonify({'success': False, 'message': 'Class not found'}), 404
    #
    # Sesseion
    # except Exception as e:
    # db.session.rollback()
    # return jsonify({'success': False, 'message': str(e)}), 500