import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const sendTextMessage = mutation({
    args :{
        sender : v.string(),
        content : v.string(),
        conversation : v.id("conversations"),
    },
    handler : async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity(); // Memastikan user sudah login
        if(!identity){
            throw new ConvexError("Not authenticated");
        }
        // Mencari user yang sedang login
        const user = await ctx.db.query("users")
        .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique();

        if(!user){
            throw new ConvexError("User tidak ditemukan");
        }

        // Mencari conversation dimana user sedang berada
        const conversation = await ctx.db.query("conversations")
        .filter((q) => q.eq(q.field("_id"), args.conversation))
        .first();

        if(!conversation){
            throw new ConvexError("Conversation tidak ditemukan");
        }
        
        // Mengecek apakah user ada di dalam conversation
        if(!conversation.participants.includes(user._id)){
            throw new ConvexError("User tidak ada di dalam conversation");
        }

        // Membuat message baru
        await ctx.db.insert("message",{
            content : args.content,
            sender : args.sender,
            conversation : args.conversation,
            messageType : "text",
        })
    }
})

// Optimized
export const getMessages = query({
	args: {
		conversation: v.id("conversations"),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Unauthorized");
		}

		const messages = await ctx.db
			.query("message")
			.withIndex("by_conversation", (q) => q.eq("conversation", args.conversation))
			.collect();

		// Membuat map untuk menyimpan cache profile pengguna
		const userProfileCache = new Map();

		// Membuat array baru yang berisi message dengan data pengirim yang di-join dengan tabel users
		const messagesWithSender = await Promise.all(
			messages.map(async (message) => {
				// Jika pengirim adalah ChatGPT maka return object dengan nama dan image yang sesuai
				if (message.sender === "ChatGPT") {
					const image = message.messageType === "text" ? "/gpt.png" : "dall-e.png";
					return { ...message, sender: { name: "ChatGPT", image } };
				}
				// Membuat variabel untuk menyimpan data pengirim
				let sender;
				// Cek jika data pengirim sudah ada di cache
				if (userProfileCache.has(message.sender)) {
					// Jika ada maka ambil dari cache
					sender = userProfileCache.get(message.sender);
				} else {
					// Jika tidak ada maka ambil dari database
					sender = await ctx.db
						.query("users")
						.filter((q) => q.eq(q.field("_id"), message.sender))
						.first();
					// Simpan data pengirim di cache
					userProfileCache.set(message.sender, sender);
				}

				// Return object dengan data message dan sender yang di-join
				return { ...message, sender };
			})
		);

		// Return array yang sudah di-join dengan tabel users
		return messagesWithSender;
	},
});

export const sendImage = mutation({
	args: { imgId: v.id("_storage"), sender: v.id("users"), conversation: v.id("conversations") },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError("Unauthorized");
		}

		const content = (await ctx.storage.getUrl(args.imgId)) as string;

		await ctx.db.insert("message", {
			content: content,
			sender: args.sender,
			messageType: "image",
			conversation: args.conversation,
		});
	},
});

export const sendVideo = mutation({
	args: { videoId: v.id("_storage"), sender: v.id("users"), conversation: v.id("conversations") },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError("Unauthorized");
		}

		const content = (await ctx.storage.getUrl(args.videoId)) as string;

		await ctx.db.insert("message", {
			content: content,
			sender: args.sender,
			messageType: "video",
			conversation: args.conversation,
		});
	},
});



//kurang optimal
// export const getMessages = query({
//     args : {
//         conversation : v.id("conversations"),
//     },
//     handler : async (ctx, args) => {
//         const identity = await ctx.auth.getUserIdentity(); // Memastikan user sudah login
//         if(!identity){
//             throw new ConvexError("Not authenticated");
//         }
        
//         const messages = await ctx.db.query("message")
//         .withIndex("by_conversation", (q) => 
//             // 'q' adalah objek query yang digunakan untuk membangun kondisi pencarian
//             // 'eq' adalah metode untuk membandingkan nilai bidang dengan nilai yang diberikan
//             q.eq("conversation", args.conversation)
//         )
//         .collect();

//         const whoSendMessages = await Promise.all(
//             messages.map((message) => 
//                 ctx.db.query("users")
//                 .filter((q) => q.eq(q.field("_id"), message.sender))
//                 .first()
//             )
//         );
//             return {...messages, whoSendMessages};
       
//     }
// })
