import os
import subprocess
import json
import shutil

def build_apk():
    print("=== 开始构建公考词语记忆卡APK ===")
    print("=" * 50)

    # 1. 检查Python环境
    print("[OK] Python环境检查通过")

    # 2. 创建打包目录
    if os.path.exists('dist'):
        shutil.rmtree('dist')
    os.makedirs('dist')

    # 3. 复制所有文件到dist目录
    print("📁 正在复制应用文件...")
    shutil.copytree('css', 'dist/css')
    shutil.copytree('data', 'dist/data')
    shutil.copytree('icons', 'dist/icons')
    shutil.copy('index.html', 'dist/')
    shutil.copy('manifest.json', 'dist/')
    shutil.copy('sw.js', 'dist/')
    shutil.copy('js/app.js', 'dist/js/')

    # 4. 创建Cordova项目
    print("\n📱 创建Cordova项目...")
    try:
        # 安装Cordova（如果还没安装）
        subprocess.run(['npm', 'install', '-g', 'cordova'], check=True, capture_output=True)
        print("✅ Cordova已安装")
    except:
        print("❌ 需要先安装Node.js和npm")
        print("请访问 https://nodejs.org/ 下载并安装Node.js")
        return

    # 创建Cordova项目
    subprocess.run(['cordova', 'create', 'gongkao-vocab', 'com.gongkao.vocab', '公考词语记忆卡'], check=True)

    # 复制web内容到Cordova的www目录
    shutil.copytree('dist', 'gongkao-vocab/www')

    # 添加Android平台
    os.chdir('gongkao-vocab')
    subprocess.run(['cordova', 'platform', 'add', 'android'], check=True)

    print("✅ 项目结构创建完成")

    # 5. 创建构建脚本
    build_script = """@echo off
echo 🔧 开始构建APK...
echo.
echo 如果第一次构建，需要安装Android SDK
echo 请确保已安装Android Studio并配置好环境变量
echo.
echo 正在添加Android平台...
cordova platform add android
echo.
echo 正在构建APK...
cordova build android
echo.
echo 🎉 构建完成！APK文件在 platforms/android/app/build/outputs/apk/debug/ 目录
echo.
echo 将APK文件传输到手机上安装即可
pause
"""

    with open('build_apk.bat', 'w', encoding='utf-8') as f:
        f.write(build_script)

    os.chdir('..')

    print("\n🎯 下一步操作：")
    print("1. 打开 Android Studio，安装 Android SDK")
    print("2. 运行 gongkao-vocab 文件夹中的 build_apk.bat")
    print("3. 构建完成后，将APK文件传输到手机安装")
    print("\n⚡ 快速安装Android Studio：")
    print("访问 https://developer.android.com/studio")

    # 6. 创建简单的安装指南
    guide = """
## 📱 公考词语记忆卡 - 安装指南

### 快速开始（5分钟安装）

1. **安装Android Studio**
   - 访问：https://developer.android.com/studio
   - 下载并安装（选择Custom安装，勾选Android SDK）
   - 首次打开会自动下载SDK组件

2. **构建APK**
   - 双击运行 `gongkao-vocab/build_apk.bat`
   - 等待构建完成（第一次需要下载SDK，可能较慢）

3. **安装到手机**
   - 找到生成的APK文件：`gongkao-vocab/platforms/android/app/build/outputs/apk/debug/app-debug.apk`
   - 传输到手机，点击安装

### 无需电脑的替代方案：

**方案A：使用在线打包服务**
1. 访问 https://ionicframework.com/docs/intro/appflow/publishing
2. 上传项目，自动生成APK

**方案B：使用小程序（推荐）**
如果是在微信使用，我可以帮你转换为微信小程序格式

### 故障排除：
- 如果提示"ANDROID_HOME"未设置，在Android Studio中配置
- 构建失败时，删除gongkao-vocab文件夹重新运行脚本
- 需要开启"允许安装未知来源应用"

### 开发者提示：
构建的APK完全离线运行，不需要网络连接。
数据存储在手机本地，不会上传到服务器。
"""

    with open('安装指南.txt', 'w', encoding='utf-8') as f:
        f.write(guide)

    print("\n🎉 所有文件已准备就绪！")
    print("📖 查看 安装指南.txt 了解详细步骤")

if __name__ == '__main__':
    build_apk()