const express= require('express');
const bodyParse= require('body-parser');
const MongoClient= require('mongodb').MongoClient;
var fs = require('fs');

var configPath = './exampleCredentials.json';
var parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));

const host= parsed.MONGO_HOSTNAME;
const port=   parsed.MONGO_PORT;
const dbname=parsed.MONGO_DB;
console.log(host+":"+port+" "+dbname)
const url= "mongodb://"+host+":"+port;

const app = express();

MongoClient.connect(url, { useUnifiedTopology: true })
.then(client =>{
    console.log('connected to mongo db');
    const db = client.db(dbname);
    const studentCollection = db.collection('students');
    studentCollection.insertMany([{Id:1, studentName : 'Swarna'},{Id:2, studentName :'Chaitan'},{Id:3, studentName :'Poo'}], function(err,result){
        console.log('inserted 3 records');
          
       });

app.use(express.static(__dirname + '/static'));
app.use(bodyParse.json());


app.get('/',(req,res) =>{
   
  
  res.sendFile(__dirname+'/pages/home.html');
  
});

app.get('/students',(req,res) =>{
   //console.log('inside js get students list')
    studentCollection.find().toArray()
    .then(results => {
        //res.render('demo',{title:'Students Management System',data_students : results});
      console.log(results);
      res.json(results);
    })
    .catch(error => console.error(error))
});


app.get('/edit/:id',(req,res) =>{
  
    var reqid=parseInt(req.params.id);
   
   console.log('inside js edit student by id'+ reqid);
    var query1 = { 'Id' :reqid};
   
    //console.log("query1------"+JSON.stringify(query1));
    studentCollection.findOne(query1, function(err, item) {
        if(err) console.log(err);
      
            console.log('item='+JSON.stringify(item));
            //res.sendFile(__dirname+'/pages/editStudent.html');
            res.status(200);
            res.json(item);
          
    
    });
     
});


app.get('/edit/:studentid/:studentName/:initialstid',(req,res) =>{
  
    var reqid2=parseInt(req.params.initialstid);
    var newstid=parseInt(req.params.studentid);
    var studentname= req.params.studentName;
  console.log('inside js edit student by id and name'+ reqid2+' studentname='+studentname);
    var query2 = { 'Id' :reqid2};
    var editstudent;
    //console.log("query12-----"+JSON.stringify(query2));
    studentCollection.findOne(query2, function(err, item) {
        if(err) console.log(err);
      
           console.log('item='+JSON.stringify(item));
           console.log('item id='+JSON.stringify(item._id));
           var jsonstr={Id:newstid,studentName:studentname};
           console.log(jsonstr);
        studentCollection.updateOne({ _id: item._id}, {$set:{Id:newstid,studentName:studentname}}, function (err, result) {
            console.log('student record updated!')
            res.send(
                (err === null) ? {msg: ''} : {msg: err}
            );
        });
      });

   
});


app.get('/students/:id',(req,res) =>{
    console.log('inside js get student by id');
    var reqid=parseInt(req.params.id);
    var query = { 'Id' :reqid  };
    console.log(query);
    studentCollection.findOne(query, function(err, item) {
        if(err) console.log(err);
        if(item!=null)
        {
            console.log('item='+JSON.stringify(item));
            res.send(item);
        }
    });
});



app.get('/delete/:id',(req,res) =>{
    console.log('inside js delete student by id')
    var reqid=parseInt(req.params.id);
    var query = { 'Id' : reqid };
    console.log(query);

    studentCollection.remove(query, function(err, obj) {  
        if (err) throw err;  
        console.log(obj.result.n + " record(s) deleted");  
        
        });  

        res.send(202);

});


app.listen(3009, function() {
    console.log('Welcome to student management System !');
   console.log('goto http://localhost:3009/ in the browser');
    console.log('listening on port 3009')
  });
}) .catch(console.error)







