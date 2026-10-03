from django.urls import path
from . import views
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.exceptions import AuthenticationFailed

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    default_error_messages = {
        'no_active_account': 'Invalid username or password. Please check your credentials and try again.'
    }

    def validate(self, attrs):
        try:
            data = super().validate(attrs)
        except Exception:
            raise AuthenticationFailed('Invalid username or password. Please check your credentials and try again.')

        serializer = views.UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

urlpatterns = [
    # Auth Endpoints
    path('users/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/register/', views.register_user, name='register_user'),
    path('users/profile/', views.get_user_profile, name='user_profile'),
    path('users/profile/update/', views.update_user_profile, name='user_profile_update'),
    path('users/change-password/', views.change_password, name='change_password'),

    # Categories
    path('categories/', views.get_categories, name='categories'),

    # Products
    path('products/', views.get_products, name='products'),
    path('products/featured/', views.get_featured_products, name='featured_products'),
    path('products/<int:pk>/', views.get_product_by_id, name='product_detail'),
    path('products/<int:pk>/reviews/', views.create_product_review, name='create_review'),

    # Orders
    path('orders/', views.add_order_items, name='add_orders'),
    path('orders/myorders/', views.get_my_orders, name='my_orders'),
    path('orders/<int:pk>/', views.get_order_by_id, name='order_by_id'),
    path('orders/<int:pk>/pay/', views.update_order_to_paid, name='pay_order'),
]
