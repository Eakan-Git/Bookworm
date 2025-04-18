from database.postgres import PostgresDatabase

db_instance = PostgresDatabase()

def get_db_session():
    db = next(db_instance.get_session())
    try:
        yield db
    finally:
        db.close()