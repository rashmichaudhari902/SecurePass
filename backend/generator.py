# generator.py — Rule Engine + Password Generator

import random
import string

class PasswordGenerator:
    def __init__(self, rules):
        self.min_length    = rules.get("min_length", 12)
        self.max_length    = rules.get("max_length", 32)
        self.use_uppercase = rules.get("use_uppercase", True)
        self.use_lowercase = rules.get("use_lowercase", True)
        self.use_digits    = rules.get("use_digits", True)
        self.use_symbols   = rules.get("use_symbols", True)
        self.exclude_chars = rules.get("exclude_chars", "")

    def _build_charset(self):
        charset = ""
        guaranteed = []

        if self.use_lowercase:
            chars = ''.join(c for c in string.ascii_lowercase 
                          if c not in self.exclude_chars)
            charset += chars
            if chars:
                guaranteed.append(random.choice(chars))

        if self.use_uppercase:
            chars = ''.join(c for c in string.ascii_uppercase 
                          if c not in self.exclude_chars)
            charset += chars
            if chars:
                guaranteed.append(random.choice(chars))

        if self.use_digits:
            chars = ''.join(c for c in string.digits 
                          if c not in self.exclude_chars)
            charset += chars
            if chars:
                guaranteed.append(random.choice(chars))

        if self.use_symbols:
            chars = ''.join(c for c in string.punctuation 
                          if c not in self.exclude_chars)
            charset += chars
            if chars:
                guaranteed.append(random.choice(chars))

        return charset, guaranteed

    def generate(self):
        charset, guaranteed = self._build_charset()

        if not charset:
            raise ValueError("No characters available with current rules!")

        length = random.randint(self.min_length, self.max_length)

        # fill remaining characters
        remaining = length - len(guaranteed)
        random_chars = [random.choice(charset) for _ in range(remaining)]

        # mix guaranteed + random
        all_chars = guaranteed + random_chars
        random.shuffle(all_chars)

        return ''.join(all_chars)