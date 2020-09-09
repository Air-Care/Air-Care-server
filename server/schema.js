const graphql = require('graphql');
const { getFires } = require('./controllers/fireController');
const { getAirQuality } = require('./controllers/airQualityController');

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLFloat } = graphql;

const salutations = ['Hello', 'Hi', 'How are you'];

const GreetingType = new GraphQLObjectType({
  name: 'Greeting',
  fields: () => ({
    salutation: { type: GraphQLString },
    name: { type: GraphQLString },
  }),
});

const FireType = new GraphQLObjectType({
  name: 'Fire',
  fields: () => ({
    latitude: { type: GraphQLFloat },
    longitude: { type: GraphQLFloat },
  }),
});

const ReportType = new GraphQLObjectType({
  name: 'Report',
  fields: () => ({
    aqi: { type: GraphQLInt },
    fires: {
      type: new GraphQLList(FireType),
    },
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
    report: {
      type: ReportType,
      args: { latitude: { type: GraphQLFloat }, longitude: { type: GraphQLFloat } },
      resolve(parent, args) {
        let { latitude, longitude } = args;

        latitude = latitude.toFixed(1);
        longitude = longitude.toFixed(1);

        return Promise.all([
          getFires({ latitude, longitude }),
          getAirQuality({ latitude, longitude }),
        ])
          .then(([fires, aqi]) => ({ fires, aqi }))
          .catch((err) => {
            console.error(`ERROR getting fire & aqi data: ${err}`);
            return { fires: [], aqi: NaN };
          });
      },
    },
  },
});

module.exports = new graphql.GraphQLSchema({
  query: RootQuery,
});
