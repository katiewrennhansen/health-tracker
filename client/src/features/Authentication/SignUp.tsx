import { SignUp as SignUpComponent } from "@clerk/react";

export function SignUp() {
  return (
    <div className="flex justify-center">
      <SignUpComponent
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/"
      />
    </div>
  );
}
