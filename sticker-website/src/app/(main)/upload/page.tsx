import Button from '@/components/shared/Button'
import Input from '@/components/shared/Input'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export default async function UploadPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login?message=You must be logged in to upload a sticker')
  }

  const uploadSticker = async (formData: FormData) => {
    'use server'

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      // This is a safeguard; the page already checks for a user.
      return redirect('/login?message=Authentication required.')
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const isPremium = formData.get('is_premium') === 'on'
    const file = formData.get('file') as File

    if (!file || file.size === 0 || !file.type.includes('webp')) {
      return redirect('/upload?message=A .webp sticker file is required.')
    }

    // 1. Upload file to Supabase Storage with a unique path
    const filePath = `${user.id}/${Date.now()}_${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('stickers') // Assumes a bucket named 'stickers' exists
      .upload(filePath, file)

    if (uploadError) {
      console.error('Upload Error:', uploadError)
      return redirect(`/upload?message=Failed to upload sticker file: ${uploadError.message}`)
    }

    // 2. Get public URL of the uploaded file
    const { data: urlData } = supabase.storage
      .from('stickers')
      .getPublicUrl(filePath)

    if (!urlData) {
        return redirect('/upload?message=Failed to get public URL for sticker.')
    }

    // 3. Insert sticker metadata into the database
    const { error: insertError } = await supabase.from('stickers').insert({
      id_user: user.id,
      title,
      description,
      category,
      is_premium: isPremium,
      file_url: urlData.publicUrl,
    })

    if (insertError) {
      console.error('Insert Error:', insertError)
      // Clean up the uploaded file if the database insert fails
      await supabase.storage.from('stickers').remove([filePath])
      return redirect(`/upload?message=Failed to save sticker information: ${insertError.message}`)
    }

    // 4. Revalidate the home page path to show the new sticker
    revalidatePath('/')
    // Redirect to home page on success
    redirect('/')
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Upload a New Sticker</h1>
      <form action={uploadSticker} className="max-w-lg space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
          <Input id="title" name="title" required />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-black dark:text-white"
          ></textarea>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
          <Input id="category" name="category" placeholder="e.g., Meme, Anime, Cute" />
        </div>
        <div>
          <label htmlFor="file" className="block text-sm font-medium mb-1">Sticker File (.webp)</label>
          <Input id="file" name="file" type="file" accept=".webp" required />
        </div>
        <div className="flex items-center gap-2">
          <input id="is_premium" name="is_premium" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <label htmlFor="is_premium" className="text-sm font-medium">Premium Sticker (requires coins)</label>
        </div>
        <div>
          <Button type="submit" variant="primary">Upload Sticker</Button>
        </div>
      </form>
    </div>
  )
}
