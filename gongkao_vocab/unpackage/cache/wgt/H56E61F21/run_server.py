from flask import Flask, send_from_directory
import os

app = Flask(__name__)

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    # 设置host为0.0.0.0，允许外部访问
    # 设置port为8000
    app.run(host='0.0.0.0', port=8000, debug=True)