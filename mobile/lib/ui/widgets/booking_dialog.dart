import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:intl/intl.dart';
import '../../core/queries.dart';

class BookingDialog extends StatefulWidget {
  final String roomId;
  final String roomTitle;
  final VoidCallback onSuccess;

  const BookingDialog({
    super.key,
    required this.roomId,
    required this.roomTitle,
    required this.onSuccess,
  });

  @override
  State<BookingDialog> createState() => _BookingDialogState();
}

class _BookingDialogState extends State<BookingDialog> {
  final _nameController = TextEditingController();
  DateTime? _checkIn;
  DateTime? _checkOut;
  String? _errorMessage; // Переменная для отображения ошибки в самом диалоге

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              "Бронирование",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.orange[900],
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _nameController,
              decoration: InputDecoration(
                labelText: "Имя гостя",
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onChanged: (_) {
                if (_errorMessage != null) setState(() => _errorMessage = null);
              },
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(child: _dateBtn("Заезд", _checkIn, true)),
                const SizedBox(width: 8),
                Expanded(child: _dateBtn("Выезд", _checkOut, false)),
              ],
            ),

            // Блок ошибки: отображается прямо над кнопкой
            if (_errorMessage != null)
              Padding(
                padding: const EdgeInsets.only(top: 16),
                child: Text(
                  _errorMessage!,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    color: Colors.redAccent,
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                  ),
                ),
              ),

            const SizedBox(height: 24),
            Mutation(
              options: MutationOptions(
                document: gql(createBookingMutation),
                onCompleted: (dynamic data) {
                  if (data != null && data['createBooking'] != null) {
                    widget.onSuccess();
                    Navigator.pop(context); // Сначала закрываем диалог

                    // Показываем успех на основном экране (уже без затемнения)
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: const Text("Успешно забронировано! 🌴"),
                        backgroundColor: Colors.green,
                        behavior: SnackBarBehavior
                            .floating, // Делает SnackBar парящим
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        margin: const EdgeInsets.all(20),
                      ),
                    );
                  }
                },
                onError: (error) {
                  // Вместо SnackBar обновляем текст внутри диалога
                  setState(() {
                    _errorMessage = error?.graphqlErrors.isNotEmpty == true
                        ? error!.graphqlErrors.first.message
                        : "Этот период уже занят";
                  });
                },
              ),
              builder: (RunMutation runMutation, QueryResult? result) {
                return SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF1E293B),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    onPressed: result!.isLoading
                        ? null
                        : () {
                            if (_nameController.text.isEmpty ||
                                _checkIn == null ||
                                _checkOut == null) {
                              setState(
                                () => _errorMessage = "Заполните все поля",
                              );
                              return;
                            }
                            runMutation({
                              'roomId': widget.roomId,
                              'guestName': _nameController.text,
                              'checkIn': DateFormat(
                                'yyyy-MM-dd',
                              ).format(_checkIn!),
                              'checkOut': DateFormat(
                                'yyyy-MM-dd',
                              ).format(_checkOut!),
                            });
                          },
                    child: result.isLoading
                        ? const SizedBox(
                            width: 24,
                            height: 24,
                            child: CircularProgressIndicator(
                              color: Colors.white,
                              strokeWidth: 2,
                            ),
                          )
                        : const Text(
                            "ПОДТВЕРДИТЬ",
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _dateBtn(String label, DateTime? date, bool isIn) {
    return OutlinedButton(
      style: OutlinedButton.styleFrom(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        padding: const EdgeInsets.symmetric(vertical: 12),
      ),
      onPressed: () async {
        final d = await showDatePicker(
          context: context,
          initialDate: DateTime.now(),
          firstDate: DateTime.now(),
          lastDate: DateTime.now().add(const Duration(days: 365)),
        );
        if (d != null) {
          setState(() {
            isIn ? _checkIn = d : _checkOut = d;
            _errorMessage = null; // Сбрасываем ошибку при смене даты
          });
        }
      },
      child: Text(
        date == null ? label : DateFormat('dd.MM').format(date),
        style: const TextStyle(fontWeight: FontWeight.bold),
      ),
    );
  }
}
