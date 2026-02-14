import { gql } from "@apollo/client";

export const GET_HOTELS = gql`
	query GetHotels {
		hotels {
			id
			name
			address
			rooms {
				id
				number
				price
				imageUrl
				bookings {
					id
					checkIn
					checkOut
					guestName
					status
				}
			}
		}
	}
`;

export const GET_HOTEL = gql`
	query GetHotel($id: ID!) {
		hotel(id: $id) {
			id
			name
			address
			rooms {
				id
				number
				price
				imageUrl
				bookings {
					id
					checkIn
					checkOut
					guestName
					status
				}
			}
		}
	}
`;

export const CREATE_BOOKING = gql`
	mutation CreateBooking($roomId: ID!, $guestName: String!, $checkIn: String!, $checkOut: String!) {
		createBooking(roomId: $roomId, guestName: $guestName, checkIn: $checkIn, checkOut: $checkOut) {
			id
			status
		}
	}
`;

// ВОТ ЭТО должно быть обязательно:
export const CANCEL_BOOKING = gql`
	mutation CancelBooking($id: ID!) {
		cancelBooking(id: $id) {
			id
			status
		}
	}
`;
