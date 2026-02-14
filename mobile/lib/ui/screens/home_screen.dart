import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import '../../core/queries.dart';
import '../../core/dtos.dart';
import '../../mappers/hotel_mapper.dart';
import '../../domain/models.dart';
import '../widgets/hotel_card.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFFF7ED), // Orange-50
      appBar: AppBar(
        backgroundColor: Colors.white.withOpacity(0.8),
        elevation: 0,
        title: Row(
          children: const [
            Icon(Icons.beach_access, color: Colors.orange),
            SizedBox(width: 8),
            Text(
              "MINI BOOKING",
              style: TextStyle(
                fontWeight: FontWeight.w900,
                color: Colors.black87,
                letterSpacing: 1,
              ),
            ),
          ],
        ),
      ),
      body: Query(
        options: QueryOptions(
          document: gql(getHotelsQuery),
          // Чтобы данные обновлялись при возврате на экран
          fetchPolicy: FetchPolicy.cacheAndNetwork,
        ),
        builder:
            (
              QueryResult result, {
              VoidCallback? refetch,
              FetchMore? fetchMore,
            }) {
              if (result.hasException) {
                return Center(
                  child: Text("Ошибка: ${result.exception.toString()}"),
                );
              }

              if (result.isLoading && result.data == null) {
                return const Center(
                  child: CircularProgressIndicator(color: Colors.orange),
                );
              }

              // МАППИНГ ДАННЫХ
              // 1. Берем JSON
              final List<dynamic> hotelsJson = result.data?['hotels'] ?? [];

              // 2. Превращаем в DTO -> Domain
              final List<Hotel> hotels = hotelsJson
                  .map((json) => HotelMapper.toDomain(HotelDto.fromJson(json)))
                  .toList();

              if (hotels.isEmpty) {
                return const Center(child: Text("Нет отелей"));
              }

              // 3. Рисуем список
              return RefreshIndicator(
                onRefresh: () async {
                  refetch?.call();
                },
                color: Colors.orange,
                child: ListView.builder(
                  padding: const EdgeInsets.all(20),
                  itemCount: hotels.length,
                  itemBuilder: (context, index) {
                    return HotelCard(
                      hotel: hotels[index],
                      onRefresh: () => refetch?.call(),
                    );
                  },
                ),
              );
            },
      ),
    );
  }
}
