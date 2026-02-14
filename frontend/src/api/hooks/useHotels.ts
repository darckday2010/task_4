import { useQuery } from "@apollo/client";
import type { HotelDTO } from "../dto";
import type { IHotel } from "../domain/models";
import { HotelMapper } from "../mappers/hotelMapper";
import { GET_HOTELS } from "../queries";

/**
 * Хук для получения списка отелей.
 * Инкапсулирует работу с Apollo Client, обработку состояний
 * и трансформацию данных из DTO в Domain модели.
 */
export const useHotels = () => {
	// Apollo Client внутренне управляет AbortController:
	// запрос будет автоматически отменен, если компонент размонтируется.
	const { data, loading, error, refetch } = useQuery<{ hotels: HotelDTO[] }>(GET_HOTELS, {
		// 'cache-and-network' позволяет показать данные из кеша,
		// пока идет свежий запрос в фоне (улучшает UX).
		fetchPolicy: "cache-and-network",
		notifyOnNetworkStatusChange: true,
	});

	// Трансформируем данные только если они есть
	const hotels: IHotel[] = data?.hotels ? data.hotels.map((dto) => HotelMapper.toDomain(dto)) : [];

	return {
		hotels,
		// Используем loading напрямую для начальной загрузки
		isLoading: loading,
		// Пробрасываем ошибку как строку для простоты отображения в UI
		error: error?.message,
		// Функция для ручного обновления данных
		refresh: refetch,
	};
};
