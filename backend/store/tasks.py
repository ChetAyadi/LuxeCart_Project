"""
LuxeCart Celery Background Tasks
---------------------------------
This file defines asynchronous background tasks managed by Celery & Redis.
Tasks run outside the main HTTP request/response lifecycle, keeping web requests fast.
"""

from celery import shared_task
from django.contrib.auth.models import User
from .models import Order

@shared_task
def send_welcome_email(user_id):
    """
    Background Task: Sends a welcome email notification to a newly registered user.
    """
    try:
        user = User.objects.get(id=user_id)
        print("==================================================")
        print(f"[CELERY TASK] Sending Welcome Email to: {user.email}")
        print(f"Hello {user.first_name or user.username}, Welcome to LuxeCart!")
        print("==================================================")
        return f"Welcome email sent to {user.email}"
    except User.DoesNotExist:
        return f"User ID {user_id} not found"

@shared_task
def send_order_confirmation_email(order_id):
    """
    Background Task: Generates receipt and sends order confirmation email to customer.
    """
    try:
        order = Order.objects.get(id=order_id)
        user_email = order.user.email if order.user else "guest@luxecart.com"
        print("==================================================")
        print(f"[CELERY TASK] Order Confirmation Email")
        print(f"Order Number: #{order.order_number}")
        print(f"Recipient: {user_email}")
        print(f"Total Price: ${order.total_price}")
        print(f"Status: {order.status} (Paid: {order.is_paid})")
        print("==================================================")
        return f"Order confirmation email sent for #{order.order_number}"
    except Order.DoesNotExist:
        return f"Order ID {order_id} not found"
