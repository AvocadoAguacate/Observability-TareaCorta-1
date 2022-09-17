from flask import Flask
from flask_sqlalchemy import SQLAlchemy



app = Flask (__name__)
app.config ['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:rootroot@10.104.37.233/sampleDB'
db = SQLAlchemy(app)


@app.route('/')
def index():
    return "<h1> Hola a todos </h>"



if __name__ == "__main__":
    app.run()