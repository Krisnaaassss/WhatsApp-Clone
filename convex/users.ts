import { ConvexError, v } from "convex/values"; 
import { internalMutation } from "./_generated/server"; 

/**
 * Membuat user baru dengan tokenIdentifier, email, image, dan name.
 * Jika berhasil, maka akan mengembalikan dokumen user yang baru dibuat.
 * Jika gagal, maka akan mengembalikan ConvexError.
 */
export const createUser = internalMutation({
    args: {
        tokenIdentifier: v.string(), // TokenIdentifier user
        email: v.string(), // Email user
        image: v.string(), // Image user
        name: v.string(), // Nama user
    },
    handler: async (ctx, args) => {
        // Membuat dokumen user baru dengan data yang diberikan
        await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,
            email: args.email,
            image: args.image,
            name: args.name,
            isOnline: true, // User online secara default
        });
    }
})

/**
 * Mengubah status user menjadi offline.
 * Jika user tidak ditemukan, maka akan mengembalikan ConvexError.
 */
export const setUserOffline = internalMutation({
    args: { tokenIdentifier: v.string() }, // TokenIdentifier user
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
            .unique(); // Cari dokumen user dengan tokenIdentifier yang sama

        if (!user) {
            throw new ConvexError("User not found"); // Jika user tidak ditemukan, maka mengembalikan ConvexError
        }

        await ctx.db.patch(user._id, { isOnline: false }); // Mengubah status user menjadi offline
    }
})

/**
 * Mengubah status user menjadi online.
 * Jika user tidak ditemukan, maka akan mengembalikan ConvexError.
 */
export const setUserOnline = internalMutation({
    args: { tokenIdentifier: v.string() }, // TokenIdentifier user
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
            .unique(); // Cari dokumen user dengan tokenIdentifier yang sama

        if (!user) {
            throw new ConvexError("User not found"); // Jika user tidak ditemukan, maka mengembalikan ConvexError
        }

        await ctx.db.patch(user._id, { isOnline: true }); // Mengubah status user menjadi online
    }
})

/**
 * Mengubah image user yang memiliki tokenIdentifier yang sama.
 * Jika user tidak ditemukan, maka akan mengembalikan ConvexError.
 */
export const updateUser = internalMutation({
    args: {
        tokenIdentifier: v.string(), // TokenIdentifier user
        image: v.string(), // Image yang akan diubah
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
            .unique(); // Cari dokumen user dengan tokenIdentifier yang sama

        if (!user) {
            throw new ConvexError("User not found"); // Jika user tidak ditemukan, maka mengembalikan ConvexError
        }

        await ctx.db.patch(user._id, { image: args.image }); // Mengubah image user
    } 
})
