const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
// const res = require('express/lib/response');

const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.BD_PASS}@contactkeeper.0en6c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const productsCollection = client.db("emaJohn").collection("products");

        //get method to get all data or filtering by page and items size
        app.get('/product',async(req,res)=>{
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            
            // console.log("page:", page, ", size:", size);
            const query={};
            const cursor = productsCollection.find(query);

            if(page || size){
                products = await cursor.skip(page*size).limit(size).toArray();
            }
            else{
                products = await cursor.toArray();
            }
            res.send(products)
        })

        //get method to get numbers of data
        app.get('/productCount',async(req,res)=>{
            const count = await productsCollection.estimatedDocumentCount();
            res.send({count})
        })

        //post method to get products by ids
        app.post('/productByKeys', async(req,res)=>{
            const keys = req.body;
            const ids = keys.map(id=>ObjectId(id));
            const query = {_id: {$in: ids}};
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            // console.log(keys);
            res.send(products)
        })
    }
    finally{
    }
}

run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("Ema John is Running")
});

app.listen(port,()=>{
    console.log("Running Port:",port);
})