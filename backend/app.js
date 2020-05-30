//const app = express();
const express = require("express")
const mysql = require("mysql")
const bodyParser = require("body-parser")

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
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
    ///password: "root",
    password: "root1234",
    multipleStatements: true
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

/* REST APIs */

app.get("/", function (req, res, next) {
    res.json({
        message: "Backend working"
    });
})

app.post('/addPersonDetails', (req, res) => {
    console.log(req.body);

    try {
        addPersonDetails(res, [req.body]);
    }
    catch (e) {
        //do nothing
    }
})

app.post('/addAllPersonDetails', (req, res) => {
    console.log(req.body);

    try {
        addPersonDetails(res, req.body.PersonDetailsArray);
    }
    catch (e) {
        // do nothing
    }

})

app.post("/addTravelDetails", (req, res) => {
    console.log(req.body);

    locationArray = req.body.LocationArray;
    try {
        addTravelDetails(res, locationArray);
    }
    catch (e) {
        // do nothing
    }
})

app.post("/addTestingLabDetails", (req, res) => {
    console.log(req.body);

    locationArray = req.body.LocationArray;
    try {
        addTestingLabDetails(res, locationArray);
    }
    catch (e) {
        // do nothing
    }
})


app.post("/getTravelData", (req, res) => {
    sql = `SELECT * FROM Person_Details Natural JOIN Travel_Details
           WHERE (From_Time BETWEEN ? AND ?) OR 
           (To_Time BETWEEN ? AND ?) OR
           (? BETWEEN From_Time AND To_Time)`;

    con.query(sql, [req.body.startdate, req.body.enddate, req.body.startdate, req.body.enddate, req.body.startdate], (err, response) => {
        if (err) {
            console.log(err)
            console.log("Error");
            res.send(false);
        }
        //console.log(sql);
        if (response.length > 0) {
            //var cur = response[0];
            //var d = new Date(cur.From_Time);

            response.forEach((d) => {
                d.From_Time = new Date(d.From_Time).toLocaleString();
                d.To_Time = new Date(d.To_Time).toLocaleString();
            })
            //console.log(response);
        }
        res.send(response);
    })
})


app.get("/getAllTravelData", (req, res) => {
    sql = `SELECT * FROM Person_Details Natural JOIN Travel_Details`;

    con.query(sql, (err, response) => {
        if (err) {
            console.log(err)
            console.log("Error");
            res.send(false);
        }
        if (response.length > 0) {
            //var cur = response[0];
            //var d = new Date(cur.From_Time);

            response.forEach((d) => {
                d.From_Time = new Date(d.From_Time).toLocaleString();
                d.To_Time = new Date(d.To_Time).toLocaleString();
            })
        }
        //console.log(response);
        res.send(response);
    })
})

app.get("/getAllPersonDetails", (req, res) => {
    sql = "SELECT * from Person_Details";

    con.query(sql, (err, response) => {
        if (err) {
            console.log(err);
            res.send(false);
        }
        res.send(response);
    })
})


app.get("/getAllTestingLabData", (req, res) => {
    sql = "SELECT * from TestingLab_Details";

    con.query(sql, (err, response) => {
        if (err) {
            console.log(err);
            res.send(false);
        }
        res.send(response);
    })
})

app.get("/getAllTravelDetails", (req, res) => {
    sql = "SELECT * from Travel_Details";

    con.query(sql, (err, response) => {
        if (err) {
            console.log(err);
            res.send(false);
        }

        response.forEach(d => {

            d.From_Time = new Date(d.From_Time).toLocaleString() // .toISOString().substring(0,23);
            d.To_Time = new Date(d.To_Time).toLocaleString()

            //d.From_Time = new Date(d.From_Time).toISOString().slice(0,23);
            //d.To_Time = new Date(d.To_Time).toISOString().slice(0,23);
        })

        /*response.forEach(d=>{
            d.From_Time = new Date(d.From_Time).toISOString().slice(0, 19).replace('T', ' ');
            d.To_Time = new Date(d.To_Time).toISOString().slice(0, 19).replace('T', ' ');
        })*/
        console.log(response);
        res.send(response);
    })
})

app.post("/mergeRegionData", (req, res) => {
    var locationArray = req.body.TravelDetails;
    var personDetails = req.body.PersonDetails;

    addPersonDetails(res, personDetails)
    addTravelDetails(res, locationArray);
})

/* Methods */

function addPersonDetails(res, detailsArray) {

    console.log("Array received");
    console.log(detailsArray);
    detailsArray.unshift(" ");
    console.log(detailsArray);
    sql = detailsArray.reduce((pv, cv, ci) => {
        console.log("Add Person current value:");
        console.log(pv);
        return pv + "Insert Into Person_Details values(" + cv.PersonID + ",'" + cv.Address + "','" +
            cv.City + "','" + cv.State + "'," + cv.Infected + ");"
    })

    console.log("Person Details query:");
    console.log(sql);

    con.query(sql, (err, response) => {
        if (err) {
            console.log(err);
            try {
                res.send(err)
            } catch (error) {
            }
        }
        else {
            try {
                res.send(true);
            } catch (error) {
            }
        }

    })
}

function addTravelDetails(res, locationArray) {
    locationArray.forEach((d) => {
        let fromTime = new Date(d.From_Time);
        let toTime = new Date(d.To_Time);

        d.From_Time = fromTime.getFullYear() + '-' +
            ('00' + (fromTime.getMonth() + 1)).slice(-2) + '-' +
            ('00' + fromTime.getDate()).slice(-2) + ' ' +
            ('00' + fromTime.getHours()).slice(-2) + ':' +
            ('00' + fromTime.getMinutes()).slice(-2) + ':' +
            ('00' + fromTime.getSeconds()).slice(-2);

        d.To_Time = toTime.getFullYear() + '-' +
            ('00' + (toTime.getMonth() + 1)).slice(-2) + '-' +
            ('00' + toTime.getDate()).slice(-2) + ' ' +
            ('00' + toTime.getHours()).slice(-2) + ':' +
            ('00' + toTime.getMinutes()).slice(-2) + ':' +
            ('00' + toTime.getSeconds()).slice(-2);

    })
    console.log("ISO CONVERTED");
    console.log(locationArray);
    locationArray.unshift(" ");
    console.log("Formatted")
    console.log(locationArray);
    sql = locationArray.reduce((pv, cv, ci) => {
        console.log("Current value")
        console.log(cv);
        return pv + "Insert Into Travel_Details values(" + cv.PersonID + ",'" + cv.Location + "'," +
            cv.Latitude + "," + cv.Longitude + ",'" + cv.From_Time + "','" + cv.To_Time + "','" + cv.Mode_of_Transportation + "');"
    })
    console.log("Travel Details query:")
    console.log(sql)

    con.query(sql, (err, response) => {
        if (err) {
            console.log(err);
            try {
                res.send(err)
            } catch (error) {
            }
        }
        else {
            console.log("Success");
            try {
                res.send(true);
            } catch (error) {
            }
        }
    })
}


function addTestingLabDetails(res, locationArray) {
    locationArray.unshift(" ");
    console.log("Formatted")
    console.log(locationArray);
    sql = locationArray.reduce((pv, cv, ci) => {
        console.log("Current value")
        console.log(cv);
        return pv + "Insert Into TestingLab_Details values('" + cv.address + "'," + cv.Latitude + "," +
            cv.Longitude + ",'" + cv.type + "','" + cv.name + "');"
    })
    console.log("Testing Lab Details query:")
    //console.log(sql)


    con.query(sql, (err, response) => {
        if (err) {
            console.log(err);
            try {
                res.send(err)
            } catch (error) {
            }
        }
        else {
            console.log("Success");
            try {
                res.send(true);
            } catch (error) {
            }
        }
    })

}
module.exports = app;