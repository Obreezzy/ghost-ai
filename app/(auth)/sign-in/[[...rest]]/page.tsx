import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        variables: {
          colorPrimary: "var(--accent-primary)",
          colorPrimaryForeground: "hsl(var(--primary-foreground))",
        },
        elements: {
          cardBox: { width: "100%" },
          card: { width: "100%" },
          scrollBox: { width: "100%" },
          formFieldInput: {
            transition: "border-color 150ms ease, box-shadow 150ms ease",
          },
          formButtonPrimary: {
            transition: "background-color 150ms ease, box-shadow 150ms ease",
          },
        },
      }}
    />
  );
}