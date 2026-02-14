import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import '../../domain/models.dart';
import '../../core/queries.dart';
import '../../core/dtos.dart';
import '../../mappers/hotel_mapper.dart';
import '../widgets/booking_dialog.dart';

const String getRoomQuery = r'''
  query GetRoom($id: ID!) {
    room(id: $id) {
      id number price imageUrl
      bookings { id checkIn checkOut status guestName }
    }
  }
''';

const String cancelBookingMutation = r'''
  mutation CancelBooking($id: ID!) {
    cancelBooking(id: $id) { id status }
  }
''';

class RoomDetailScreen extends StatelessWidget {
  final String roomId;
  const RoomDetailScreen({super.key, required this.roomId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFFF7ED),
      appBar: AppBar(title: const Text("ДЕТАЛИ НОМЕРА")),
      body: Query(
        options: QueryOptions(
          document: gql(getRoomQuery),
          variables: {'id': roomId},
          fetchPolicy: FetchPolicy.networkOnly,
        ),
        builder:
            (
              QueryResult result, {
              VoidCallback? refetch,
              FetchMore? fetchMore,
            }) {
              if (result.hasException)
                return Center(child: Text(result.exception.toString()));
              if (result.isLoading)
                return const Center(child: CircularProgressIndicator());

              final roomJson = result.data?['room'];
              if (roomJson == null)
                return const Center(child: Text("Ошибка загрузки"));

              final room = HotelMapper.toDomainRoom(RoomDto.fromJson(roomJson));
              final activeBookings = room.bookings
                  .where((b) => b.isActive)
                  .toList();

              return SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(color: Colors.black12, blurRadius: 10),
                    ],
                  ),
                  clipBehavior: Clip.antiAlias,
                  child: Column(
                    children: [
                      CachedNetworkImage(
                        imageUrl: room.imageUrl,
                        height: 220,
                        width: double.infinity,
                        fit: BoxFit.cover,
                      ),
                      Padding(
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              room.title,
                              style: const TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 12),
                            ...activeBookings
                                .map((b) => _buildTile(b, refetch!, context))
                                .toList(),
                            const SizedBox(height: 20),
                            SizedBox(
                              width: double.infinity,
                              height: 50,
                              child: ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF1E293B),
                                  foregroundColor: Colors.white,
                                ),
                                onPressed: () => showDialog(
                                  context: context,
                                  builder: (_) => BookingDialog(
                                    roomId: room.id,
                                    roomTitle: room.title,
                                    onSuccess: () => refetch?.call(),
                                  ),
                                ),
                                child: const Text("ЗАБРОНИРОВАТЬ"),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
      ),
    );
  }

  Widget _buildTile(Booking b, VoidCallback onUpdate, BuildContext context) {
    return Mutation(
      options: MutationOptions(
        document: gql(cancelBookingMutation),
        onCompleted: (data) {
          if (data != null) onUpdate();
        },
      ),
      builder: (RunMutation runCancel, QueryResult? result) {
        return Container(
          margin: const EdgeInsets.only(top: 8),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.red[50],
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              const Icon(Icons.person, size: 16, color: Colors.redAccent),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  "${b.guest}: ${b.period}",
                  style: const TextStyle(fontSize: 12, color: Colors.redAccent),
                ),
              ),
              IconButton(
                icon: result!.isLoading
                    ? const SizedBox(
                        width: 15,
                        height: 15,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Icon(
                        Icons.close,
                        size: 18,
                        color: Colors.redAccent,
                      ),
                onPressed: () => runCancel({'id': b.id}),
              ),
            ],
          ),
        );
      },
    );
  }
}
