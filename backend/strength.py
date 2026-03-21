# strength.py — Graph-based Password Strength Analyzer

class PasswordStrengthAnalyzer:
    def __init__(self):
        # Graph nodes — character types
        self.nodes = ["lowercase", "uppercase", "digit", "symbol"]
        
        # Graph edges — connections between character types
        self.edges = {
            "lowercase": ["uppercase", "digit", "symbol"],
            "uppercase": ["lowercase", "digit", "symbol"],
            "digit":     ["lowercase", "uppercase", "symbol"],
            "symbol":    ["lowercase", "uppercase", "digit"],
        }

    def _get_char_types(self, password):
        found = set()
        for ch in password:
            if ch.islower():
                found.add("lowercase")
            elif ch.isupper():
                found.add("uppercase")
            elif ch.isdigit():
                found.add("digit")
            else:
                found.add("symbol")
        return found

    def _count_active_edges(self, found_types):
        active_edges = 0
        counted = set()
        for node in found_types:
            for neighbor in self.edges[node]:
                if neighbor in found_types:
                    pair = tuple(sorted([node, neighbor]))
                    if pair not in counted:
                        counted.add(pair)
                        active_edges += 1
        return active_edges

    def analyze(self, password):
        if len(password) < 6:
            return {
                "score": 0,
                "label": "Weak",
                "color": "red",
                "types_found": [],
                "active_edges": 0
            }

        found_types  = self._get_char_types(password)
        active_edges = self._count_active_edges(found_types)

        # Scoring based on edges + length
        if active_edges >= 4 and len(password) >= 12:
            label = "Strong"
            color = "green"
            score = 3
        elif active_edges >= 2:
            label = "Medium"
            color = "orange"
            score = 2
        else:
            label = "Weak"
            color = "red"
            score = 1

        return {
            "score":        score,
            "label":        label,
            "color":        color,
            "types_found":  list(found_types),
            "active_edges": active_edges
        }