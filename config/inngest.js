import { Inngest } from "inngest";
import connectDB from "./db.js";
import User from "@/models/user.js";
import Order from "@/models/Order.js";


// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next",apiBase: "http://localhost:8288" });


// Inngest Function to save user data to database
export const syncUserCreation = inngest.createFunction(
    {
        id:'sync-user-from-clerk'
    },
    {event: "clerk/user.created"},
    async ({event}) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData ={
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl: image_url
        }
        // Save user data to database
        await connectDB();
        await User.create(userData)
    }
)

// Inngest func to update user data to database
export const syncUserUpdation = inngest.createFunction(
    {
        id:'sync-user-update-from-clerk'
    },
    {event: "clerk/user.updated"},
    async ({event}) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData ={
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl: image_url
        }
        // Update user data to database
        await connectDB();
        await User.findByIdAndUpdate(id, userData)
    }
)

// Inngest Function to delete user data from database
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-with-clerk'
    },
    {
        event: "clerk/user.deleted"
    },
    async ({ event }) => {
        const { id } = event.data;
        // Delete user data from database
        await connectDB();
        await User.findByIdAndDelete(id);
    }
)

// Inngest Funciton to create user's order in database
export const createUserOrder = inngest.createFunction({
    id:'create-user-order',
    batchEvents:{
        maxSize:5,
        timeout:'5s'
    }
},
{event:'order/created'},
async (events) => {
    const orders = events.attempt((event)=> {
        return {
            userId: event.data.userId,
            items: event.data.items,
            amount: event.data.amount,
            address: event.data.address,
            date: event.data.date
        }
    }) 

    await connectDB();
    await Order.insertMany(orders);

    return {
        success: true,
        processed: orders.length
    }

}
)