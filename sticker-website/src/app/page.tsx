import StickerPost from "@/components/shared/StickerPost";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function HomePage() {
  const supabase = createClient();

  // Fetch stickers and the user who posted them (joining the 'users' table)
  // Note: The table name in the select query should match the actual table name.
  // Assuming the foreign key relationship is set up correctly.
  const { data: stickers, error } = await supabase
    .from('stickers')
    .select(`
      id,
      title,
      file_url,
      is_premium,
      likes_count,
      downloads_count,
      created_at,
      users (
        username,
        photo_url
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching stickers:', error.message);
    return <p className="p-4 text-red-500">Could not load stickers: {error.message}</p>;
  }

  if (!stickers || stickers.length === 0) {
    return <p className="p-4 text-center text-gray-500">No stickers found. Be the first to upload one!</p>;
  }

  return (
    <div>
      {stickers.map((sticker) => {
        // The joined user data might be an object or null
        const userProfile = sticker.users;

        return (
          <StickerPost
            key={sticker.id}
            user={{
              name: userProfile?.username ?? 'Unknown User',
              handle: userProfile?.username ?? 'unknown',
              avatarUrl: userProfile?.photo_url ?? null,
            }}
            sticker={{
              // Assuming a placeholder for now, as file_url will be the actual sticker
              imageUrl: 'https://via.placeholder.com/400',
              title: sticker.title,
              isPremium: sticker.is_premium,
            }}
            stats={{
              likes: sticker.likes_count,
              comments: 0, // Placeholder, as we don't have a comments_count column yet
              downloads: sticker.downloads_count,
            }}
          />
        );
      })}
    </div>
  );
}
