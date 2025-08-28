import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Button from '@/components/shared/Button'
import Input from '@/components/shared/Input'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {

  const signUp = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const username = formData.get('username') as string
    const supabase = createClient()

    // Check if username is provided
    if (!username) {
      return redirect('/login?message=Username is required for sign up')
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Pass user metadata to be used in the `handle_new_user` trigger
        data: {
          username: username,
          // We can add more fields here if needed, e.g., photo_url
        },
      },
    })

    if (error) {
      console.error('Sign up error:', error.message)
      return redirect(`/login?message=Could not sign up user: ${error.message}`)
    }

    return redirect('/login?message=Check email to continue sign in process')
  }

  const signIn = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect('/login?message=Could not authenticate user')
    }

    return redirect('/')
  }

  const googleSignIn = async () => {
    'use server'
    const supabase = createClient()
    const origin = headers().get('origin')

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        return redirect('/login?message=Could not authenticate with Google')
    }

    return redirect(data.url)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-black">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 shadow-md dark:border-gray-800 dark:bg-gray-950">
        <h1 className="mb-6 text-center text-2xl font-bold">StickerX</h1>

        <form className="space-y-4">
          <div className="grid gap-2">
            <label htmlFor="email">Email</label>
            <Input id="email" type="email" name="email" placeholder="you@example.com" required />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password">Password</label>
            <Input id="password" type="password" name="password" required />
          </div>
           <div className="grid gap-2">
            <label htmlFor="username">Username (for Sign Up)</label>
            <Input id="username" name="username" placeholder="your_username" />
          </div>

          {searchParams?.message && (
            <p className="mt-4 rounded-md bg-red-100 p-2 text-center text-sm text-red-700 dark:bg-red-900/50 dark:text-red-300">
              {searchParams.message}
            </p>
          )}

          <div className="flex gap-2">
            <Button formAction={signIn} variant="primary" className="w-full">
              Sign In
            </Button>
            <Button formAction={signUp} variant="secondary" className="w-full">
              Sign Up
            </Button>
          </div>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          <span className="mx-4 flex-shrink text-sm text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
        </div>

        <form>
            <Button formAction={googleSignIn} className="w-full" variant="secondary">
                Continue with Google
            </Button>
        </form>

      </div>
    </div>
  )
}
