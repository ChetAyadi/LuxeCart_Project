# 🛍️ LuxeCart

**LuxeCart** is a full-stack e-commerce web application where users can browse products, add them to a cart, sign in with their Google account, and place orders. The frontend is built with **React (Vite)** and the backend is a **Django REST API**. Online payment is planned and will be added soon.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![Google OAuth](https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Payments](https://img.shields.io/badge/Payments-Coming_Soon-orange?style=for-the-badge)

---

## 📑 Table of Contents

1. [About the Project](#-about-the-project)
2. [How It Works](#-how-it-works)
3. [Features in Detail](#-features-in-detail)
4. [Tech Stack](#-tech-stack)
5. [Project Structure](#-project-structure)
6. [Database Models](#-database-models)
7. [API Endpoints](#-api-endpoints)
8. [Google OAuth Login](#-google-oauth-login)
9. [Payment Integration](#-payment-integration-coming-soon)
10. [Getting Started](#-getting-started)
11. [Environment Variables](#-environment-variables)
12. [Screenshots](#-screenshots)
13. [Roadmap](#-roadmap)
14. [Contributing](#-contributing)
15. [Author](#-author)

---

## 📖 About the Project

Online shopping should be simple: find a product, add it to the cart, and check out. LuxeCart provides that complete experience in one project.

The project is split into two independent parts:

- **Backend** (`backend/`): a Django REST API that stores data (products, users, carts, orders) and exposes it through endpoints.
- **Frontend** (`frontend/`): a React app that shows the store to the user and talks to the backend through API calls.

Keeping them separate means the frontend can be redesigned or deployed on its own without touching the backend logic.

---

## 🔄 How It Works

Here is what happens from the moment a user opens the store:

1. **Browse:** The React app asks the backend for the list of products. The backend reads them from the database and sends them back as JSON. React displays them as product cards.
2. **Sign in:** The user clicks "Sign in with Google". Google verifies the user and gives the frontend a token. The frontend sends that token to the backend, which verifies it with Google, creates (or finds) the user account, and returns a login session for the app.
3. **Add to cart:** When the user clicks "Add to Cart", the app saves the item in the user's cart. The cart total updates instantly.
4. **Checkout:** The user reviews the cart and places the order. The backend creates an order with all the items, the total price, and the order status.
5. **Pay** *(coming soon)*: The backend will create a payment request, the user pays securely, and the backend verifies the payment before marking the order as paid.
6. **Order history:** The user can view their past orders and their status.

```
React Frontend  ──(HTTP / JSON)──▶  Django REST API  ──▶  Database
       │                                   │
       └──── Google Sign-In ───────────────┘ (token verified by backend)
```

---

## ✨ Features in Detail

### 🛒 Product Catalog
Products are shown in a responsive grid with image, name, price, and category. Each product has its own detail view with a full description. Products are managed by the store owner through the Django admin panel, so no code changes are needed to add or edit items.

### 🧺 Shopping Cart
Users can add products, change quantities, and remove items. The cart shows a running subtotal so the user always knows what they will pay. The cart belongs to the logged-in user, so it stays saved between visits.

### 🔐 Google Login
Users do not need to create a password. They sign in with their Google account in one click. On the first login, an account is created automatically using their name and email. Later logins reuse the same account.

### 📦 Orders
When the user checks out, the cart is converted into an order. Each order stores the items, quantities, price at the time of purchase, total amount, and status (for example: pending, paid, shipped, delivered). Users can see their order history at any time.

### 💳 Payments *(Coming Soon)*
Secure online payment is planned. See [Payment Integration](#-payment-integration-coming-soon).

### 🧑‍💼 Admin Panel
The Django admin lets the store owner add products, update prices and stock, and view or update orders. Create an admin account with `python manage.py createsuperuser` and open `/admin`.

---

## 🧰 Tech Stack

| Layer | Technology | Why it is used |
|---|---|---|
| **Frontend** | React + Vite | Fast, component-based UI with quick development builds |
| **Backend** | Django + Django REST Framework | Secure, batteries-included framework for building APIs |
| **Authentication** | Google OAuth 2.0 | Safe, password-free sign-in |
| **Payments** | Razorpay / Stripe *(planned)* | Trusted payment gateways |

---

## 📁 Project Structure

```
LuxeCart_Project/
│
├── backend/                 # Django REST API
│   ├── manage.py            # Command-line tool to run the server, migrations, etc.
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Template for environment variables
│   └── ...                  # Django project and app folders (settings, models, views, urls)
│
├── frontend/                # React (Vite) app
│   ├── index.html           # Entry HTML file
│   ├── package.json         # JavaScript dependencies and scripts
│   └── src/                 # React components, pages, and styles
│
└── .gitignore               # Files that should not be uploaded to GitHub
```

**What each part does**

| Folder / File | Purpose |
|---|---|
| `backend/manage.py` | Runs the server, applies database migrations, creates admin users |
| `backend/requirements.txt` | Lists every Python package the backend needs |
| `backend/.env.example` | Shows which environment variables you must set |
| `frontend/package.json` | Lists JavaScript packages and defines `npm run dev` |
| `frontend/src/` | All React code: pages, components, and styling |
| `.gitignore` | Keeps secrets (`.env`), `node_modules`, and database files out of Git |

---

## 🗄️ Database Models

The backend stores its data in these main tables:

| Model | What it stores |
|---|---|
| **User** | Name, email, and Google account details of each customer |
| **Category** | Groups of products, such as Clothing or Accessories |
| **Product** | Name, description, price, image, stock, and category |
| **Cart / CartItem** | The products a user has added and their quantities |
| **Order** | The user, total amount, status, and date of an order |
| **OrderItem** | Each product in an order, with quantity and price at purchase time |

---

## 🔌 API Endpoints

The frontend communicates with the backend through these endpoints:

| Method | Endpoint | What it does |
|---|---|---|
| `POST` | `/api/auth/google/` | Verifies the Google token and logs the user in |
| `GET` | `/api/products/` | Returns all products |
| `GET` | `/api/products/<id>/` | Returns one product's details |
| `GET` | `/api/cart/` | Returns the logged-in user's cart |
| `POST` | `/api/cart/` | Adds a product to the cart |
| `PUT` | `/api/cart/<id>/` | Updates the quantity of a cart item |
| `DELETE` | `/api/cart/<id>/` | Removes an item from the cart |
| `POST` | `/api/orders/` | Places an order from the cart |
| `GET` | `/api/orders/` | Returns the user's order history |
| `POST` | `/api/payments/create/` | Creates a payment order *(coming soon)* |
| `POST` | `/api/payments/verify/` | Verifies a completed payment *(coming soon)* |

---

## 🔑 Google OAuth Login

**How it works:** The user signs in on Google's own secure page. Google returns a signed token proving who the user is. The backend verifies that token with Google, so a fake token can never log anyone in. The app never sees or stores the user's Google password.

**Setup steps:**

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a new project.
2. Open **APIs & Services → OAuth consent screen** and fill in the app name and your email.
3. Open **Credentials → Create Credentials → OAuth client ID**.
4. Choose **Web application**.
5. Under **Authorized JavaScript origins**, add `http://localhost:5173` (and your live website URL after deployment).
6. Copy the **Client ID** and paste it into the `.env` files described in [Environment Variables](#-environment-variables).

> The Client ID is not a secret, but the Client Secret (if you ever use one) must never be committed to GitHub.

---

## 💳 Payment Integration (Coming Soon)

> 🚧 Payment checkout is not live yet and will be added in an upcoming update.

**Planned flow:**

1. The user clicks **Pay Now** at checkout.
2. The backend creates a payment order with the payment gateway (Razorpay or Stripe) for the exact cart total.
3. The gateway's secure payment window opens and the user completes the payment.
4. The gateway sends the result back, and the backend **verifies the payment signature** so nobody can fake a successful payment.
5. On success, the order is marked as **Paid** and the user sees a confirmation.

**Keys needed later** (add to `backend/.env`):

```env
PAYMENT_KEY_ID=your_payment_key_id_here
PAYMENT_KEY_SECRET=your_payment_key_secret_here
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- A Google OAuth Client ID

### 1. Clone the repository

```bash
git clone https://github.com/ChetAyadi/LuxeCart_Project.git
cd LuxeCart_Project
```

### 2. Run the backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create your environment file:

```bash
# Windows
copy .env.example .env
# macOS / Linux
cp .env.example .env
```

Open `.env` and fill in your values, then:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend: **http://127.0.0.1:8000**
Admin panel: **http://127.0.0.1:8000/admin**

### 3. Run the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend: **http://localhost:5173**

---

## 🔐 Environment Variables

**`backend/.env`**

| Variable | Description |
|---|---|
| `SECRET_KEY` | Django secret key |
| `DEBUG` | `True` in development, `False` in production |
| `ALLOWED_HOSTS` | Allowed hostnames, comma separated |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `PAYMENT_KEY_ID` | Payment gateway key ID *(coming soon)* |
| `PAYMENT_KEY_SECRET` | Payment gateway secret *(coming soon)* |

**`frontend/.env`**

| Variable | Description |
|---|---|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `VITE_API_URL` | Backend URL, e.g. `http://127.0.0.1:8000` |

> ⚠️ Never commit your real `.env` files to GitHub.

---

## 📸 Screenshots

> Add images to a `screenshots/` folder and update the file names below.

| Home | Product Page |
|---|---|
| ![Home](screenshots/home.png) | ![Product](screenshots/product.png) |

| Cart | Checkout |
|---|---|
| ![Cart](screenshots/cart.png) | ![Checkout](screenshots/checkout.png) |

---

## 🗺️ Roadmap

- [x] Product catalog and product pages
- [x] Shopping cart
- [x] Google OAuth login
- [x] Orders and order history
- [ ] Online payment integration
- [ ] Email order confirmations
- [ ] Wishlist and product reviews
- [ ] Deploy a live demo

---

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Chet Ayadi**
GitHub: [@ChetAyadi](https://github.com/ChetAyadi)

If you like this project, please give it a ⭐
