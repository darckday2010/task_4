import 'package:flutter/material.dart';
import 'package:mobile/ui/widgets/booking_dialog.dart';
import '../../domain/models.dart';
import 'room_item.dart';

class HotelCard extends StatelessWidget {
  final Hotel hotel;
  final VoidCallback onRefresh;

  const HotelCard({super.key, required this.hotel, required this.onRefresh});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                hotel.name,
                style: const TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  const Icon(Icons.location_on, size: 16, color: Colors.orange),
                  const SizedBox(width: 4),
                  Text(
                    hotel.location,
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey[600],
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 10),
        ...hotel.rooms.map(
          (room) => RoomItem(
            room: room,
            onUpdate: onRefresh, // ПЕРЕДАЕМ ОБНОВЛЕНИЕ ТУТ
            onBook: () {
              showDialog(
                context: context,
                builder: (context) => BookingDialog(
                  roomId: room.id,
                  roomTitle: room.title,
                  onSuccess: onRefresh,
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 30),
      ],
    );
  }
}
