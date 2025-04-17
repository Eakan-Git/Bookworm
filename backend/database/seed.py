import random
from datetime import timedelta, date
from decimal import Decimal
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
        today = date.today()
        
        # Create a dictionary to track books that already have discounts
        # and their discount periods
        book_discount_periods = {}
        
        # Create discounts ensuring no overlapping periods for the same book
        discounts = []
        
        # Select books that will have multiple discounts (about 30% of books)
        num_books_with_multiple = min(len(books) // 3, num_discounts // 2)
        books_for_multiple_discounts = random.sample(books, num_books_with_multiple)
        
        print(f"Selected {len(books_for_multiple_discounts)} books to have multiple discount periods")
        
        # First, create one discount for each selected book (guaranteed multiple discounts)
        for book in books_for_multiple_discounts:
            # Create first discount period (past discount)
            past_start = today - timedelta(days=random.randint(60, 90))
            past_end = today - timedelta(days=random.randint(10, 30))
            
            past_discount = Discount(
                book_id=book.id,
                discount_start_date=past_start,
                discount_end_date=past_end,
                discount_price=Decimal(str(round(float(book.book_price) * random.uniform(0.6, 0.8), 2)))
            )
            discounts.append(past_discount)
            
            # Track this period
            if book.id not in book_discount_periods:
                book_discount_periods[book.id] = []
            book_discount_periods[book.id].append((past_start, past_end))
            
            # Create second discount period (future discount)
            future_start = today + timedelta(days=random.randint(10, 30))
            future_end = today + timedelta(days=random.randint(60, 90))
            
            future_discount = Discount(
                book_id=book.id,
                discount_start_date=future_start,
                discount_end_date=future_end,
                discount_price=Decimal(str(round(float(book.book_price) * random.uniform(0.5, 0.7), 2)))
            )
            discounts.append(future_discount)
            
            # Track this period
            book_discount_periods[book.id].append((future_start, future_end))
        
        # Calculate how many more discounts we need
        remaining_discounts = num_discounts - (len(books_for_multiple_discounts) * 2)
        
        # Now create random discounts for the remaining count
        discount_count = len(discounts)
        max_attempts = remaining_discounts * 3  # Allow multiple attempts to find non-overlapping periods
        attempts = 0
        
        while discount_count < num_discounts and attempts < max_attempts:
            # Select a random book
            book = random.choice(books)
            
            # Generate random dates - some current, some past, some future
            date_type = random.choice(['current', 'past', 'future'])
            
            if date_type == 'current':
                # Current discount
                start_date = today - timedelta(days=random.randint(1, 10))
                end_date = today + timedelta(days=random.randint(1, 30))
            elif date_type == 'past':
                # Past discount (expired)
                start_date = today - timedelta(days=random.randint(60, 90))
                end_date = today - timedelta(days=random.randint(5, 30))
            else:
                # Future discount (not yet active)
                start_date = today + timedelta(days=random.randint(5, 30))
                end_date = today + timedelta(days=random.randint(40, 90))
            
            # Skip if end_date is before start_date
            if end_date <= start_date:
                attempts += 1
                continue
                
            # Check if this book already has discounts
            if book.id in book_discount_periods:
                # Check for overlap with existing periods
                overlap = False
                for existing_start, existing_end in book_discount_periods[book.id]:
                    if start_date <= existing_end and end_date >= existing_start:
                        overlap = True
                        break
                        
                if overlap:
                    attempts += 1
                    continue
            else:
                # First discount for this book
                book_discount_periods[book.id] = []
            
            # No overlap, create the discount
            discount_price = Decimal(str(round(float(book.book_price) * random.uniform(0.5, 0.9), 2)))
            
            discount = Discount(
                book_id=book.id,
                discount_start_date=start_date,
                discount_end_date=end_date,
                discount_price=discount_price
            )
            
            # Add to our tracking dictionary
            book_discount_periods[book.id].append((start_date, end_date))
            
            # Add to our list of discounts
            discounts.append(discount)
            discount_count += 1
        
        print(f"Successfully created {len(discounts)} non-overlapping discounts")
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
