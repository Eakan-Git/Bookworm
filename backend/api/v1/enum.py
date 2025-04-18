from enum import Enum


class SortDirection(str, Enum):
    """Sort direction enum for query parameters"""
    ASC = "asc"
    DESC = "desc"


class BookSortField(str, Enum):
    """Fields that can be used for sorting books"""
    ON_SALE = "on_sale"
    POPULARITY = "popularity"
    PRICE = "price"
