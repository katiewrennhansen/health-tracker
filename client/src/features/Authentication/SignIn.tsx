import { SignIn as SignInComponent } from "@clerk/react";

export function SignIn() {
  return (
    <div className="flex justify-center">
      <SignInComponent
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/"
      />
    </div>
  );
}
