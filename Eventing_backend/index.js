const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql');
app.use(bodyParser.json());
const db =  require('./connection');
const rootSchema = require('./graphql/schema/schema');
const rootResolver = require('./graphql/resolvers/resolvers');
const authenticate = require('./middleware/auth-req');
const cors =  require('cors');

app.use(
    cors({
    allowedHeaders:["Content-Type", "Authorization"],
    methods:["POST", "GET", "PUT"],
    origin:"*"    
})
)
app.use(authenticate);

app.get('/', (req,res)=>{
    res.send('Welcome Onboard!');
})
app.use('/api' , graphqlHTTP({
    schema : rootSchema,
    rootValue:rootResolver,
    graphiql : true
})
);

app.listen(3000 , ()=>{
    console.log('server is running');
})