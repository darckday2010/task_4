import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import '../../core/queries.dart';
import '../../core/dtos.dart';
import '../../mappers/hotel_mapper.dart';
import '../../domain/models.dart';
import 'room_list_screen.dart';

class HotelListScreen extends StatelessWidget {
  const HotelListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFFF7ED),
      appBar: AppBar(
        title: const Text(
          "ВЫБОР ОТЕЛЯ",
          style: TextStyle(fontWeight: FontWeight.w900),
        ),
        centerTitle: true,
      ),
      body: Query(
        options: QueryOptions(
          document: gql(getHotelsQuery),
          fetchPolicy: FetchPolicy.networkOnly,
        ),
        builder: (QueryResult result, {refetch, fetchMore}) {
          if (result.hasException)
            return Center(child: Text(result.exception.toString()));
          if (result.isLoading)
            return const Center(child: CircularProgressIndicator());

          final List<dynamic> hotelsJson = result.data?['hotels'] ?? [];
          final hotels = hotelsJson
              .map((json) => HotelMapper.toDomain(HotelDto.fromJson(json)))
              .toList();

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: hotels.length,
            itemBuilder: (context, index) {
              final hotel = hotels[index];
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                child: ListTile(
                  contentPadding: const EdgeInsets.all(16),
                  title: Text(
                    hotel.name,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                    ),
                  ),
                  subtitle: Text(hotel.location),
                  trailing: const Icon(
                    Icons.chevron_right,
                    color: Colors.orange,
                  ),
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => RoomListScreen(
                        hotel: hotel,
                        onUpdate: () => refetch?.call(),
                      ),
                    ),
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
