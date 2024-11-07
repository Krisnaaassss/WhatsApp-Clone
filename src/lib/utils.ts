import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Menggabungkan clsx dan tailwind-merge untuk membuat string kelas
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Memformat tanggal dari timestamp dalam milidetik
export function formatDate(date_ms: number) {
	const date_seconds = date_ms / 1000;
	const date_obj = new Date(date_seconds * 1000);

	const current_date = new Date();
	current_date.setHours(0, 0, 0, 0);
	const current_time = current_date.getTime();

	const provided_date = new Date(date_obj);
	provided_date.setHours(0, 0, 0, 0);

	// Periksa apakah itu hari ini
	if (provided_date.getTime() === current_time) {
		return date_obj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
	}

	// Periksa apakah itu kemarin
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	yesterday.setHours(0, 0, 0, 0);
	if (provided_date.getTime() === yesterday.getTime()) {
		return "Kemarin";
	}

	// Periksa apakah itu hari yang berbeda dalam seminggu
	if (provided_date.getDay() < current_date.getDay()) {
		const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
		return days[provided_date.getDay()];
	}

	// Jika tidak ada kondisi di atas yang sesuai, return dalam format yang berbeda
	return `${provided_date.getMonth() + 1}/${provided_date.getDate()}/${provided_date.getFullYear()}`;
}

// Memeriksa apakah dua timestamp sama di hari yang sama
export const isSameDay = (timestamp1: number, timestamp2: number): boolean => {
	const date1 = new Date(timestamp1);
	const date2 = new Date(timestamp2);
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
};

type MessageType = { _creationTime: number };

// Mendapatkan string tanggal relatif (Hari ini, Kemarin, atau hari tertentu dalam seminggu) berdasarkan timestamp pesan
export const getRelativeDateTime = (
	message: MessageType,
	previousMessage?: MessageType
): string | undefined => {
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);
	const lastWeek = new Date(today);
	lastWeek.setDate(lastWeek.getDate() - 7);

	const messageDate = new Date(message._creationTime);

	if (!previousMessage || !isSameDay(previousMessage._creationTime, messageDate.getTime())) {
		if (isSameDay(messageDate.getTime(), today.getTime())) {
			return "Hari ini";
		} else if (isSameDay(messageDate.getTime(), yesterday.getTime())) {
			return "Kemarin";
		} else if (messageDate.getTime() > lastWeek.getTime()) {
			const options: Intl.DateTimeFormatOptions = {
				weekday: "long",
			};
			return messageDate.toLocaleDateString(undefined, options);
		} else {
			const options: Intl.DateTimeFormatOptions = {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			};
			return messageDate.toLocaleDateString(undefined, options);
		}
	}
	return undefined;
};

// Menghasilkan ID acak dengan panjang yang diberikan
export function randomID(len: number) {
	let result = "";
	const chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
	const maxPos = chars.length;

	for (let i = 0; i < (len || 5); i++) {
		result += chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return result;
}

