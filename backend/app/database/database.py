from typing import List
from pymongo import MongoClient
from utils.settings import MONGO_URL, MONGO_ENVIROMENT


class DBConnection:
    def __init__(self) -> None:
        self.__client = MongoClient(MONGO_URL)
        self._connection = self.__client[MONGO_ENVIROMENT]

    def find_one(
        self, collection: str, query: dict, projection: dict = {"_id": 0}, **kwargs: any
    ) -> dict or bool:
        try:
            result = self._connection[collection].find_one(query, projection, **kwargs)
            return result
        except Exception as error:
            return None

    def find(
        self,
        collection: str,
        query: dict,
        projection: dict = {"_id": 0},
        **kwargs: any,
    ) -> list:
        try:
            result = list(
                self._connection[collection].find(query, projection, **kwargs)
            )

            return result
        except Exception as error:
            return []

    def aggregate(self, collection: str, pipeline: list = []) -> list or bool:
        try:
            result = list(self._connection[collection].aggregate(pipeline))
            return result
        except Exception as error:
            return None

    def insert_one(self, collection: str, dados: dict) -> bool:
        try:
            self._connection[collection].insert_one(dados)
            return True
        except Exception as error:
            return None

    def insert_many(self, collection: str, dados: List[dict]) -> bool:
        try:
            result = self._connection[collection].insert_many(dados)
            return result
        except Exception as error:
            return None

    def update_one(
        self, collection: str, filter: dict, update: dict, **kwargs: any
    ) -> bool:
        try:
            update = self._connection[collection].update_one(filter, update, **kwargs)
            if update.modified_count == 0:
                return None
            return True
        except Exception as error:
            return None

    def update_many(
        self, collection: str, filter: dict, update: dict, **kwargs: any
    ) -> bool:
        try:
            update = self._connection[collection].update_many(filter, update, **kwargs)
            if update.modified_count == 0:
                return None
            return True
        except Exception as error:
            return None

    def delete_one(self, collection: str, query: dict) -> bool | None:
        try:
            result = self._connection[collection].delete_one(query)
            return True if result.deleted_count > 0 else None
        except Exception as error:
            return None

    def delete_many(self, collection: str, query: dict) -> bool | None:
        try:
            result = self._connection[collection].delete_many(query)
            return True if result.deleted_count > 0 else None
        except Exception as error:
            return None
