# undo_stack.py — Stack for Undo Feature

class PasswordStack:
    def __init__(self):
        self.stack = []

    def push(self, password):
        """Har naye password ko stack pe push karo"""
        self.stack.append(password)

    def pop(self):
        """Undo — last password hatao aur return karo"""
        if self.is_empty():
            return None
        return self.stack.pop()

    def peek(self):
        """Current password dekho bina hataye"""
        if self.is_empty():
            return None
        return self.stack[-1]

    def is_empty(self):
        return len(self.stack) == 0

    def size(self):
        return len(self.stack)

    def clear(self):
        """Stack khali karo"""
        self.stack = []

    def get_all(self):
        """Saare passwords dekho — top se bottom tak"""
        return list(reversed(self.stack))