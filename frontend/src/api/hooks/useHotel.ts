import { useQuery } from "@apollo/client";
import { GET_HOTEL } from "../queries";
import type { HotelDTO } from "../dto";
import type { IHotel } from "../domain/models";
import { HotelMapper } from "../mappers/hotelMapper";

export const useHotel = (id: string | undefined) => {
	const { data, loading, error, refetch } = useQuery<{ hotel: HotelDTO | null }>(GET_HOTEL, {
		variables: { id },
		skip: !id, // Не делаем запрос, если ID нет
	});

	// Пропускаем через маппер
	const hotel: IHotel | null = data?.hotel ? HotelMapper.toDomain(data.hotel) : null;

	return {
		hotel,
		isLoading: loading,
		error: error?.message,
		refresh: refetch,
	};
};
