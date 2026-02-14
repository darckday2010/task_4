import { PrismaClient } from "@prisma/client";
import { UserInputError } from "apollo-server";

const prisma = new PrismaClient();

export const resolvers = {
	Query: {
		// Получение списка отелей
		hotels: async () => {
			return prisma.hotel.findMany({
				orderBy: { name: "asc" },
				include: {
					rooms: {
						orderBy: { number: "asc" },
						include: { bookings: true }, // Добавил include для отображения в списке
					},
				},
			});
		},

		hotel: async (_: any, { id }: { id: string }) => {
			return prisma.hotel.findUnique({
				where: { id },
				include: {
					rooms: {
						orderBy: { number: "asc" },
						include: { bookings: true },
					},
				},
			});
		},

		// Получение данных одной комнаты
		room: async (_: any, { id }: { id: string }) => {
			return prisma.room.findUnique({
				where: { id },
				include: { bookings: true },
			});
		},

		// Проверка доступности (без создания брони)
		checkAvailability: async (_: any, args: { roomId: string; checkIn: string; checkOut: string }) => {
			const { roomId, checkIn, checkOut } = args;
			const start = new Date(checkIn);
			const end = new Date(checkOut);

			const conflict = await prisma.booking.findFirst({
				where: {
					roomId,
					status: "CONFIRMED",
					checkIn: { lt: end },
					checkOut: { gt: start },
				},
			});

			return !conflict;
		},
	},

	Mutation: {
		createBooking: async (_: any, args: { roomId: string; guestName: string; checkIn: string; checkOut: string }) => {
			const { roomId, guestName, checkIn, checkOut } = args;
			const start = new Date(checkIn);
			const end = new Date(checkOut);
			const now = new Date();
			now.setHours(0, 0, 0, 0); // Сбрасываем время для сравнения только дат

			// Валидация дат
			if (start < now) {
				throw new UserInputError("Нельзя забронировать номер на прошедшую дату");
			}
			if (start >= end) {
				throw new UserInputError("Дата выезда должна быть позже даты заезда");
			}

			return prisma.$transaction(async (tx) => {
				// 1. Проверяем пересечения
				const conflict = await tx.booking.findFirst({
					where: {
						roomId,
						status: "CONFIRMED",
						checkIn: { lt: end },
						checkOut: { gt: start },
					},
				});

				if (conflict) {
					throw new UserInputError("К сожалению, номер уже занят на выбранные даты.");
				}

				// 2. Логирование (Требование ТЗ)
				console.log(`[CREATE BOOKING] Guest: ${guestName}, Room: ${roomId}, Dates: ${checkIn} to ${checkOut}`);

				// 3. Создаем бронь
				return await tx.booking.create({
					data: {
						roomId,
						guestName,
						checkIn: start,
						checkOut: end,
						status: "CONFIRMED",
					},
					include: { room: true },
				});
			});
		},

		cancelBooking: async (_: any, { id }: { id: string }) => {
			try {
				const cancelledBooking = await prisma.booking.update({
					where: { id },
					data: { status: "CANCELLED" },
					include: { room: true },
				});

				// Логирование (Требование ТЗ)
				console.log(`[CANCEL BOOKING] ID: ${id}, Status: CANCELLED`);

				return cancelledBooking;
			} catch (e) {
				throw new UserInputError("Бронь не найдена или уже удалена");
			}
		},
	},

	// Field Resolvers
	Booking: {
		checkIn: (parent: any) => parent.checkIn.toISOString().split("T")[0],
		checkOut: (parent: any) => parent.checkOut.toISOString().split("T")[0],
	},

	Room: {
		bookings: (parent: any) => {
			if (parent.bookings) return parent.bookings;
			return prisma.booking.findMany({ where: { roomId: parent.id } });
		},
		hotel: (parent: any) => {
			if (parent.hotel) return parent.hotel;
			return prisma.hotel.findUnique({ where: { id: parent.hotelId } });
		},
	},
};
