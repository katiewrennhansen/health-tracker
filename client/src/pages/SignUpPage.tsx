import { SignUp } from "@clerk/react";

export function SignUpPage() {
  return (
    <div className="flex justify-center">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/"
      />
    </div>
  );
}
