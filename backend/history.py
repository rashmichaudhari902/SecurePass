# history.py — Linked List for Password History

class PasswordNode:
    def __init__(self, password, generated_at):
        self.password     = password
        self.generated_at = generated_at
        self.next         = None


class PasswordHistoryList:
    def __init__(self):
        self.head = None
        self.size = 0

    def append(self, password, generated_at):
        """Add new password at the end of list"""
        new_node = PasswordNode(password, generated_at)
        
        if self.head is None:
            self.head = new_node
        else:
            current = self.head
            while current.next is not None:
                current = current.next
            current.next = new_node
        
        self.size += 1

    def load_from_db(self, db_rows):
        """Load history from MySQL rows into linked list"""
        for row in db_rows:
            self.append(row["password"], row["generated_at"])

    def traverse(self):
        """Return all passwords as a list — oldest to newest"""
        result  = []
        current = self.head
        while current is not None:
            result.append({
                "password":     current.password,
                "generated_at": str(current.generated_at)
            })
            current = current.next
        return result

    def get_latest(self):
        """Return the most recent password"""
        if self.head is None:
            return None
        current = self.head
        while current.next is not None:
            current = current.next
        return {
            "password":     current.password,
            "generated_at": str(current.generated_at)
        }

    def is_empty(self):
        return self.head is None