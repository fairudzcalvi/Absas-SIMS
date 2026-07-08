import React, { useEffect, useMemo, useState } from 'react';
import { 
  BookOpen, 
  CalendarDays, 
  ClipboardCheck, 
  DollarSign, 
  Edit, 
  Eye, 
  FileText, 
  GraduationCap, 
  Home, 
  LogOut, 
  Menu, 
  Plus, 
  Save, 
  Search, 
  Settings, 
  Trash2, 
  UserCheck, 
  Users, 
  X 
} from 'lucide-react';
import logo from './assets/absas-logo.jpg';
import { seedData } from './data/seedData.js';

const navItems = [
  { key: 'overview', label: 'Overview', icon: Home },
  { key: 'students', label: 'Student Records', icon: GraduationCap },
  { key: 'faculty', label: 'Faculty Records', icon: UserCheck },
  { key: 'schedules', label: 'Class Schedules', icon: CalendarDays },
  { key: 'attendance', label: 'Attendance', icon: ClipboardCheck },
  { key: 'grades', label: 'Grades', icon: BookOpen },
  { key: 'transcripts', label: 'Transcripts', icon: FileText },
  { key: 'finance', label: 'Finance', icon: DollarSign },
  { key: 'settings', label: 'Settings', icon: Settings }
];

const portals = [
  { key: 'admin', label: 'Administrator', user: 'admin', pass: 'admin123' },
  { key: 'student', label: 'Student', user: 'student1', pass: 'student123' },
  { key: 'teacher', label: 'Teacher', user: 'admin', pass: 'admin123' }
];

function App() {
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem('absas_react_session') || 'null'));
  const [portal, setPortal] = useState('admin');
  const [page, setPage] = useState('overview');
  const [students, setStudents] = useState(() => readStore('absas_react_students', seedData.students));
  const [faculty, setFaculty] = useState(() => readStore('absas_react_faculty', seedData.faculty));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => localStorage.setItem('absas_react_students', JSON.stringify(students)), [students]);
  useEffect(() => localStorage.setItem('absas_react_faculty', JSON.stringify(faculty)), [faculty]);

  function login(kind, username, password) {
    const selected = portals.find((item) => item.key === kind);
    if (!selected || selected.user !== username.trim() || selected.pass !== password) {
      return false;
    }
    const nextSession = { portal: kind, name: selected.label, signedInAt: new Date().toISOString() };
    setPortal(kind);
    setSession(nextSession);
    setPage(kind === 'admin' ? 'overview' : kind);
    localStorage.setItem('absas_react_session', JSON.stringify(nextSession));
    return true;
  }

  function logout() {
    localStorage.removeItem('absas_react_session');
    setSession(null);
    setPage('overview');
    setSidebarOpen(false);
  }

  if (!session) {
    return <LoginScreen activePortal={portal} setPortal={setPortal} onLogin={login} />;
  }

  if (session.portal === 'student') {
    return <PortalShell title="Student Portal" user="Student" onLogout={logout}>
      <StudentPortal students={students} />
    </PortalShell>;
  }

  if (session.portal === 'teacher') {
    return <PortalShell title="Teacher Portal" user="Teacher" onLogout={logout}>
      <TeacherPortal students={students} faculty={faculty} />
    </PortalShell>;
  }

  return (
    <div className="dashboard-page">
      <aside className={`sidebar ${sidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <h2>ABSAS-SIMS</h2>
          <button className="icon-button mobile-only" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button key={key} className={`nav-item ${page === key ? 'active' : ''}`} onClick={() => { setPage(key); setSidebarOpen(false); }}>
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p className="user-name">Administrator</p>
          <p className="user-role">React Frontend</p>
          <button className="logout-btn-sidebar" onClick={logout}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="top-header">
          <button className="icon-button mobile-only" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu />
          </button>
          <h1>{pageTitle(page)}</h1>
          <span className="date-time">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </header>
        <section className="content-area">
          {page === 'overview' && <Overview students={students} faculty={faculty} setPage={setPage} />}
          {page === 'students' && <StudentsPage students={students} setStudents={setStudents} />}
          {page === 'faculty' && <FacultyPage faculty={faculty} setFaculty={setFaculty} />}
          {!['overview', 'students', 'faculty'].includes(page) && <ModulePage page={page} students={students} faculty={faculty} />}
        </section>
      </main>
    </div>
  );
}

function LoginScreen({ activePortal, setPortal, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const selected = portals.find((item) => item.key === activePortal);

  function submit(event) {
    event.preventDefault();
    setError('');
    if (!onLogin(activePortal, username, password)) {
      setError('Invalid username or password.');
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <img src={logo} alt="ABSAS logo" className="school-logo" />
        <h1>A.B. Simpson Alliance School</h1>
        <p>Student Information and Management System</p>
        <div className="portal-switch">
          {portals.map((item) => <button key={item.key} className={activePortal === item.key ? 'selected' : ''} onClick={() => setPortal(item.key)}>{item.label}</button>)}
        </div>
        <form className="login-form" onSubmit={submit}>
          <label>Username / Email
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
          </label>
          <label>Password
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter password" />
          </label>
          {error && <p className="error-message">{error}</p>}
          <button className="login-btn" type="submit">Login</button>
        </form>
        <div className="default-login">
          <strong>Default {selected.label} Login</strong><br />
          Username: <code>{selected.user}</code><br />
          Password: <code>{selected.pass}</code>
        </div>
      </section>
    </main>
  );
}

function Overview({ students, faculty, setPage }) {
  const recent = students.slice(0, 5);
  return (
    <>
      <Stats cards={[
        ['Total Students', students.length, GraduationCap],
        ['Total Faculty', faculty.length, UserCheck, 'gold'],
        ['Grade Levels', 10, BookOpen, 'green']
      ]} />
      <Card title="Recent Enrollments" action={<button className="btn btn-secondary" onClick={() => setPage('students')}><Eye size={16} /> View All</button>}>
        <DataTable columns={['ID', 'Name', 'Grade', 'Section', 'Enrolled', 'Status']}>
          {recent.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.firstName} {student.lastName}</td>
              <td>Grade {student.grade}</td>
              <td>{student.section}</td>
              <td>{student.enrolled}</td>
              <td><Badge tone="success">Active</Badge></td>
            </tr>
          ))}
        </DataTable>
      </Card>
      <Card title="Quick Actions">
        <div className="quick-actions-grid">
          {[
            ['Add Student', GraduationCap, 'students'],
            ['View Attendance', ClipboardCheck, 'attendance'],
            ['Manage Grades', BookOpen, 'grades'],
            ['Record Payment', DollarSign, 'finance'],
            ['Generate Transcript', FileText, 'transcripts']
          ].map(([label, Icon, target]) => <button key={label} className="quick-action-card" onClick={() => setPage(target)}><Icon /><span>{label}</span></button>)}
        </div>
      </Card>
    </>
  );
}

function StudentsPage({ students, setStudents }) {
  const [query, setQuery] = useState('');
  const [grade, setGrade] = useState('');
  const [gender, setGender] = useState('');
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => students.filter((s) =>
    (!grade || s.grade === grade) &&
    (!gender || s.gender === gender) &&
    `${s.id} ${s.lrn} ${s.firstName} ${s.lastName}`.toLowerCase().includes(query.toLowerCase())
  ), [students, query, grade, gender]);

  function saveStudent(student) {
    setStudents((items) => student.recordId ? items.map((item) => item.recordId === student.recordId ? student : item) : [{ ...student, recordId: crypto.randomUUID(), id: student.id || `S-${items.length + 101}` }, ...items]);
    setEditing(null);
  }

  return (
    <>
      <Stats cards={[
        ['Total Students', students.length, Users],
        ['Male Students', students.filter((s) => s.gender === 'Male').length, Users, 'blue'],
        ['Female Students', students.filter((s) => s.gender === 'Female').length, Users, 'gold']
      ]} />
      <Card title="Filter Students" action={<button className="btn btn-primary" onClick={() => setEditing({})}><Plus size={16} /> Add Student</button>}>
        <Filters>
          <Select label="Grade Level" value={grade} onChange={setGrade} options={['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']} />
          <Select label="Gender" value={gender} onChange={setGender} options={['', 'Male', 'Female']} />
          <SearchBox value={query} onChange={setQuery} placeholder="Name, LRN, or ID..." />
        </Filters>
      </Card>
      <Card title="All Students">
        <DataTable columns={['Student ID', 'LRN', 'Name', 'Grade & Section', 'Gender', 'Age', 'Guardian', 'Contact', 'Actions']}>
          {filtered.map((s) => (
            <tr key={s.recordId}>
              <td><strong>{s.id}</strong></td>
              <td>{s.lrn}</td>
              <td><strong>{s.firstName} {s.lastName}</strong></td>
              <td><Badge>Grade {s.grade} - {s.section}</Badge></td>
              <td>{s.gender}</td>
              <td>{s.age}</td>
              <td>{s.guardian}</td>
              <td>{s.guardianContact}</td>
              <td className="actions">
                <button className="btn btn-sm btn-secondary" onClick={() => setEditing(s)}><Edit size={15} /></button>
                <button className="btn btn-sm btn-danger" onClick={() => setStudents(students.filter((item) => item.recordId !== s.recordId))}><Trash2 size={15} /></button>
              </td>
            </tr>
          ))}
        </DataTable>
      </Card>
      {editing && <StudentModal student={editing} onClose={() => setEditing(null)} onSave={saveStudent} />}
    </>
  );
}

function FacultyPage({ faculty, setFaculty }) {
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [editing, setEditing] = useState(null);

  const filtered = faculty.filter((f) =>
    (!department || f.department === department) &&
    (!role || f.role === role) &&
    `${f.id} ${f.firstName} ${f.lastName} ${f.email}`.toLowerCase().includes(query.toLowerCase())
  );

  function saveFaculty(member) {
    setFaculty((items) => member.recordId ? items.map((item) => item.recordId === member.recordId ? member : item) : [{ ...member, recordId: crypto.randomUUID(), id: member.id || `F-${items.length + 201}` }, ...items]);
    setEditing(null);
  }

  return (
    <>
      <Stats cards={[
        ['Total Faculty', faculty.length, Users],
        ['Class Advisers', faculty.filter((f) => ['Adviser', 'Both'].includes(f.role)).length, UserCheck, 'gold'],
        ['Subject Teachers', faculty.filter((f) => ['Teacher', 'Both'].includes(f.role)).length, BookOpen, 'green']
      ]} />
      <Card title="Filter Faculty" action={<button className="btn btn-primary" onClick={() => setEditing({})}><Plus size={16} /> Add Faculty</button>}>
        <Filters>
          <Select label="Department" value={department} onChange={setDepartment} options={['', 'Elementary', 'Junior High', 'Administration']} />
          <Select label="Role" value={role} onChange={setRole} options={['', 'Teacher', 'Adviser', 'Both']} />
          <SearchBox value={query} onChange={setQuery} placeholder="Name, ID, or Email..." />
        </Filters>
      </Card>
      <Card title="All Faculty Members">
        <DataTable columns={['Faculty ID', 'Name', 'Department', 'Role', 'Assigned Class', 'Subjects', 'Contact', 'Status', 'Actions']}>
          {filtered.map((f) => (
            <tr key={f.recordId}>
              <td><strong>{f.id}</strong></td>
              <td><strong>{f.firstName} {f.lastName}</strong></td>
              <td>{f.department}</td>
              <td><Badge>{f.role}</Badge></td>
              <td>{f.assignedClass || 'N/A'}</td>
              <td>{f.subjects}</td>
              <td>{f.email}<br /><small>{f.phone}</small></td>
              <td><Badge tone="success">{f.status}</Badge></td>
              <td className="actions">
                <button className="btn btn-sm btn-secondary" onClick={() => setEditing(f)}><Edit size={15} /></button>
                <button className="btn btn-sm btn-danger" onClick={() => setFaculty(faculty.filter((item) => item.recordId !== f.recordId))}><Trash2 size={15} /></button>
              </td>
            </tr>
          ))}
        </DataTable>
      </Card>
      {editing && <FacultyModal member={editing} onClose={() => setEditing(null)} onSave={saveFaculty} />}
    </>
  );
}

function StudentModal({ student, onClose, onSave }) {
  const [form, setForm] = useState({ grade: '1', section: 'MATTHEW', gender: 'Male', status: 'Active', ...student });
  return <Modal title={student.recordId ? 'Edit Student' : 'Add Student'} onClose={onClose} onSubmit={() => onSave(form)}>
    <FormGrid fields={[
      ['Student ID', 'id'], ['LRN', 'lrn'], ['First Name', 'firstName'], ['Middle Name', 'middleName'], ['Last Name', 'lastName'], ['Grade', 'grade'],
      ['Section', 'section'], ['Gender', 'gender', ['Male', 'Female']], ['Age', 'age'], ['Birthday', 'birthday', null, 'date'], ['Email', 'email', null, 'email'],
      ['Guardian', 'guardian'], ['Guardian Contact', 'guardianContact'], ['Address', 'address']
    ]} form={form} setForm={setForm} />
  </Modal>;
}

function FacultyModal({ member, onClose, onSave }) {
  const [form, setForm] = useState({ department: 'Elementary', role: 'Teacher', status: 'Active', ...member });
  return <Modal title={member.recordId ? 'Edit Faculty' : 'Add Faculty'} onClose={onClose} onSubmit={() => onSave(form)}>
    <FormGrid fields={[
      ['Faculty ID', 'id'], ['Employee Number', 'employeeNo'], ['First Name', 'firstName'], ['Middle Name', 'middleName'], ['Last Name', 'lastName'],
      ['Birthdate', 'birthdate', null, 'date'], ['Department', 'department', ['Elementary', 'Junior High', 'Administration']], ['Role', 'role', ['Teacher', 'Adviser', 'Both']],
      ['Position', 'position'], ['Hire Date', 'hireDate', null, 'date'], ['Status', 'status', ['Active', 'On Leave', 'Inactive']], ['Assigned Class', 'assignedClass'],
      ['Subjects Taught', 'subjects'], ['Email', 'email', null, 'email'], ['Phone', 'phone'], ['Address', 'address']
    ]} form={form} setForm={setForm} />
  </Modal>;
}

function ModulePage({ page, students, faculty }) {
  const stats = {
    schedules: [['Classes', 10, CalendarDays], ['Faculty Assigned', faculty.length, UserCheck, 'gold']],
    attendance: [['Students Today', students.length, ClipboardCheck], ['Marked Present', Math.max(students.length - 2, 0), Users, 'green']],
    grades: [['Grade Sheets', students.length, BookOpen], ['Pending Reviews', 3, FileText, 'gold']],
    transcripts: [['Transcript Requests', 4, FileText], ['Ready to Print', 2, Save, 'green']],
    finance: [['Accounts', students.length, DollarSign], ['Open Balances', 6, FileText, 'gold']],
    settings: [['User Roles', 3, Settings], ['Active Accounts', students.length + faculty.length, Users, 'green']]
  }[page] || [];

  return (
    <>
      <Stats cards={stats} />
      <Card title={pageTitle(page)}>
        <div className="module-grid">
          <div>
            <h3>{pageTitle(page)} Workspace</h3>
            <p>This React module replaces the original PHP page shell and is ready for API-backed records.</p>
          </div>
          <button className="btn btn-primary"><Plus size={16} /> New Entry</button>
        </div>
      </Card>
    </>
  );
}

function StudentPortal({ students }) {
  const student = students[0];
  return <div className="portal-content">
    <Stats cards={[
      ['Current Grade', `Grade ${student.grade}`, GraduationCap], 
      ['Attendance', '96%', ClipboardCheck, 'green'], 
      ['Subjects', 8, BookOpen, 'gold']
    ]} />
    <Card title="Personal Profile">
      <ProfileRows rows={[
        ['Name', `${student.firstName} ${student.lastName}`], 
        ['LRN', student.lrn], 
        ['Guardian', student.guardian], 
        ['Contact', student.guardianContact]
      ]} />
    </Card>
    <Card title="Class Schedule">
      <DataTable columns={['Subject', 'Teacher', 'Schedule']}>
        <tr><td>Mathematics</td><td>Mrs. Santos</td><td>Mon/Wed 8:00 AM</td></tr>
        <tr><td>Science</td><td>Mr. Reyes</td><td>Tue/Thu 9:30 AM</td></tr>
      </DataTable>
    </Card>
  </div>;
}

function TeacherPortal({ students, faculty }) {
  const teacher = faculty[0];
  return <div className="portal-content">
    <Stats cards={[
      ['Assigned Students', students.length, GraduationCap], 
      ['Classes', 3, CalendarDays, 'gold'], 
      ['Pending Grades', 8, BookOpen, 'green']
    ]} />
    <Card title="Teacher Profile">
      <ProfileRows rows={[
        ['Name', `${teacher.firstName} ${teacher.lastName}`], 
        ['Department', teacher.department], 
        ['Subjects', teacher.subjects], 
        ['Email', teacher.email]
      ]} />
    </Card>
    <Card title="Student Advisory List">
      <DataTable columns={['ID', 'Name', 'Grade', 'Status']}>
        {students.slice(0, 6).map((s) => <tr key={s.recordId}>
          <td>{s.id}</td>
          <td>{s.firstName} {s.lastName}</td>
          <td>Grade {s.grade}</td>
          <td><Badge tone="success">Active</Badge></td>
        </tr>)}
      </DataTable>
    </Card>
  </div>;
}

function PortalShell({ title, user, onLogout, children }) {
  return <div className="simple-shell">
    <header className="portal-header">
      <div>
        <h1>{title}</h1>
        <p>{user} dashboard</p>
      </div>
      <button className="btn btn-secondary" onClick={onLogout}>
        <LogOut size={16} /> Logout
      </button>
    </header>
    <main className="content-area">{children}</main>
  </div>;
}

function Stats({ cards }) {
  return <div className="stats-grid">
    {cards.map(([label, value, Icon, tone]) => <div className={`stat-card ${tone || ''}`} key={label}>
      <div className="stat-icon"><Icon /></div>
      <div>
        <div className="stat-number">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>)}
  </div>;
}

function Card({ title, action, children }) {
  return <section className="card">
    <div className="card-header">
      <h2 className="card-title">{title}</h2>
      {action}
    </div>
    {children}
  </section>;
}

function DataTable({ columns, children }) {
  return <div className="table-container">
    <table className="data-table">
      <thead>
        <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
      </thead>
      <tbody>
        {React.Children.count(children) ? children : <tr><td colSpan={columns.length} className="empty-message">No records found</td></tr>}
      </tbody>
    </table>
  </div>;
}

function Modal({ title, onClose, onSubmit, children }) {
  return <div className="modal active">
    <form className="modal-content" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
      <div className="modal-header">
        <h3>{title}</h3>
        <button type="button" className="icon-button" onClick={onClose}><X /></button>
      </div>
      <div className="modal-body">{children}</div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" type="submit"><Save size={16} /> Save</button>
      </div>
    </form>
  </div>;
}

function FormGrid({ fields, form, setForm }) {
  return <div className="form-grid">
    {fields.map(([label, key, options, type = 'text']) => <label className="form-group" key={key}>
      {label}
      {options ? <select value={form[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select> : <input type={type} value={form[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />}
    </label>)}
  </div>;
}

function Filters({ children }) {
  return <div className="form-grid">{children}</div>;
}

function Select({ label, value, onChange, options }) {
  return <label className="form-group">
    {label}
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((option) => <option key={option || 'all'} value={option}>{option || 'All'}</option>)}
    </select>
  </label>;
}

function SearchBox({ value, onChange, placeholder }) {
  return <label className="form-group">
    Search
    <div className="search-field">
      <Search size={16} />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  </label>;
}

function Badge({ children, tone = 'info' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function ProfileRows({ rows }) {
  return <div className="profile-rows">
    {rows.map(([label, value]) => <div key={label}>
      <strong>{label}</strong>
      <span>{value}</span>
    </div>)}
  </div>;
}

function pageTitle(page) {
  return ({ overview: 'Dashboard Overview', students: 'Student Records', faculty: 'Faculty Records', schedules: 'Class Schedules', attendance: 'Attendance', grades: 'Grades', transcripts: 'Transcripts', finance: 'Finance', settings: 'Settings' })[page] || 'Dashboard';
}

function readStore(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null') || fallback;
  } catch {
    return fallback;
  }
}

export default App;
