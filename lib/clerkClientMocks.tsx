//clerkClientMocks.tsx
import React from "react";

export const ClerkProvider = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="mock-clerk-provider">{children}</div>
);

export const SignIn = () => <div data-testid="mock-sign-in">Mock Sign In</div>;

export const SignUp = () => <div data-testid="mock-sign-up">Mock Sign Up</div>;

export const UserButton = () => (
  <div data-testid="mock-user-button">Mock User Button</div>
);
