import 'package:flutter/material.dart';
import '../../domain/models.dart';
import 'room_detail_screen.dart';

class RoomListScreen extends StatelessWidget {
  final Hotel hotel;
  final VoidCallback onUpdate;

  const RoomListScreen({
    super.key,
    required this.hotel,
    required this.onUpdate,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFFF7ED),
      appBar: AppBar(title: Text(hotel.name.toUpperCase())),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: hotel.rooms.length,
        itemBuilder: (context, index) {
          final room = hotel.rooms[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.network(
                  room.imageUrl,
                  width: 60,
                  height: 60,
                  fit: BoxFit.cover,
                ),
              ),
              title: Text(
                room.title,
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              subtitle: Text(room.formattedPrice),
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => RoomDetailScreen(roomId: room.id),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
