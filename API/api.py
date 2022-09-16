from ast import Global
from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy


app = Flask (__name__)
app.config ['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:rootroot@localhost:5432/sampleDB'
db = SQLAlchemy(app)


class Vgsales(db.Model):
    __tablename__='vgsales'
    Rank=db.Column(db.Integer,primary_key=True)
    Name=db.Column(db.String(200))
    Platform=db.Column(db.String(50))
    Year=db.Column(db.Integer)
    Genre=db.Column(db.String(40))
    Publisher=db.Column(db.String(40))
    NA_Sales=db.Column(db.Float)
    EU_Sales=db.Column(db.Float)
    JP_Sales=db.Column(db.Float)
    Other_Sales=db.Column(db.Float)
    Global_Sales=db.Column(db.Float)

def __init__(self,Rank,Name,Platform,Year,Genre,Publisher,NA_Sales,EU_Sales,JP_Sales,
Other_Sales,Global_Sales):
    self.Rank=Rank
    self.Name=Name
    self.Platform = Platform
    self.Year=Year
    self.Genre=Genre
    self.Publisher=Publisher
    self.NA_Sales=NA_Sales
    self.EU_Sales=EU_Sales
    self.JP_Sales=JP_Sales
    self.Other_Sales=Other_Sales
    self.Global_Sales=Global_Sales


@app.route('/')
def index():
    return "hola a todos"

@app.route('/obtain')
def getting():
    query = db.session.query(Vgsales)
    db.session.query(Vgsales)
    print(query)

    for result in query:
        print(result)

    return query


if __name__ == "__main__":
    app.run()