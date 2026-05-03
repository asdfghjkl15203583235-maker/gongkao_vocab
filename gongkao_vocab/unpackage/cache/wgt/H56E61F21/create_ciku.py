# 放项目根目录运行
import json
from pathlib import Path

words = json.loads(Path("data/words.json").read_text(encoding="utf-8"))
js = f"window.WORDS_DATA = {json.dumps(words, ensure_ascii=False, indent=2)};"
Path("js/words-data.js").write_text(js, encoding="utf-8")
print(f"✅ 生成完成，共 {len(words)} 个词")