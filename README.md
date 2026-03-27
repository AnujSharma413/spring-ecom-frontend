# 🛒 Spring-Ecom Frontend (Integration & Deployment)

This repository contains the **React.js** frontend for the **Spring-Ecom** project. It serves as the visual interface to demonstrate and test my custom-built **Spring Boot REST API**.

---

## ⚠️ Project Attribution & My Role
**Note:** The UI/Frontend code in this repository was sourced from external resources and is primarily used as a functional tool to verify, test, and showcase my backend architecture.

**My Core Contributions & Technical Focus:**
* **Backend Architecture:** Developed the complete [Spring Boot & PostgreSQL Backend](https://github.com/AnujSharma413/spring-boot-ecommerce-mvc) from scratch.
* **System Integration:** Successfully refactored this frontend to communicate with my custom Java-based REST endpoints.
* **Cloud Infrastructure:** Managed the full deployment pipeline—**Dockerized** the environment and hosted it using **Render** (Backend), **Vercel** (Frontend), and **Neon Cloud** (PostgreSQL).
* **API Configuration:** Implemented Axios interceptors and environment variables (`.env`) to handle production-level data fetching and error handling.

---

## 🚀 Purpose
The primary goal of this frontend is to provide a live, visual demonstration of my backend services, including:
* **Full CRUD Operations:** Real-time adding, updating, and deleting of products in the PostgreSQL database.
* **Dynamic Search:** Search functionality powered by custom JPA queries in the Spring Boot layer.
* **Data Persistence:** Demonstrating successful cloud database integration through a user-friendly UI.

---

## 🛠️ Tech Stack
* **Frontend (UI Resource):** React.js, Vite, Tailwind CSS, Axios
* **My Backend (Core Skill):** Java 17, Spring Boot, Spring Data JPA, Hibernate, Maven
* **Database:** PostgreSQL (Neon Cloud)
* **Hosting:** Vercel (Frontend) & Render (Backend)

---

## ⚙️ Configuration for Deployment
To bridge this frontend with my backend, I implemented the following:
1.  **CORS Policy:** Updated the Spring Boot Security/Web configuration to permit cross-origin requests from the Vercel production domain.
2.  **Base URL Mapping:** Refactored the API service layer to use a centralized environment variable for easy switching between local and live production servers.
    ```env
    VITE_API_URL=[https://spring-boot-ecommerce-mvc.onrender.com/api](https://spring-boot-ecommerce-mvc.onrender.com/api)
    ```

---

## 🚀 Local Setup
1.  **Clone the repo:** `git clone https://github.com/AnujSharma413/spring-ecom-frontend.git`
2.  **Install dependencies:** `npm install`
3.  **Run the app:** `npm run dev`

---

## 👨‍💻 Author (Backend & Integration)
**Anuj Sharma**
*Full-Stack Developer focused on the Java/Spring Boot ecosystem.*