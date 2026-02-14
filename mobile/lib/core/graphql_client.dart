import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

ValueNotifier<GraphQLClient> setupGraphQLClient() {
  // НЮАНС: Android Эмулятор видит хост как 10.0.2.2
  // iOS Симулятор и Web видят как localhost
  final String host = Platform.isAndroid ? '10.0.2.2' : 'localhost';

  final HttpLink httpLink = HttpLink('http://$host:4000/graphql');

  return ValueNotifier(
    GraphQLClient(
      link: httpLink,
      // В продакшене лучше использовать HiveStore, но для теста хватит и памяти
      cache: GraphQLCache(store: InMemoryStore()),
    ),
  );
}
