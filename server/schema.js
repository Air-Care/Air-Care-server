const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString } = graphql;

const salutations = ['Hello', 'Hi', 'How are you'];

const GreetingType = new GraphQLObjectType({
  name: 'Greeting',
  fields: () => ({
    salutation: { type: GraphQLString },
    name: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    greeting: {
      type: GreetingType,
      args: { name: { type: GraphQLString } },
      resolve(parent, args) {
        const { name } = args;
        const salutation = salutations[name.charCodeAt(0) % 3];
        return {
          salutation,
          name,
        };
      },
    },
  },
});

module.exports = new graphql.GraphQLSchema({
  query: RootQuery,
});
