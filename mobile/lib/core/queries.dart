const String getHotelsQuery = r'''
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
          status
        }
      }
    }
  }
''';

const String createBookingMutation = r'''
  mutation CreateBooking($roomId: ID!, $guestName: String!, $checkIn: String!, $checkOut: String!) {
    createBooking(roomId: $roomId, guestName: $guestName, checkIn: $checkIn, checkOut: $checkOut) {
      id
      status
    }
  }
''';
