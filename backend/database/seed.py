import random
from faker import Faker

from models.user import User
from models.author import Author
from models.category import Category
from models.book import Book
from models.order import Order
from models.order_item import OrderItem
from models.review import Review
from models.discount import Discount

from database.postgres import PostgresDatabase

fake = Faker()


def seed_data(num_users=10, num_authors=5, num_categories=3, num_books=20, 
              num_orders=15, num_reviews=30, num_discounts=8):
    """
    Seed the database with test data.
    
    Parameters:
    - num_users: Number of user records to create
    - num_authors: Number of author records to create
    - num_categories: Number of category records to create
    - num_books: Number of book records to create
    - num_orders: Number of order records to create
    - num_reviews: Number of review records to create
    - num_discounts: Number of discount records to create
    """
    print("Starting database seeding process...")
    
    db = next(PostgresDatabase().get_session())
    
    try:
        # 1. Create Users
        print(f"Creating {num_users} users...")
        users = [
            User(
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                email=fake.email(),
                password=fake.password(length=12),
                admin=i < 2  # Make first two users admins
            )
            for i in range(num_users)
        ]
        db.add_all(users)
        db.commit()
        
        # 2. Create Authors
        print(f"Creating {num_authors} authors...")
        authors = [
            Author(
                author_name=fake.name(),
                author_bio=fake.paragraph(nb_sentences=3)
            )
            for _ in range(num_authors)
        ]
        db.add_all(authors)
        db.commit()
        
        # 3. Create Categories
        print(f"Creating {num_categories} categories...")
        category_names = ["Fiction", "Non-Fiction", "Science", "History", "Biography", 
                         "Fantasy", "Mystery", "Romance", "Self-Help", "Technology"]
        categories = [
            Category(
                category_name=category_names[i] if i < len(category_names) else fake.word().capitalize(),
                category_desc=fake.sentence()
            )
            for i in range(num_categories)
        ]
        db.add_all(categories)
        db.commit()
        
        # 4. Create Books
        print(f"Creating {num_books} books...")
        books = [
            Book(
                book_title=fake.sentence(nb_words=4)[:-1],
                book_summary=fake.paragraph(),
                book_price=Decimal(str(round(random.uniform(9.99, 49.99), 2))),
                book_cover_photo=f"cover_{i+1}.jpg",
                category_id=random.choice(categories).id,
                author_id=random.choice(authors).id
            )
            for i in range(num_books)
        ]
        db.add_all(books)
        db.commit()
        
        print(f"Creating {num_discounts} discounts...")
        discount_books = random.sample(books, min(num_discounts, len(books)))
        
        today = date.today()
        discounts = [
            Discount(
                book_id=book.id,
                discount_start_date=today - timedelta(days=random.randint(0, 30)),
                discount_end_date=today + timedelta(days=random.randint(1, 90)),
                discount_price=Decimal(str(round(float(book.book_price) * random.uniform(0.5, 0.9), 2)))
            )
            for book in discount_books
        ]
        db.add_all(discounts)
        db.commit()
        
        # 6. Create Orders and Order Items
        print(f"Creating {num_orders} orders with items...")
        orders = []
        order_items = []
        
        for _ in range(num_orders):
            # Create order
            user = random.choice(users)
            order_date = fake.date_time_between(start_date="-1y", end_date="now")
            
            # Select random books for this order (1-5 books per order)
            order_books = random.sample(books, random.randint(1, min(5, len(books))))
            
            order = Order(
                user_id=user.id,
                order_date=order_date,
                # Order amount will be calculated after order items are created
            )
            db.add(order)
            db.flush()  # Get the order ID without committing transaction
            
            # Create order items for this order
            items_total = Decimal('0.00')
            for book in order_books:
                quantity = random.randint(1, 3)
                price = book.book_price
                
                # Check if book has an active discount at order date
                active_discount = db.query(Discount).filter(
                    Discount.book_id == book.id,
                    Discount.discount_start_date <= order_date.date(),
                    (Discount.discount_end_date >= order_date.date()) | (Discount.discount_end_date.is_(None))
                ).first()
                
                if active_discount:
                    price = active_discount.discount_price
                
                item = OrderItem(
                    order_id=order.id,
                    book_id=book.id,
                    quantity=quantity,
                    price=price
                )
                db.add(item)
                
                # Calculate total for this item
                items_total += price * Decimal(str(quantity))
            
            # Update order with total amount
            order.order_amount = items_total
            db.flush()
        
        db.commit()
        
        # 7. Create Reviews
        print(f"Creating {num_reviews} reviews...")
        for _ in range(num_reviews):
            book = random.choice(books)
            
            review = Review(
                book_id=book.id,
                review_title=fake.sentence(nb_words=5)[:-1],
                review_details=fake.paragraph(),
                review_date=fake.date_time_between(start_date="-1y", end_date="now"),
                rating_star=round(random.uniform(1, 5), 1)
            )
            db.add(review)
        
        db.commit()
        print("Database seeding completed successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()
