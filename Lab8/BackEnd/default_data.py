from models import db, User, Class, Enrollment

# Helper function to create demo data
def load_default_data():
    """Create demo data for testing"""
    # Check if data already exists
    if User.query.count() > 0:
        return "Demo data already exists"
    
    try:
        admin_user = User(
            username="admin",
            first_name="Admin",
            last_name="User",
            user_type="admin"
        )
        admin_user.set_password("admin")
        db.session.add(admin_user)

        # Create teachers
        teacher1 = User(
            username="teacher1",
            first_name="John",
            last_name="Smith",
            user_type="teacher",
        )
        teacher1.set_password("password123")
        
        teacher2 = User(
            username="teacher2",
            first_name="Jane",
            last_name="Doe",
            user_type="teacher",
        )
        teacher2.set_password("password123")
        
        db.session.add(teacher1)
        db.session.add(teacher2)
        db.session.commit()
        
        # Create students
        student1 = User(
            username="proy",
            first_name="Parthib",
            last_name="Parthib",
            user_type="student",
        )
        student1.set_password("proy")
        
        student2 = User(
            username="student2",
            first_name="Bob",
            last_name="Brown",
            user_type="student",
        )
        student2.set_password("password123")
        
        student3 = User(
            username="student3",
            first_name="Charlie",
            last_name="Davis",
            user_type="student"
        )
        student3.set_password("password123")
        
        db.session.add(student1)
        db.session.add(student2)
        db.session.add(student3)
        db.session.commit()
        
        # Create classes
        math101 = Class(
            class_code="MATH101",
            class_name="Introduction to Algebra",
            description="Basic algebraic concepts for beginners",
            capacity=3,
            teacher_id=teacher1.id,
            course_time="Mon & Wed 8:00 AM - 9:30 AM",
        )
        
        math201 = Class(
            class_code="MATH201",
            class_name="Advanced Calculus",
            description="Calculus for science and engineering students",
            capacity=25,
            teacher_id=teacher1.id,
            course_time="Mon & Wed 10:00 AM - 11:30 AM",
        )
        
        sci101 = Class(
            class_code="SCI101",
            class_name="Introduction to Biology",
            description="Basic principles of biology and life sciences",
            capacity=3,
            teacher_id=teacher2.id,
            course_time="Tue & Thu 9:00 AM - 10:30 AM",
        )
        
        sci201 = Class(
            class_code="SCI201",
            class_name="Chemistry Fundamentals",
            description="Basic chemistry concepts and lab work",
            capacity=20,
            teacher_id=teacher2.id,
            course_time="Fri 1:00 PM - 4:00 PM",
        )
        
        db.session.add(math101)
        db.session.add(math201)
        db.session.add(sci101)
        db.session.add(sci201)
        db.session.commit()
        
        # Create enrollments
        enrollments = [
            Enrollment(student_id=student1.id, class_id=math101.id, grade=85.5),
            Enrollment(student_id=student1.id, class_id=sci101.id, grade=92.0),
            Enrollment(student_id=student2.id, class_id=math101.id, grade=78.5),
            Enrollment(student_id=student2.id, class_id=sci201.id),
            Enrollment(student_id=student3.id, class_id=math201.id),
            Enrollment(student_id=student3.id, class_id=sci101.id)
        ]
        
        for enrollment in enrollments:
            db.session.add(enrollment)
            
        db.session.commit()
        return "Demo data created successfully"
    
    except Exception as e:
        db.session.rollback()
        return f"Error creating demo data: {str(e)}"