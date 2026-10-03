import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_header_footer(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "LuxeCart - Full-Stack E-Commerce Project & Interview Guide")
            self.setStrokeColor(colors.HexColor("#e2e8f0"))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)

        # Footer
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, page_str)
        self.drawString(54, 36, "Confidential - Interview Preparation Document")
        self.setStrokeColor(colors.HexColor("#e2e8f0"))
        self.setLineWidth(0.5)
        self.line(54, 48, 558, 48)
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#d97706"),
        spaceAfter=15
    )

    heading1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    heading2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#b45309"),
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#334155"),
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    code_style = ParagraphStyle(
        'Code_Custom',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#0f172a"),
        backColor=colors.HexColor("#f1f5f9"),
        borderColor=colors.HexColor("#cbd5e1"),
        borderWidth=0.5,
        borderPadding=6,
        spaceBefore=6,
        spaceAfter=8
    )

    qa_question = ParagraphStyle(
        'QAQuestion',
        parent=body_style,
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=8,
        spaceAfter=2
    )

    story = []

    # Title Block
    story.append(Paragraph("LuxeCart - Full-Stack E-Commerce Platform", title_style))
    story.append(Paragraph("Complete Technical Architecture & Interview Preparation Master Guide", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#d97706"), spaceAfter=15))

    # Section 1: Project Summary & Pitch
    story.append(Paragraph("1. Executive Summary & Interview Pitch", heading1_style))
    pitch_text = (
        "<b>Interview Pitch:</b> <i>\"LuxeCart is an enterprise-grade full-stack e-commerce web platform built with a modern "
        "React + Bootstrap 5 frontend and a Django REST Framework backend. It features JWT token authentication with sliding "
        "sessions and refresh token rotation, an interactive product search and filter system, a slide-over cart drawer with "
        "coupon handling, a multi-step checkout with simulated payment processing, and an asynchronous Redis & Celery task queue "
        "for background email notifications and order receipts.\"</i>"
    )
    story.append(Paragraph(pitch_text, body_style))
    story.append(Spacer(1, 8))

    # Section 2: Technology Stack & Technical Rationale
    story.append(Paragraph("2. Detailed Technology Stack & Why Each Was Used", heading1_style))
    
    tech_data = [
        [Paragraph("<b>Technology</b>", body_style), Paragraph("<b>Category</b>", body_style), Paragraph("<b>Why It Was Used (Technical Rationale)</b>", body_style)],
        [Paragraph("React.js (Vite)", body_style), Paragraph("Frontend Framework", body_style), Paragraph("Component-based Single Page Application (SPA) architecture providing instant state updates, reusable UI elements, and sub-second Vite HMR build speeds.", body_style)],
        [Paragraph("Bootstrap 5", body_style), Paragraph("UI Component Library", body_style), Paragraph("Responsive 12-column flexbox grid system, styled badges, custom glassmorphism overlays, and mobile drawer components.", body_style)],
        [Paragraph("React Router DOM v6", body_style), Paragraph("Frontend Client Router", body_style), Paragraph("Client-side routing, URL query parameter parsing (for live search & category filters), dynamic parameter matching (/product/:id), and Protected Route guards.", body_style)],
        [Paragraph("Axios", body_style), Paragraph("HTTP Request Client", body_style), Paragraph("Promise-based HTTP client with request/response interceptors for automatic JWT token injection and silent 401 token refreshing.", body_style)],
        [Paragraph("React Context API", body_style), Paragraph("Global State Manager", body_style), Paragraph("Centralized state management for Auth, Cart, and Wishlist states across components without prop-drilling or external complexity.", body_style)],
        [Paragraph("Django 4.2", body_style), Paragraph("Backend Web Framework", body_style), Paragraph("High-level Python framework offering object-relational mapping (ORM), built-in security, Django Admin console, and database migrations.", body_style)],
        [Paragraph("Django REST Framework", body_style), Paragraph("REST API Framework", body_style), Paragraph("Serializes Django models into clean JSON endpoints, enforces permissions, supports query param filtering, and standardizes HTTP response status codes.", body_style)],
        [Paragraph("SimpleJWT (django-simplejwt)", body_style), Paragraph("Authentication Engine", body_style), Paragraph("Industry-standard JSON Web Token (JWT) auth featuring 60-min Access Tokens, 30-day Refresh Tokens, Token Rotation, and Blacklisting.", body_style)],
        [Paragraph("PostgreSQL & SQLite", body_style), Paragraph("Database System", body_style), Paragraph("PostgreSQL for ACID-compliant production database with JSONB support; SQLite for zero-setup instant local development via dj-database-url.", body_style)],
        [Paragraph("Celery 5.6", body_style), Paragraph("Task Queue Worker", body_style), Paragraph("Asynchronous task queue for executing heavy background jobs (email dispatch, PDF receipt generation) without blocking HTTP web requests.", body_style)],
        [Paragraph("Redis 8.1", body_style), Paragraph("Message Broker & Cache", body_style), Paragraph("In-memory ultra-fast data store serving as the Message Broker between Django and Celery background workers.", body_style)],
    ]

    t = Table(tech_data, colWidths=[1.3*inch, 1.3*inch, 4.4*inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f8fafc")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor("#0f172a")),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
    ]))
    story.append(t)
    story.append(Spacer(1, 10))

    # Section 3: End-to-End System Architecture & Workflows
    story.append(Paragraph("3. End-to-End System Architecture & Workflows", heading1_style))

    story.append(Paragraph("A. User Authentication Lifecycle", heading2_style))
    story.append(Paragraph("• <b>Registration & Login:</b> User submits credentials → Django hashes password using PBKDF2 with SHA-256 → Returns JWT <code>access</code> and <code>refresh</code> tokens → Triggers <code>send_welcome_email.delay(user_id)</code> in Celery background queue.", bullet_style))
    story.append(Paragraph("• <b>Silent Access Token Refresh:</b> When an Access Token expires (401 response), Axios Response Interceptor catches 401 → Calls <code>/api/users/token/refresh/</code> using Refresh Token → SimpleJWT rotates tokens & blacklists old token → Original request retries transparently.", bullet_style))

    story.append(Paragraph("B. Case-Insensitive Product Search & Catalog Filtering", heading2_style))
    story.append(Paragraph("• <b>Search Execution:</b> User types query in search bar → React updates URL <code>?search=keyword</code> → Axios calls <code>/api/products/?search=keyword</code> → Django ORM executes case-insensitive query across multiple model fields: <code>Q(name__icontains=query) | Q(description__icontains=query) | Q(category__name__icontains=query) | Q(category__slug__icontains=query)</code>.", bullet_style))

    story.append(Paragraph("C. Cart, Multi-Step Checkout & Order Flow", heading2_style))
    story.append(Paragraph("• <b>Cart Persistence:</b> Adding items updates CartContext and syncs with <code>localStorage</code>.", bullet_style))
    story.append(Paragraph("• <b>Protected Checkout:</b> <code>ProtectedRoute</code> verifies user login → User fills Shipping Address & Credit Card details → Backend creates <code>Order</code>, <code>ShippingAddress</code>, <code>OrderItems</code>, updates <code>Product.stock</code> → Triggers Celery <code>send_order_confirmation_email.delay(order_id)</code>.", bullet_style))

    story.append(Spacer(1, 10))

    # Section 4: Top Interview Questions & Standard Answers
    story.append(Paragraph("4. Key Technical Interview Questions & Perfect Answers", heading1_style))

    qa_list = [
        ("Q1: How did you handle user authentication and token expiration in LuxeCart?",
         "Answer: I implemented JSON Web Tokens (JWT) using SimpleJWT on Django REST Framework. To provide a smooth user experience, I built an automatic Axios Response Interceptor on the React frontend. When an API call receives a 401 Unauthorized status (meaning the 60-minute access token expired), Axios intercepts the response, sends the 30-day refresh token to /api/users/token/refresh/, receives a new access token, updates local storage, and transparently retries the original request without logging out the user."),

        ("Q2: How does case-insensitive search work in your Django backend?",
         "Answer: In Django ORM, I used the Q object combined with the icontains lookup field (e.g. Q(name__icontains=query)). The 'i' in icontains stands for 'case-insensitive'. I extended the search query to search across product titles, descriptions, category names, and category slugs simultaneously so users get accurate search results regardless of letter casing."),

        ("Q3: Why did you use Celery and Redis in an E-Commerce application?",
         "Answer: In web applications, time-consuming tasks like sending order confirmation emails, generating invoice PDFs, or communicating with external mail servers can slow down HTTP response times if executed synchronously. By using Celery as an asynchronous task worker and Redis as the Message Broker, Django offloads heavy jobs to background workers and immediately returns a fast 201 Created response to the customer."),

        ("Q4: What happens if Redis is not running locally on a developer's machine?",
         "Answer: I implemented a beginner-friendly fallback using Celery's CELERY_TASK_ALWAYS_EAGER = True configuration setting. When eager mode is active, Celery tasks execute synchronously within Django itself, ensuring the website and API run 100% smoothly without connection errors even if Redis is not running."),

        ("Q5: How did you secure protected pages like Checkout and Profile on the React frontend?",
         "Answer: I built a reusable ProtectedRoute component that wraps private routes. It checks AuthContext for an active user session. If unauthenticated, it captures the current URL path and redirects the user to /login?redirect=/checkout. After logging in, the user is automatically redirected right back to Checkout with their cart items preserved."),
    ]

    for q, a in qa_list:
        story.append(Paragraph(f"<b>{q}</b>", qa_question))
        story.append(Paragraph(a, body_style))
        story.append(Spacer(1, 4))

    story.append(Spacer(1, 10))

    # Section 5: Future Enhancements Roadmap
    story.append(Paragraph("5. Future Enhancements & Scalability Roadmap", heading1_style))
    story.append(Paragraph("When asked in an interview how you would scale LuxeCart in the future, mention these 5 industry features:", body_style))
    
    story.append(Paragraph("1. <b>Production Payment Gateways:</b> Replace simulated Stripe payments with real Stripe Webhooks (using <code>stripe.Webhook.construct_event</code>) and PayPal IPN to process live credit cards and handle chargebacks.", bullet_style))
    story.append(Paragraph("2. <b>Search Engine Upgrade (Elasticsearch / Meilisearch):</b> Replace database ILIKE/icontains queries with a dedicated search index for typo-tolerant fuzzy matching, auto-suggestions, and faceted search.", bullet_style))
    story.append(Paragraph("3. <b>Docker Containerization:</b> Package web, db, redis, and celery_worker into a unified <code>docker-compose.yml</code> setup for automated cloud deployments (AWS ECS / Kubernetes).", bullet_style))
    story.append(Paragraph("4. <b>AI Recommendation Engine:</b> Implement collaborative filtering algorithms to recommend related products based on user browsing history and cart co-occurrence.", bullet_style))
    story.append(Paragraph("5. <b>Cloud Asset Storage (AWS S3 + Cloudflare CDN):</b> Move product image uploads from local media storage to Amazon S3 buckets with Cloudflare CDN caching for low-latency image delivery.", bullet_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF guide: {filename}")

if __name__ == '__main__':
    target_path = r"C:\Users\vivek\.gemini\antigravity\brain\9c851230-3d0a-437b-bf17-7e4869376b2f\LuxeCart_Interview_Preparation_Guide.pdf"
    build_pdf(target_path)
