//const app = express();
const express  = require("express")
const mysql  = require("mysql")
const bodyParser = require("body-parser")

const app = express();

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
});

/* configure the database */

var con = mysql.createConnection({
    //host: "localhost",
    host: "spe-devops.cmzkozignxdl.ap-south-1.rds.amazonaws.com",
    //host: "covidregion2db.cmzkozignxdl.ap-south-1.rds.amazonaws.com",
    user: "root",
    //password: "root"
    password: "root1234"
});
  
con.connect(function (err) {
    if (err) console.log(err);
    console.log("connected");
});
  
sql = "use CDB";
con.query(sql, function (err, res) {
    if (err) console.log(err);
    console.log(res);
});

/* REST API */

app.get("/", function (req, res, next) {
    res.json({
      message: "Backend working"
    });
})

app.post("/onSubmit",(req,res)=>{
    console.log("Request received");
    console.log(req.body);
    res.send("Success");
})

app.post('/addPersonDetails',(req,res)=>{
    console.log(req.body);
    sql = "Insert Into Person_Details values(?,?,?,?,?)"
    con.query(sql,[req.body.PersonID,req.body.Address,req.body.City,req.body.State,req.body.Infected],(err,response)=>{
        if(err) {
            console.log(err)
            res.send(err);
        }    

        res.send(true);
    })
})

app.post("/addTravelDetails",(req,res)=>{
    console.log(req.body);
    
    locationArray = req.body.LocationArray;
    for(var i=0;i<locationArray.length;i++){
        var location = locationArray[i];
        sql = "Insert Into Travel_Details values(?,?,?,?,?,?,?)"
        con.query(sql,[location.PersonID,location.Location,location.Latitude,location.Longitude,location.FromTime,location.ToTime,location.Mode_of_Transportation],(err,response)=>{
            if(err){
                console.log(err)
                res.send(err);    
            }    
        })
    }
    res.send(true);    
})



app.post("/getTravelData",(req,res)=>{
    sql = `SELECT * FROM Person_Details Natural JOIN Travel_Details
           WHERE (From_Time BETWEEN ? AND ?) OR 
           (To_Time BETWEEN ? AND ?) OR
           (? BETWEEN From_Time AND To_Time)`;

    //console.log("[\n"+req.body.startdate+"\n]")

    con.query(sql,[req.body.startdate, req.body.enddate, req.body.startdate, req.body.enddate, req.body.startdate],(err,response)=>{
        if(err) {
            console.log(err)
            console.log("Error");
            res.send(false);
        }
        //console.log(sql);
        if(response.length>0){
            console.log(response);
            console.log(response[0]);
            var cur = response[0];
            var d = new Date(cur.From_Time);
            console.log(d.toLocaleString());    
            console.log(d.toLocaleDateString());    
            console.log(d.toString());

            response.forEach((d)=>{
                d.From_Time = new Date(d.From_Time).toLocaleString();
                d.To_Time = new Date(d.To_Time).toLocaleString();
            })
            console.log(response);
        }    
        res.send(response);
    })    
})


app.get("/getAllTravelData",(req,res)=>{
    sql = `SELECT * FROM Person_Details Natural JOIN Travel_Details`;
    //console.log("[\n"+req.body.startdate+"\n]")

    con.query(sql,(err,response)=>{
        if(err) {
            console.log(err)
            console.log("Error");
            res.send(false);
        }
        //console.log(sql);
        console.log(response);
        console.log(response[0]);
        var cur = response[0];
        var d = new Date(cur.From_Time);
        // console.log(d.toLocaleString());    
        // console.log(d.toLocaleDateString());    
        // console.log(d.toString());

        response.forEach((d)=>{
            d.From_Time = new Date(d.From_Time).toLocaleString();
            d.To_Time = new Date(d.To_Time).toLocaleString();
        })
        console.log(response);
        res.send(response);
    })    
})

module.exports = app;