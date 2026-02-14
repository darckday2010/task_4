import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'core/graphql_client.dart';
import 'ui/screens/hotel_list_screen.dart';

void main() async {
  // Инициализация для корректной работы кэша GraphQL
  await initHiveForFlutter();

  final client = setupGraphQLClient();

  runApp(MyApp(client: client));
}

class MyApp extends StatelessWidget {
  final ValueNotifier<GraphQLClient> client;

  const MyApp({super.key, required this.client});

  @override
  Widget build(BuildContext context) {
    return GraphQLProvider(
      client: client,
      child: MaterialApp(
        title: 'Mini Booking',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFFF97316),
            surface: const Color(0xFFFFF7ED),
          ),
          textTheme: GoogleFonts.interTextTheme(),
        ),
        home: const HotelListScreen(),
      ),
    );
  }
}
