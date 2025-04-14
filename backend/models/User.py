from sqlmodel import SQLModel, Field

class User(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True, sa_column_kwargs={"autoincrement": True, "type_": "BIGINT"})
    first_name: str
    last_name: str
    email: str
    password: str
    admin: bool = Field(default=False)