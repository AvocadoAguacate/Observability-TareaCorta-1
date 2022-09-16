const {Client} = require ('pg')


const client = new Client ( {
    host : "10.104.37.233" ,
    user : "postgres" ,
    port : 5432,
    password : "rootroot" ,
    database : "sampleDB"
} )
    
client.connect ( ) ;
client.query ('Select * from vgsales' , ( err , res ) => {
    if (!err) {console.log ( res.rows ) ;
    } 
    else {console.log ( err.message ) ; 
    }
    client.end ;
})