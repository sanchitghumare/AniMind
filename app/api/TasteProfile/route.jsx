import fetchTasteProfile from "@/lib/generateTasteProfile";
export async function GET(){
    const profile=await fetchTasteProfile();
    return new Response(JSON.stringify(profile),{status:200});
}   