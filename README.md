# Community Watch 

Community Watch is a web application for managing police officers, crime reports, and case assignments.  
It allows authorized officers to log in, file and manage reports, and assign responsibilities to officers based on their rank and role.  

### Live Demo: [community-watch-wdj0.onrender.com](https://community-watch-wdj0.onrender.com/)

---

##  Features

-  User Authentication (bcrypt + Flask sessions)  
-  CRUD for Crime Reports, Categories, Assignments, and Officers  
-  Role- and Rank-based Access Control (only Inspectors/Chiefs can assign cases)  
-  REST API with Flask-RESTful  
-  Frontend in React (Formik + Yup for forms, AuthContext for login state)  
-  CORS-enabled API (Flask-Cors)  
-  PostgreSQL database with migrations (Flask-Migrate + Alembic)  
-  Password hashing with Flask-Bcrypt  

---

##  Tech Stack

- Backend: Flask, Flask-RESTful, Flask-SQLAlchemy, Flask-Migrate  
- Frontend: React, Formik, Yup, Context API  
- Database: PostgreSQL (local or hosted e.g., Render/Heroku RDS)  
- Authentication: Flask-Bcrypt + Sessions  
- Deployment: Render (Gunicorn + Flask backend, React frontend build)  

---

##  Requirements

See [`requirements.txt`](requirements.txt):  

```bash

alembic==1.14.1
aniso8601==9.0.1
bcrypt==4.0.1
blinker==1.8.2
click==8.1.8
Faker==19.10.0
Flask==3.0.3
Flask-Bcrypt==1.0.1
Flask-Cors==5.0.0
Flask-Migrate==4.1.0
Flask-RESTful==0.3.10
Flask-SQLAlchemy==3.1.1
greenlet==3.1.1
gunicorn==21.2.0
ipdb==0.13.9
itsdangerous==2.2.0
Jinja2==3.1.6
Mako==1.3.10
MarkupSafe==2.1.5
psycopg2-binary==2.9.10
python-dateutil==2.9.0.post0
python-dotenv==1.0.1
pytz==2025.2
six==1.17.0
SQLAlchemy==2.0.43
SQLAlchemy-serializer==1.4.1
typing_extensions==4.13.2
Werkzeug==3.0.6

```

---

## Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/cjkakai/Community-watch.git
cd community-watch
```

### 2. Backend Setup (Flask)

#### Create virtual environment & install dependencies

```bash
python3 -m venv venv
source venv/bin/activate   # on Linux/Mac
venv\Scripts\activate      # on Windows

pip install -r requirements.txt
```

#### Create `.env` file

Add your environment variables (e.g., database URL, secret key):

```
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=supersecretkey
DATABASE_URL=postgresql://username:password@localhost:5432/community_watch
```

#### Setup the database

```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

#### (Optional) Seed the database

```bash
python seed.py
```

#### Run backend

```bash
flask run
```

Backend should be running at:
 [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

### 3. Frontend Setup (React)

```bash
cd client   
npm install
npm start
```

Frontend should be running at:
 [http://localhost:3000](http://localhost:3000)

---

### 4. Login Credentials

Use seeded data (from `seed.py`) to log in. Example:

* Email: (check `seed.py` printed emails)
* Password: `password123`

Inspectors/Chiefs can create assignments, Constables/Sergeants have limited permissions.

---

##  Authentication & Authorization

* Login → stores `user_id` in Flask session (cookie-based).
* Rank checks → `@rank_required` decorator verifies officer rank from DB before allowing protected actions (e.g., assignments).

---

##  API Endpoints (Examples)

### Officers

* `GET /officers` → list officers
* `POST /officers` → create officer

### Crime Reports

* `GET /reports`
* `POST /reports`

### Assignments

* `GET /assignments`
* `POST /assignments` (requires Inspector/Chief)
* `PATCH /assignments/<id>`
* `DELETE /assignments/<id>`

---

##  Deployment

* Backend → Render (Flask + Gunicorn)
* Frontend → React build served via Render static site

---

##  Contributing

Pull requests welcome! Please fork the repo and submit a PR with detailed description of changes.

---

##  License

MIT License — free to use and modify.


