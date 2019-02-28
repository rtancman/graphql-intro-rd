'use strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
} = require('graphql');
const GraphQLJSON = require('graphql-type-json');
const { getPersonById, getPeople, starshipList, getStarshipById } = require('./src/data');

const PORT = process.env.PORT || 3000;
const server = express();

const starshipType = new GraphQLObjectType({
  name: 'Starship',
  description: 'A Starship in Star Wars',
  fields: {
    id: {
      type: GraphQLID,
      description: 'The id of the Starship.',
    },
    name: {
      type: GraphQLString,
      description: 'The name of the Starship.',
    },
    model: {
      type: GraphQLString,
      description: 'The model of the Starship.',
    },
    manufacturer: {
      type: GraphQLString,
      description: 'The manufacturer of the Starship.',
    },
  },
});

const personType = new GraphQLObjectType({
  name: 'Person',
  description: 'A Person in Star Wars',
  fields: {
    id: {
      type: GraphQLID,
      description: 'The id of the people.',
    },
    name: {
      type: GraphQLString,
      description: 'The name of the people.',
    },
    height: {
      type: GraphQLInt,
      description: 'The height of the people.',
    },
    mass: {
      type: GraphQLInt,
      description: 'The mass of the people.',
    },
    hairColor: {
      type: GraphQLString,
      description: 'The hair color of the people.',
    },
    skinColor: {
      type: GraphQLString,
      description: 'The hair color of the people.',
    },
    gender: {
      type: GraphQLString,
      description: 'The gender of the people.',
    },
    starship: {
      type: starshipType,
      description: 'The starship of the people.',
    }
  },
});

const queryType = new GraphQLObjectType({
  name: 'QueryType',
  description: 'The root query type.',
  fields: {
    people: {
      type: new GraphQLList(personType),
      resolve: getPeople,
    },
    person: {
      type: personType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'The id of the Person.',
        },
      },
      resolve: (_, args) => {
        return getPersonById(args.id);
      },
    },
    starship: {
      type: starshipType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'The id of the Starship.',
        },
      },
      resolve: (_, args) => {
        return getStarshipById(args.id);
      },
    },
    starshipList: {
      type: new GraphQLList(starshipType),
      args: {
        filter: {type: GraphQLJSON},
      },
      resolve: (_, args) => {
        return starshipList(args);
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: queryType,
});


server.use('/', graphqlHTTP({
  schema,
  graphiql: true,
}));

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
