import { gql } from "apollo-server";

export const typeDefs = gql`
	scalar Date

	type Room {
		id: ID!
		number: String!
		price: Int!
		imageUrl: String!
		bookings: [Booking]
		hotel: Hotel # <--- Я ВЕРНУЛ ЭТО ПОЛЕ, ИЗ-ЗА НЕГО ПАДАЛО
	}

	type Booking {
		id: ID!
		guestName: String!
		checkIn: String!
		checkOut: String!
		status: String!
		room: Room # <--- Вернул и это, на всякий случай
	}

	type Hotel {
		id: ID!
		name: String!
		address: String
		rooms: [Room]
	}

	type Query {
		hotels: [Hotel]
		hotel(id: ID!): Hotel
		room(id: ID!): Room
		checkAvailability(roomId: ID!, checkIn: String!, checkOut: String!): Boolean
	}

	type Mutation {
		createBooking(roomId: ID!, guestName: String!, checkIn: String!, checkOut: String!): Booking

		# Это поле мы чинили в прошлый раз, оно правильное
		cancelBooking(id: ID!): Booking
	}
`;
