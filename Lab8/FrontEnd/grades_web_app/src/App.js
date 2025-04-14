
import React, {useEffect, useState} from 'react';
import LoginPage from './webComponents/LoginPage';
import StudentDashboard from './studTeachCourse/studentDash';
import TeacherDashboard from './studTeachCourse/teachDash';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/check-session', {
      method: 'GET',
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.user);
        }
        else {
          setUser(null);  // 🚨 add this
        }
      })
      .catch(() => setUser(null));
  }, []);
  
  const handleLogin = (userData) => {
    setUser(userData);

    // if (userData.user_type === 'admin') {
    //   window.location.href = 'http://localhost:5000/admin';
    // }
  };

  const handleLogout = async () => {
    await fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      credentials: 'include'
    });
    setUser(null);
  };

  if (!user) return <LoginPage onLogin={handleLogin} />
  if (user.user_type === 'student') return <StudentDashboard user={user} onLogout={handleLogout} />;
  if (user.user_type === 'teacher') return <TeacherDashboard user={user} onLogout={handleLogout} />;
  if (user.user_type === 'admin') return window.location.href = 'http://localhost:5000/admin';

  return <div>Student {user.name} has an unknown role</div>; 
}

export default App;

