import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import * as dotenv from "dotenv"; // Импортируем всё как объект

dotenv.config();

const server = new ApolloServer({
	typeDefs,
	resolvers,
	cors: {
		origin: "*", // Разрешаем доступ с любого фронтенда (React, Flutter)
		credentials: true,
	},
});

// Порт берем из env или 4000 по умолчанию
const PORT = process.env.PORT || 4000;

server.listen({ port: PORT }).then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
	console.log(`⭐️  See GraphQL Playground at ${url}`);
});
