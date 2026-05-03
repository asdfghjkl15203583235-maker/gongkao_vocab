from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    # 创建正方形画布
    img = Image.new('RGB', (size, size), color='#1e40af')
    draw = ImageDraw.Draw(img)

    try:
        # 尝试使用中文字体
        font = ImageFont.truetype("C:/Windows/Fonts/simhei.ttf", size // 3)
    except:
        try:
            # 如果没有中文字体，使用默认字体
            font = ImageFont.load_default()
        except:
            font = None

    # 绘制文字
    text = "词"
    if font:
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        x = (size - text_width) // 2
        y = (size - text_height) // 2
        draw.text((x, y), text, fill='white', font=font)
    else:
        # 没有字体，画一个简单的圆形
        draw.ellipse([size//4, size//4, 3*size//4, 3*size//4], fill='white')

    # 保存图标
    img.save(filename, 'PNG')
    print(f"已创建 {filename}")

# 创建图标
create_icon(192, 'icons/icon-192.png')
create_icon(512, 'icons/icon-512.png')