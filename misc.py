import time
import random

# 已知税率序列（题目中给的）
known_tax_rates = [21, 72, 21, 14, 68, 59, 3, 92, 69, 41]

# 设置爆破时间范围（你要根据实际抓包或开始时间调整）
now = int(time.time())
for possible_seed in range(now - 90, now + 10):  # ±90秒，保险起见
    random.seed(possible_seed)
    sequence = [random.randint(0, 99) for _ in range(20)]  # 多生成一些
    for offset in range(0, 11):  # 税率可能从第 offset 个开始
        if sequence[offset:offset+10] == known_tax_rates:
            print(f"[+] 找到匹配种子: {possible_seed}")
            print(f"[+] 下一轮税率可能是: {sequence[offset+10]}")
            exit()

print("[-] 没找到匹配项")
