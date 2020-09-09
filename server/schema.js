const graphql = require('graphql');
const { getFires } = require('./controllers/fireController');
const { getAirQuality } = require('./controllers/airQualityController');

const { GraphQLObjectType, GraphQLInt, GraphQLList, GraphQLFloat } = graphql;

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
            console.error(
              `Error resolving fire & aqi data on request LAT(${args.latitude}) LON(${args.longitude}):\n${err}`
            );
            return { fires: [], aqi: NaN };
          });
      },
    },
  },
});

module.exports = new graphql.GraphQLSchema({
  query: RootQuery,
});
