import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authSeller from "@/lib/authSeller";
import connectDB from "@/config/db.js";

export async function DELETE(request) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Not authorized" });
        }

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get("id");

        await connectDB();
        await Product.findByIdAndDelete(productId);

        return NextResponse.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
