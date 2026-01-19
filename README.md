# 📱 SIM Management System

A full-stack **SIM Management System** built to automate and manage the complete SIM lifecycle within an organization.  
The system supports **role-based access control**, secure request handling, approvals, and SIM inventory management.

🔗 **Live Application:**  
https://sim-management-system-mes4.vercel.app

---

## 🚀 Key Features

### 👤 Role-Based Dashboards
- **Employee**
  - Submit SIM requests
  - Track request status
  - View assigned SIM details

- **HOD**
  - Review and approve employee SIM requests

- **HR / Admin**
  - Manage SIM inventory
  - Approve / reject requests
  - Monitor SIM lifecycle (Pending, Approved, Activated, Rejected)

---

## 🛠️ Tech Stack

### Frontend
- HTML
- CSS
- JavaScript  
- **Deployed on Vercel**

### Backend
- Node.js
- Express.js

### Database
- MongoDB (MongoDB Atlas)

---

## 🔐 Authentication & Security

- Role-based authentication system
- Protected routes for dashboards
- Sensitive data handled using environment variables (`.env`)
- GitHub security alerts may appear due to dependency version checks  
  **(These do not affect the live application or its functionality)**

---

## 📂 Project Structure

```

SIM-Management-System/
│
├── Sim_management_system/     # Main project source code
├── Sim_management_system.zip  # Deploy-ready version
├── README.md

````

---

## ⚙️ Local Setup & Installation

1. Clone the repository
```bash
git clone https://github.com/23it101PopatHemangi/SIM-Management-System.git
````

2. Navigate to the project directory

```bash
cd SIM-Management-System
```

3. Install dependencies

```bash
npm install
```

4. Create a `.env` file in the root directory

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

5. Start the server

```bash
npm start
```

---

## 🌐 Deployment

* Frontend deployed on **Vercel**
* Backend connected to **MongoDB Atlas**
* Project is fully live and functional

---

## 🎯 Learning Outcomes

* Implemented full-stack CRUD operations
* Designed secure role-based dashboards
* Understood real-world SIM lifecycle management
* Learned deployment and environment security practices

---

## 👩‍💻 Author

**Hemangi Popat**
IT Undergraduate (Batch 2027)
Full-Stack Developer | MERN Stack | System Design Enthusiast

---

## 📌 Note

This project is developed for academic and learning purposes.
Any security warnings shown by GitHub are related to dependency scanning and do **not** impact the deployed application.
 


