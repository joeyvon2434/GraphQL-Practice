//Dependencies
const express = require('express');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const gql = require('graphql-tag');
const { buildASTSchema } = require('graphql');


//mock datat for testiing
const POSTS = [
    {author: "John Doe", body: "Hello world"},
    {author: "Jane Doe", body: "Hello, planet"}
];


const schema = buildASTSchema(gql`
    type Query {
        posts: [Post]
        post(id: ID!): Post
    }
    
    type Post {
        id: ID
        author: String
        body: String
    }
    `);

    const mapPost = (post, id) => post && ({id, ...post});

    const root = {
        posts: () => POSTS.map(mapPost),
        post: ({ id }) => mapPost(POSTS[id], id),
    };

    //set up express
    const app = express();
    app.use('/graphql', graphqlHTTP({
        schema,
        rootValue: root,
        graphql: true
    }));

    //start server listening on proper port
    const port = process.env.PORT || 4000;
    app.listen(port);
    console.log(`Runnung application on port ${port}`);