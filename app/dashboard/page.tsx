import AuthGuard from "@/components/AuthGuard";

export default function Page() {
  return (
    <AuthGuard>
      <h1>Dashboard Page</h1>
    </AuthGuard>
  );
}
