import itertools
import json
out = []
for n in range(6):
    for t in itertools.combinations((1, 2, 3, 4, 5), n):
        # ans = '00000'
        # for i in t:
        #     ans = ans[:i-1] + "1" + ans[i:]
        out.append(t)
print(json.dumps(out))