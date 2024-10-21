# WatchMate 🎬

**WatchMate** is a movie search and recommendation engine designed to provide users with personalized movie suggestions and an easy-to-navigate search experience. It utilizes cutting-edge web technologies and secure authentication to create a seamless and secure user experience.

## Features 🚀
- **Search Movies**: Find your favorite movies by title or keyword.
- **Personalized Recommendations**: Tailored movie suggestions based on user preferences.
- **User Authentication**: Secure login and session management.
- **Responsive UI**: Fully responsive design ensuring a smooth experience on all devices.

---

## Tech Stack 🛠️

### Frontend:
- **React**: A powerful JavaScript library for building user interfaces. It enables dynamic, real-time updates without page reloads, giving users a fast and fluid experience.
- **React Query**: Manages server state and caching efficiently. Ensures smooth data fetching, automatic updates, and background synchronization.
- **Context API & Custom Hooks**: Simplifies state management across components and ensures reusability, making the codebase easier to maintain and scale.
- **Tailwind CSS**: A utility-first CSS framework for crafting modern, responsive, and custom designs without writing much CSS.

### Backend:
- **Python (Flask)**: A lightweight, high-performance web framework used to handle API requests, serve the frontend, and manage user authentication.
- **JWT (JSON Web Token)**: Used for secure user authentication, protecting user sessions and ensuring data security.
- **MySQL & SQLAlchemy**: A relational database setup with SQLAlchemy ORM, allowing seamless interaction between the Python backend and database for handling complex queries and relationships.

### Deployment:
- **PythonAnywhere**: Cloud hosting platform used for the backend deployment, ensuring reliability and uptime for the application.

---

## Installation & Setup ⚙️

### 1. Clone the repository:
```bash
git clone https://github.com/AhmedHesham2112/WatchMate.git
cd WatchMate 
```
### 2. Install dependencies:

### Frontend:
```bash
npm install
```

### Backend:
```bash
cd backend
pip install -r requirements.txt
```

### 3. Set up environment variables:
Create a `.env` file in the root directory of the project folder, and add your environment-specific settings (e.g., database credentials, JWT secret, API keys).

### 4. Run the development servers:

### Frontend:
```bash
npm run dev
```

### Backend:
```bash
cd backend
python create_db.py (Assuming you have a MySQL server working)
python app.py
```

---

## Usage 🔍

- Open the app in your browser by visiting http://localhost:5173.
- Register or log in to access personalized recommendations.
- Use the search bar to find movies by title or keyword.
- Enjoy customized movie suggestions based on your profile and preferences.

---

## Areas of Improvement ⬆️

- We can improve the watch providers to be shown by the location of the user and the available watch providers in his country.
- We can also add TV shows to the site and not make it only for movies.
- Sorting movies by name, genre, rating and date of release.

---

## License 📄
This project is licensed under the MIT License.

---

## Contact 📧
For any questions or feedback, feel free to reach out:

### Ahmed Hesham:

- Email: ahmed.hesham.khattab97@gmail.com
- GitHub: [GitHub Profile](https://github.com/AhmedHesham2112)
- LinkedIn: [LinkedIn Profile](https://www.linkedin.com/in/ahmed-hesham-khattab/)

### Amr Ehab:
- Email: amrehab410@gmail.com
- GitHub: [GitHub Profile](https://github.com/amrehab410)
- LinkedIn: [LinkedIn Profile](https://www.linkedin.com/in/amrehab410/)

---
Visit our live site: [WatctMate](https://watchmate.pythonanywhere.com/)
