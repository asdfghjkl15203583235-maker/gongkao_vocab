"""
convert_words.py
把 MinerU 导出的 PDF JSON 转换成 App 可用的 words_mineru.json

使用方法：
    pip install beautifulsoup4
    python convert_words.py

输入：  data/words_mineru.json   （MinerU 原始文件）
输出：  data/words.json  （覆盖替换成这个再改名为 words_mineru.json）
"""

import json
import re
from pathlib import Path

try:
    from bs4 import BeautifulSoup
except ImportError:
    import subprocess, sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "beautifulsoup4"])
    from bs4 import BeautifulSoup


# ── 路径配置 ──────────────────────────────────────────────
INPUT_PATH  = Path("data/words_mineru.json")
OUTPUT_PATH = Path("data/words.json")


def parse_table_html(html: str) -> list[dict]:
    """解析带 rowspan 的 HTML 表格，返回词条列表"""
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find("table")
    if not table:
        return []

    # 先把所有行读出来，处理 rowspan/colspan
    rows = table.find_all("tr")
    grid = []          # grid[row][col] = cell text
    span_map = {}      # (row, col) -> remaining rowspan count + text

    for r_idx, row in enumerate(rows):
        cells = row.find_all("td")
        grid.append([])
        c_idx = 0
        cell_iter = iter(cells)

        while True:
            # 先填入来自上方 rowspan 的内容
            while (r_idx, c_idx) in span_map:
                text, remaining = span_map[(r_idx, c_idx)]
                grid[r_idx].append(text)
                if remaining > 1:
                    span_map[(r_idx + 1, c_idx)] = (text, remaining - 1)
                del span_map[(r_idx, c_idx)]
                c_idx += 1

            # 读下一个实际单元格
            try:
                cell = next(cell_iter)
            except StopIteration:
                break

            text = cell.get_text(separator=" ", strip=True)
            # 清理括号内的注记，如 "(删除)"
            text = re.sub(r'\(删除\)', '', text).strip()

            rowspan = int(cell.get("rowspan", 1))
            colspan = int(cell.get("colspan", 1))

            for _ in range(colspan):
                grid[r_idx].append(text)
                if rowspan > 1:
                    span_map[(r_idx + 1, c_idx)] = (text, rowspan - 1)
                c_idx += 1

    # 第一行是表头，跳过
    words = []
    seen_ids = set()

    for row in grid[1:]:
        if len(row) < 4:
            continue
        group   = row[0].strip()
        subgroup = row[1].strip()
        word    = row[2].strip()
        meaning = row[3].strip()

        # 跳过空行或只有标题的行
        if not word or not meaning:
            continue
        if word in ("成语", "词语", "实词"):
            continue

        # 清理 group 字段：提取组名
        # 例："【第一组】\n中华文明传统\n文化\n(5个)" -> "第一组"
        group_clean = re.sub(r'[【】\n\r]', '', group)
        group_clean = re.sub(r'\(\d+个\)', '', group_clean).strip()
        if not group_clean:
            group_clean = "其他"

        # 生成唯一 ID
        base_id = f"w_{word}"
        uid = base_id
        counter = 1
        while uid in seen_ids:
            uid = f"{base_id}_{counter}"
            counter += 1
        seen_ids.add(uid)

        words.append({
            "id":       uid,
            "word":     word,
            "pinyin":   "",          # MinerU 没有拼音，留空
            "meaning":  meaning,
            "group":    group_clean,
            "subgroup": subgroup,
            "type":     "成语",
        })

    return words


def extract_from_pdf_json(data) -> list[dict]:
    """遍历 MinerU JSON，找到所有 HTML 表格并解析"""
    all_words = []

    # 支持顶层是 list 或 dict（含 pdf_info 键）
    pages = []
    if isinstance(data, list):
        pages = data
    elif isinstance(data, dict):
        if "pdf_info" in data:
            pages = data["pdf_info"]
        else:
            # 可能整个 dict 就是一页
            pages = [data]

    for page in pages:
        if not isinstance(page, dict):
            continue
        para_blocks = page.get("para_blocks", [])
        for para in para_blocks:
            blocks = para.get("blocks", [])
            for block in blocks:
                lines = block.get("lines", [])
                for line in lines:
                    spans = line.get("spans", [])
                    for span in spans:
                        if span.get("type") == "table":
                            html = span.get("html", "")
                            if html:
                                words = parse_table_html(html)
                                all_words.extend(words)
    return all_words


def main():
    if not INPUT_PATH.exists():
        print(f"❌ 找不到输入文件：{INPUT_PATH}")
        print("请确认路径是否正确（相对于脚本所在目录）")
        return

    print(f"📖 读取：{INPUT_PATH}")
    with open(INPUT_PATH, encoding="utf-8") as f:
        data = json.load(f)

    words = extract_from_pdf_json(data)

    if not words:
        print("⚠️  未找到词条，请检查 JSON 结构是否匹配")
        return

    # 去重（同一个词可能出现在多页）
    seen = {}
    unique_words = []
    for w in words:
        if w["word"] not in seen:
            seen[w["word"]] = True
            unique_words.append(w)

    # 重新生成干净的 ID（w001, w002, ...）
    for i, w in enumerate(unique_words, 1):
        w["id"] = f"w{i:03d}"

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(unique_words, f, ensure_ascii=False, indent=2)

    print(f"✅ 转换完成！共 {len(unique_words)} 个词条")
    print(f"📁 输出：{OUTPUT_PATH}")
    print()
    print("下一步：")
    print("  将 data/words.json 重命名为 data/words_mineru.json（覆盖原文件）")
    print("  刷新浏览器即可看到词库")

    # 预览前5条
    print("\n── 预览前5条 ──")
    for w in unique_words[:5]:
        print(f"  [{w['group']}] {w['word']}：{w['meaning'][:30]}…")


if __name__ == "__main__":
    main()