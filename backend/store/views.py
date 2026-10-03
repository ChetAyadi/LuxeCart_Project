"""
LuxeCart Store API Views
-----------------------
This file contains the API endpoints for:
1. User Authentication (Register, Profile, Update Profile, Change Password)
2. Product & Category Catalog (Listing, Filtering, Details, Featured items)
3. Product Reviews (Submitting ratings & comments)
4. Order Management (Creating orders, User order history, Payment processing)
5. Celery Background Tasks Integration
"""

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from django.db.models import Q
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Category, Product, ProductImage, Review, Order, OrderItem, ShippingAddress
from .serializers import (
    UserSerializer, UserSerializerWithToken,
    CategorySerializer, ProductSerializer, ReviewSerializer,
    OrderSerializer, ShippingAddressSerializer
)
from .tasks import send_welcome_email, send_order_confirmation_email

# ==========================================
# 1. USER AUTHENTICATION & PROFILE VIEWS
# ==========================================

@api_view(['POST'])
def register_user(request):
    """
    Registers a new user with name, username, email, and password.
    Triggers a background Celery task to send a welcome email.
    """
    data = request.data
    try:
        if User.objects.filter(email=data.get('email')).exists():
            return Response({'detail': 'User with this email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=data.get('username')).exists():
            return Response({'detail': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)

        if not data.get('password') or len(data.get('password')) < 6:
            return Response({'detail': 'Password must be at least 6 characters long'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create(
            first_name=data.get('name', ''),
            username=data.get('username'),
            email=data.get('email'),
            password=make_password(data.get('password'))
        )

        try:
            send_welcome_email.delay(user.id)
        except Exception as task_err:
            print("Celery task trigger note:", task_err)
        
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    user = request.user
    data = request.data

    user.first_name = data.get('name', user.first_name)
    user.email = data.get('email', user.email)
    user.save()

    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    data = request.data
    old_password = data.get('old_password')
    new_password = data.get('new_password')

    if not old_password or not new_password:
        return Response({'detail': 'Both current and new passwords are required'}, status=status.HTTP_400_BAD_REQUEST)

    if not user.check_password(old_password):
        return Response({'detail': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

    if len(new_password) < 6:
        return Response({'detail': 'New password must be at least 6 characters long'}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()

    token = RefreshToken.for_user(user)

    return Response({
        'detail': 'Password changed successfully',
        'token': str(token.access_token),
        'refresh': str(token)
    }, status=status.HTTP_200_OK)


# ==========================================
# 2. CATEGORY VIEWS
# ==========================================

@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


# ==========================================
# 3. PRODUCT CATALOG & REVIEWS VIEWS
# ==========================================

@api_view(['GET'])
def get_products(request):
    query = request.query_params.get('search', '').strip()
    category_slug = request.query_params.get('category', '')
    min_price = request.query_params.get('min_price', '')
    max_price = request.query_params.get('max_price', '')
    rating = request.query_params.get('rating', '')
    ordering = request.query_params.get('ordering', '')

    products = Product.objects.all()

    # Enhanced Case-Insensitive Search across Name, Description, Category Name & Category Slug
    if query:
        products = products.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(category__name__icontains=query) |
            Q(category__slug__icontains=query)
        )

    if category_slug:
        products = products.filter(category__slug=category_slug)
    if min_price:
        products = products.filter(price__gte=float(min_price))
    if max_price:
        products = products.filter(price__lte=float(max_price))
    if rating:
        products = products.filter(rating__gte=float(rating))

    if ordering == 'price_asc':
        products = products.order_by('price')
    elif ordering == 'price_desc':
        products = products.order_by('-price')
    elif ordering == 'rating':
        products = products.order_by('-rating')
    elif ordering == 'newest':
        products = products.order_by('-created_at')
    else:
        products = products.order_by('-created_at')

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_featured_products(request):
    products = Product.objects.filter(is_featured=True)[:8]
    if not products.exists():
        products = Product.objects.all()[:8]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_product_by_id(request, pk):
    try:
        product = Product.objects.get(pk=pk)
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_product_review(request, pk):
    user = request.user
    product = Product.objects.get(pk=pk)
    data = request.data

    already_exists = product.reviews.filter(user=user).exists()
    if already_exists:
        return Response({'detail': 'You have already reviewed this product'}, status=status.HTTP_400_BAD_REQUEST)

    rating = int(data.get('rating', 5))
    if rating == 0:
        return Response({'detail': 'Please select a valid rating'}, status=status.HTTP_400_BAD_REQUEST)

    Review.objects.create(
        user=user,
        product=product,
        name=user.first_name if user.first_name else user.username,
        rating=rating,
        comment=data.get('comment', '')
    )

    product.update_rating()
    return Response({'detail': 'Review added successfully'}, status=status.HTTP_201_CREATED)


# ==========================================
# 4. ORDER & PAYMENT VIEWS
# ==========================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_order_items(request):
    user = request.user
    data = request.data

    order_items = data.get('order_items', [])
    if not order_items or len(order_items) == 0:
        return Response({'detail': 'No items in order'}, status=status.HTTP_400_BAD_REQUEST)

    order = Order.objects.create(
        user=user,
        payment_method=data.get('payment_method', 'Card'),
        items_price=data.get('items_price', 0),
        tax_price=data.get('tax_price', 0),
        shipping_price=data.get('shipping_price', 0),
        total_price=data.get('total_price', 0),
    )

    shipping = data.get('shipping_address', {})
    ShippingAddress.objects.create(
        order=order,
        address=shipping.get('address'),
        city=shipping.get('city'),
        postal_code=shipping.get('postal_code'),
        country=shipping.get('country')
    )

    for item in order_items:
        product = Product.objects.get(pk=item['product_id'])
        OrderItem.objects.create(
            product=product,
            order=order,
            name=product.name,
            qty=item['qty'],
            price=item['price'],
            image=product.image
        )
        product.stock = max(0, product.stock - item['qty'])
        product.save()

    serializer = OrderSerializer(order, many=False)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_orders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order_by_id(request, pk):
    user = request.user
    try:
        order = Order.objects.get(pk=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return Response({'detail': 'Not authorized to view this order'}, status=status.HTTP_400_BAD_REQUEST)
    except Order.DoesNotExist:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_order_to_paid(request, pk):
    try:
        order = Order.objects.get(pk=pk)
        order.is_paid = True
        order.paid_at = timezone.now()
        order.status = 'Processing'
        order.save()

        try:
            send_order_confirmation_email.delay(order.id)
        except Exception as task_err:
            print("Celery order confirmation task trigger note:", task_err)

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)
    except Order.DoesNotExist:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_404_NOT_FOUND)
