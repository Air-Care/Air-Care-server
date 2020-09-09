const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLFloat } = graphql;

const salutations = ['Hello', 'Hi', 'How are you'];

const GreetingType = new GraphQLObjectType({
  name: 'Greeting',
  fields: () => ({
    salutation: { type: GraphQLString },
    name: { type: GraphQLString },
  }),
});

const ReportType = new GraphQLObjectType({
  name: 'Report',
  fields: () => ({
    // Array of arrays type: [[GraphQLFloat, GraphQLFloat]] ?
    fires: [],
    aqi: GraphQLInt,
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
        const { latitude, longitude } = args;
        function nearestMinute(coord) {
          const split = coord.toString().split('.');
          const truncatedMin = Math.round((split[1] * 60) / 10 ** split[1].length) / 60;
          return Number(split[0]) + truncatedMin;
        }
        // Might have to constrict the number of decimal places
        const roundedLatitude = nearestMinute(latitude);
        const roundedLongitude = nearestMinute(longitude);
        // probably incorrect syntax - do something with .then()?
        const fires = getFires(roundedLatitude, roundedLongitude);
        const aqi = getAQI(roundedLongitude, roundedLongitude);
        /* 
          Probably handled by the getFires/getAQI functions?
            use lat/long with real request to api for fires: https://api.breezometer.com/fires/v1/current-conditions?lat={latitude}&lon={longitude}&key=YOUR_API_KEY&radius={radius}
            use lat/long with real request for aqi: https://api.breezometer.com/air-quality/v2/current-conditions?lat={latitude}&lon={longitude}&key=YOUR_API_KEY&features={Features_List}
        */
        return {
          fires,
          aqi,
        };
      },
    },
  },
});

module.exports = new graphql.GraphQLSchema({
  query: RootQuery,
});
