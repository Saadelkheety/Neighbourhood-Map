from flask import Flask, render_template, request, redirect, url_for
app = Flask(__name__)  # instaniate an app


# Create anti-forgery state token
@app.route('/')
def index():
    return render_template("index.html")

if __name__ == '__main__':
    app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
    app.debug = True
    app.run(host='0.0.0.0', port=5000)
