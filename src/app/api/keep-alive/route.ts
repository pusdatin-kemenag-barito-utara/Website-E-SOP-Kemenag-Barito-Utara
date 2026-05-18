import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { success: false, error: "Missing Supabase environment variables." },
      { status: 500 }
    );
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Lakukan query super ringan ke tabel profiles untuk memicu aktivitas koneksi database
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .limit(1);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Supabase database pinged successfully to stay active!",
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (error: unknown) {
    console.error("Keep-alive connection failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to ping database";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
