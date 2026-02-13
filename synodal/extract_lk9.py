#!/usr/bin/env python3
import json
with open('/Users/garrydik/projects/personal/k12/synodal/lk.json') as f:
    data = json.load(f)
ch_data = data[8]  # chapter 9 (0-indexed)
for v in range(0, 17):  # verses 1-17
    print(f"9:{v+1} {ch_data[v]}")
