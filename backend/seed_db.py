import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce_backend.settings')
django.setup()

from django.contrib.auth.models import User
from store.models import Category, Product, ProductImage, Review

def run_seed():
    print("Seeding database...")

    # Clear existing
    Review.objects.all().delete()
    ProductImage.objects.all().delete()
    Product.objects.all().delete()
    Category.objects.all().delete()

    # Create Admin & Sample User
    if not User.objects.filter(username='admin').exists():
        admin = User.objects.create_superuser('admin', 'admin@luxecart.com', 'admin123')
        admin.first_name = "Admin User"
        admin.save()
        print("Created superuser: admin / admin123")

    if not User.objects.filter(username='johndoe').exists():
        user = User.objects.create_user('johndoe', 'john@example.com', 'user123')
        user.first_name = "John Doe"
        user.save()
        print("Created sample user: johndoe / user123")

    user = User.objects.get(username='johndoe')

    # Categories
    cat_electronics = Category.objects.create(
        name="Electronics & Tech",
        slug="electronics",
        image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        description="Premium audio, laptops, smart gadgets, and cutting-edge devices."
    )

    cat_fashion = Category.objects.create(
        name="Fashion & Apparel",
        slug="fashion",
        image="https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
        description="Curated high-end jackets, streetwear, and timeless clothing."
    )

    cat_home = Category.objects.create(
        name="Home & Living",
        slug="home-living",
        image="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
        description="Modern interior decor, ergonomic furniture, and living accessories."
    )

    cat_accessories = Category.objects.create(
        name="Accessories & Watches",
        slug="accessories",
        image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
        description="Luxury watches, handcrafted bags, and stylish daily carry items."
    )

    print("Categories created.")

    # Products data
    products_data = [
        {
            "name": "Sony WH-1000XM5 Noise Cancelling Headphones",
            "slug": "sony-wh-1000xm5-headphones",
            "category": cat_electronics,
            "description": "Industry-leading noise canceling with two processors and 8 microphones for unprecedented sound quality. Crystal clear hands-free calling with 4 beamforming microphones, precise voice pickup, and advanced audio signal processing.",
            "price": 399.99,
            "discount_price": 349.99,
            "stock": 15,
            "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
            "is_featured": True,
            "specs": {"Brand": "Sony", "Battery Life": "30 Hours", "Connectivity": "Bluetooth 5.2", "Weight": "250g", "Warranty": "2 Years"},
            "images": [
                "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
                "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80"
            ]
        },
        {
            "name": "Apple MacBook Pro 16\" M3 Max",
            "slug": "apple-macbook-pro-16-m3-max",
            "category": cat_electronics,
            "description": "The 16-inch MacBook Pro with M3 Max takes power and efficiency to unprecedented heights. Featuring exceptional battery life, a stunning Liquid Retina XDR display, and an array of pro ports.",
            "price": 2499.00,
            "discount_price": 2299.00,
            "stock": 8,
            "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
            "is_featured": True,
            "specs": {"Processor": "Apple M3 Max 16-Core", "RAM": "36GB Unified", "Storage": "1TB SSD", "Display": "16.2-inch Liquid Retina XDR"},
            "images": [
                "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80"
            ]
        },
        {
            "name": "Ultra SmartWatch Titanium Edition",
            "slug": "ultra-smartwatch-titanium",
            "category": cat_electronics,
            "description": "Engineered for adventure, endurance, and everyday elegance. Crafted with aerospace-grade titanium, dual-frequency GPS, and up to 60 hours of battery life.",
            "price": 449.99,
            "discount_price": 389.99,
            "stock": 20,
            "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
            "is_featured": True,
            "specs": {"Case Material": "Titanium", "Display": "OLED Sapphire", "Water Resistance": "100m", "Heart Rate Sensor": "Optical Gen 3"},
            "images": [
                "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80"
            ]
        },
        {
            "name": "Minimalist Italian Lambskin Leather Jacket",
            "slug": "italian-leather-jacket",
            "category": cat_fashion,
            "description": "Handcrafted in Florence from buttery-soft genuine lambskin leather. Features custom matte black hardware, tailored slim cut, and breathable satin interior lining.",
            "price": 650.00,
            "discount_price": 520.00,
            "stock": 5,
            "image": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
            "is_featured": True,
            "specs": {"Material": "100% Italian Lambskin", "Fit": "Slim Fit", "Color": "Midnight Black", "Care": "Professional Leather Clean"},
            "images": [
                "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800&q=80"
            ]
        },
        {
            "name": "Urban Oversized Washed Denim Jacket",
            "slug": "urban-washed-denim-jacket",
            "category": cat_fashion,
            "description": "Classic vintage washed denim jacket with a relaxed drop-shoulder silhouette. Premium heavy cotton denim designed to age gracefully over time.",
            "price": 129.99,
            "discount_price": 99.99,
            "stock": 25,
            "image": "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80",
            "is_featured": False,
            "specs": {"Material": "100% Heavyweight Cotton Denim", "Fit": "Oversized", "Color": "Vintage Blue"},
            "images": []
        },
        {
            "name": "Ergonomic Mesh Executive Office Chair",
            "slug": "ergonomic-mesh-office-chair",
            "category": cat_home,
            "description": "Designed for all-day focus and posture alignment. Dynamic lumbar support, 4D adjustable armrests, multi-angle tilt lock, and breathable Korean mesh weave.",
            "price": 499.00,
            "discount_price": 419.00,
            "stock": 12,
            "image": "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=800&q=80",
            "is_featured": True,
            "specs": {"Frame": "Aluminium Base", "Weight Capacity": "150kg", "Adjustability": "4D Armrests, Seat Depth & Tilt"},
            "images": []
        },
        {
            "name": "Nordic Minimalist LED Desk Lamp with Wireless Charger",
            "slug": "nordic-led-desk-lamp",
            "category": cat_home,
            "description": "Architectural desk lighting with 5 color temperatures, step-less dimming touch bar, and integrated 15W Qi fast wireless phone charging pad.",
            "price": 89.99,
            "discount_price": 69.99,
            "stock": 30,
            "image": "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=800&q=80",
            "is_featured": False,
            "specs": {"Light Source": "Eye-care LED", "Wireless Output": "15W Qi Fast Charge", "Color Temp": "2700K - 6500K"},
            "images": []
        },
        {
            "name": "Chronograph Gold & Sapphire Wristwatch",
            "slug": "gold-sapphire-chronograph-watch",
            "category": cat_accessories,
            "description": "Swiss movement chronograph with scratch-resistant sapphire crystal glass, 18k gold PVD coating, and genuine alligator pattern leather strap.",
            "price": 850.00,
            "discount_price": 720.00,
            "stock": 7,
            "image": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
            "is_featured": True,
            "specs": {"Movement": "Swiss Quartz Chronograph", "Dial Diameter": "42mm", "Glass": "Sapphire Crystal", "Strap": "Genuine Leather"},
            "images": []
        },
        {
            "name": "Heritage Canvas & Leather Travel Backpack",
            "slug": "heritage-canvas-leather-backpack",
            "category": cat_accessories,
            "description": "Rugged water-resistant waxed canvas combined with full-grain leather straps. Padded 15-inch laptop compartment and quick-access magnetic brass buckles.",
            "price": 159.99,
            "discount_price": 129.99,
            "stock": 18,
            "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
            "is_featured": True,
            "specs": {"Capacity": "28 Liters", "Laptop Compartment": "Up to 15.6\"", "Material": "16oz Waxed Canvas & Leather"},
            "images": []
        },
        {
            "name": "Barista Deluxe Espresso & Cappuccino Machine",
            "slug": "barista-deluxe-espresso-machine",
            "category": cat_home,
            "description": "19-bar high-pressure Italian pump for rich crematous espresso. Commercial-grade steam wand for micro-foam latte art and precise digital temperature control.",
            "price": 599.99,
            "discount_price": 499.99,
            "stock": 10,
            "image": "https://images.unsplash.com/photo-1517668808822-9eaa03afd2af?w=800&q=80",
            "is_featured": False,
            "specs": {"Pressure": "19 Bar", "Water Tank": "2.0 Liters", "Grinder": "Conical Burr Grinder Built-in"},
            "images": []
        }
    ]

    for item in products_data:
        images = item.pop("images", [])
        product = Product.objects.create(**item)

        for img_url in images:
            ProductImage.objects.create(product=product, image_url=img_url)

        # Create sample reviews
        Review.objects.create(
            product=product,
            user=user,
            name="John Doe",
            rating=5,
            comment="Absolutely incredible quality! Exceeded my expectations in design and functionality."
        )
        Review.objects.create(
            product=product,
            user=user,
            name="Sarah Jenkins",
            rating=4,
            comment="Great build quality and very fast delivery. Highly recommended!"
        )
        product.update_rating()

    print(f"Successfully seeded {len(products_data)} products with reviews and images!")

if __name__ == '__main__':
    run_seed()
