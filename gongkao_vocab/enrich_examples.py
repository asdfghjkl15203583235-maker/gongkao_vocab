"""
enrich_examples.py
为 words.json 中每个词汇添加例句（example 字段）

- 优先联网搜索历年公考真题原句
- 搜不到则让 Qwen 生成公考风格例句
- 每次运行自动跳过已有例句的词，支持中断续跑
- 每处理 10 个词自动保存一次，防止崩溃丢进度

依赖：
    pip install openai

API Key：从系统环境变量 DASHSCOPE_API_KEY 读取
"""

import os
import json
import time
import sys
from pathlib import Path
from openai import OpenAI

# ── 配置 ──────────────────────────────────────────────────
WORDS_PATH   = Path("data/words.json")
BACKUP_PATH  = Path("data/words_backup.json")   # 运行前自动备份
MODEL        = "qwen-plus-2025-04-28"                       # 支持联网搜索
SAVE_EVERY   = 10                                # 每处理 N 个词保存一次
SLEEP_SEC    = 1.5                               # 每次请求间隔（防限流）
# ─────────────────────────────────────────────────────────


def get_client():
    api_key = os.environ.get("DASHSCOPE_API_KEY")
    if not api_key:
        print("❌ 未找到环境变量 DASHSCOPE_API_KEY，请先设置")
        sys.exit(1)
    return OpenAI(
        api_key=api_key,
        base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
    )


def build_prompt(word: dict) -> str:
    return f"""你是一位公务员考试（行测/申论）专家。请为以下词语提供 2 个高质量例句。

词语：{word['word']}
释义：{word['meaning']}
类型：{word.get('type', '成语')}

要求：
1. 请先联网搜索，查找该词语是否在历年国考、省考、联考的行测或申论真题中出现过。
   - 如果找到真实真题原句，直接使用，并在句子末尾标注来源，格式：（出自：XXXX年XX省考行测真题）
   - 如果没有找到真实真题，生成符合公考出题风格的例句，末尾标注：（模拟例句）

2. 例句要求：
   - 每句 20-50 字，语言正式，符合政府文件或新闻报道风格
   - 能清晰体现词语含义
   - 两个例句场景不同（一个侧重文化/历史，一个侧重政治/治理或经济/社会）

3. 严格按以下 JSON 格式返回，不要有任何额外文字：
{{
  "examples": [
    "第一个例句（出自：来源 或 模拟例句）",
    "第二个例句（出自：来源 或 模拟例句）"
  ]
}}"""


def fetch_examples(client: OpenAI, word: dict, retry: int = 3) -> list[str]:
    prompt = build_prompt(word)

    for attempt in range(retry):
        try:
            resp = client.chat.completions.create(
                model=MODEL,
                messages=[{"role": "user", "content": prompt}],
                # extra_body={"enable_search": True},   # 开启联网搜索
                temperature=0.3,
                max_tokens=400,
            )
            content = resp.choices[0].message.content.strip()

            # 清理可能的 markdown 代码块
            content = content.replace("```json", "").replace("```", "").strip()

            data = json.loads(content)
            examples = data.get("examples", [])

            # 确保是两条
            if len(examples) >= 2:
                return examples[:2]
            elif len(examples) == 1:
                return examples + [examples[0]]  # 复用第一条填充
            else:
                raise ValueError("例句数量不足")

        except json.JSONDecodeError:
            # 模型没有严格返回 JSON，尝试从文本中提取
            lines = [l.strip() for l in content.split('\n') if l.strip() and not l.startswith('{') and not l.startswith('}')]
            sentences = [l.lstrip('1234567890.-、。"') for l in lines if len(l) > 10]
            if len(sentences) >= 2:
                return sentences[:2]
            print(f"  ⚠️  JSON 解析失败，第 {attempt+1} 次重试...")

        except Exception as e:
            print(f"  ⚠️  请求失败（{e}），第 {attempt+1} 次重试...")
            time.sleep(3)

    # 全部重试失败，返回占位符
    return [f"{word['word']}：（例句生成失败，请手动补充）", ""]


def main():
    # 读取词库
    if not WORDS_PATH.exists():
        print(f"❌ 找不到 {WORDS_PATH}")
        sys.exit(1)

    with open(WORDS_PATH, encoding="utf-8") as f:
        words = json.load(f)

    total = len(words)
    print(f"📖 词库共 {total} 个词")

    # 统计已有例句的词
    already_done = sum(1 for w in words if w.get("examples") and len(w["examples"]) >= 2)
    todo = total - already_done
    print(f"✅ 已有例句：{already_done} 个 | 待处理：{todo} 个")

    if todo == 0:
        print("🎉 所有词汇已有例句，无需处理")
        return

    # 备份原文件
    import shutil
    shutil.copy(WORDS_PATH, BACKUP_PATH)
    print(f"💾 已备份原文件到 {BACKUP_PATH}")

    # 初始化 API 客户端
    client = get_client()

    processed = 0
    failed    = 0

    print(f"\n开始处理，模型：{MODEL}，联网搜索：未开启\n{'─'*50}")

    for i, word in enumerate(words):
        # 跳过已有例句的
        if word.get("examples") and len(word["examples"]) >= 2 \
                and "生成失败" not in word["examples"][0]:
            continue

        word_text = word.get("word", "?")
        print(f"[{processed+1}/{todo}] {word_text} ({word.get('group','')})...")

        examples = fetch_examples(client, word)
        word["examples"] = examples

        # 打印结果预览
        for j, ex in enumerate(examples, 1):
            preview = ex[:50] + ("..." if len(ex) > 50 else "")
            print(f"    例{j}：{preview}")

        processed += 1

        # 定期保存
        if processed % SAVE_EVERY == 0:
            with open(WORDS_PATH, "w", encoding="utf-8") as f:
                json.dump(words, f, ensure_ascii=False, indent=2)
            print(f"  💾 已保存进度（{processed}/{todo}）\n")

        time.sleep(SLEEP_SEC)

    # 最终保存
    with open(WORDS_PATH, "w", encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False, indent=2)

    print(f"\n{'─'*50}")
    print(f"✅ 完成！成功：{processed} 个，失败：{failed} 个")
    print(f"📁 已写回 {WORDS_PATH}")
    print(f"📁 原始备份保留在 {BACKUP_PATH}")


if __name__ == "__main__":
    main()