import os
from celery import Celery

# Set default Django settings for Celery worker
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce_backend.settings')

app = Celery('ecommerce_backend')

# Read config from settings.py using CELERY_ prefix
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks.py in all installed Django apps
app.autodiscover_tasks()

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Celery Debug Request: {self.request!r}')
