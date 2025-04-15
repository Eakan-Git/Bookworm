from fastapi import APIRouter, HTTPException
from fastapi import status


router = APIRouter()

# Mock user data
mock_users = [
    {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "admin": False
    },
    {
        "id": 2,
        "first_name": "Jane",
        "last_name": "Smith",
        "email": "jane.smith@example.com",
        "admin": True
    },
    {
        "id": 3,
        "first_name": "Alice",
        "last_name": "Johnson",
        "email": "alice.johnson@example.com",
        "admin": False
    },
    {
        "id": 4,
        "first_name": "Bob",
        "last_name": "Brown",
        "email": "bob.brown@example.com",
        "admin": True
    }
]


@router.get("/users", summary="Get all users", status_code=status.HTTP_200_OK)
async def get_users():
    return mock_users


@router.get("/users/{user_id}", summary="Get user by ID", status_code=status.HTTP_200_OK)
async def get_user(user_id: int):
    user = next((user for user in mock_users if user["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.post("/users", summary="Create a new user", status_code=status.HTTP_201_CREATED)
async def create_user(user: dict):
    new_user = {"id": len(mock_users) + 1, **user}
    mock_users.append(new_user)
    return new_user


@router.delete("/users/{user_id}", summary="Delete a user by ID", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int):
    global mock_users
    mock_users = [user for user in mock_users if user["id"] != user_id]
    return {"message": "User deleted successfully"}
