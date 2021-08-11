import { GraphQLClient } from "graphql-request"; // GraphQL request client

let url = "https://api.studio.thegraph.com/query/4554/kanban/v36"; 

//const API_KEY = process.env.NEXT_PUBLIC_GRAPH_API
//When the graph is live
//let url = "https://gateway.testnet.thegraph.com/api/API_KEY/subgraphs/id/0xc586f1a96e65b815a075544262ea1867422e9253-0"; 


// Create client
const client = new GraphQLClient(url);

// Export client
export default client;