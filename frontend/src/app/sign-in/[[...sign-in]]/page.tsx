import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f8f9] p-6">
      <SignIn
        path="/sign-in"
        routing="path"
        withSignUp={false}
        fallbackRedirectUrl="/employee-panel"
      />
    </main>
  );
}
