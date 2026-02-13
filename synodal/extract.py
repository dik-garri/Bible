import json
import sys

passages = [
    ("lk.json", 9, 1, 9, 17, "Тема 61: Насыщение 5000"),
    ("mt.json", 14, 22, 14, 36, "Тема 62: Хождение по воде"),
    ("jo.json", 9, 1, 9, 41, "Тема 63: Исцеление слепорожденного"),
    ("mk.json", 5, 1, 5, 20, "Тема 64: Исцеление бесноватого"),
    ("jo.json", 11, 1, 11, 57, "Тема 65: Воскрешение Лазаря"),
    ("lk.json", 22, 1, 22, 39, "Тема 66: Тайная Вечеря"),
    ("jo.json", 18, 1, 18, 40, "Тема 67: Арест и суд"),
    ("jo.json", 19, 1, 19, 42, "Тема 68: Распятие"),
    ("jo.json", 20, 1, 21, 25, "Тема 69: Воскресение Христа"),
    ("act.json", 1, 1, 1, 11, "Тема 70: Вознесение Христа"),
]

import os
base = os.path.dirname(os.path.abspath(__file__))

for filename, ch_start, v_start, ch_end, v_end, label in passages:
    filepath = os.path.join(base, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"\n{'='*60}")
    print(f"{label} ({filename} {ch_start}:{v_start}-{ch_end}:{v_end})")
    print('='*60)
    for ch in range(ch_start, ch_end + 1):
        ch_data = data[ch - 1]
        v_from = v_start if ch == ch_start else 1
        v_to = v_end if ch == ch_end else len(ch_data)
        for v in range(v_from, v_to + 1):
            if v - 1 < len(ch_data):
                print(f"{ch}:{v} {ch_data[v-1]}")
