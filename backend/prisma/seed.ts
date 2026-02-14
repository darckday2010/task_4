import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Start seeding...");

	// Чистим старое БЕЗОПАСНО
	try {
		await prisma.booking.deleteMany();
		await prisma.room.deleteMany();
		await prisma.hotel.deleteMany();
		console.log("🗑️  Old data cleared.");
	} catch (e) {
		console.log("ℹ️  Tables are already empty or don't exist, skipping delete.");
	}

	// Создаем Отель 1
	const hotel1 = await prisma.hotel.create({
		data: {
			name: "Grand Budapest Hotel",
			address: "Republic of Zubrowka",
			rooms: {
				create: [
					{
						number: "101",
						price: 150,
						imageUrl: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
					},
					{
						number: "Luxe",
						price: 500,
						imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
					},
				],
			},
		},
	});

	// Создаем Отель 2
	const hotel2 = await prisma.hotel.create({
		data: {
			name: "The Overlook Hotel",
			address: "Colorado Mountains",
			rooms: {
				create: [
					{
						number: "237",
						price: 100,
						imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
					},
					{
						number: "Gold Room",
						price: 300,
						imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
					},
				],
			},
		},
	});

	console.log("✅ Seeding finished.");
}

main()
	.catch((e) => console.error(e))
	.finally(async () => await prisma.$disconnect());
