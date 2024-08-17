import { signIn } from "@/auth"
import { productName } from "../branding"

export function SignIn() {
  return (
    <div>
      <h1>Welcome to {productName}</h1>
      <p>
        {
          "Since you haven't yet configured your installation, you'll need to sign in with your admin credentials. You should have set up your admin username and password in your environment configuration. Use these to log in, and we can configure some other authentication providers."
        }
      </p>
      <form
        action={async (formData) => {
          "use server"
          await signIn("credentials", formData)
        }}
      >
        <label>
          <div>Username</div>
          <input name="username" type="text" />
        </label>
        <label>
          <div>Password</div>
          <input name="password" type="password" />
        </label>
        <button>Sign In</button>
      </form>
    </div>
  )
}
