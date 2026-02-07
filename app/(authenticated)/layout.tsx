import Header from "../components/Header";
import { NewStitchingProvider } from "../contexts/NewStitchingContext";
import { ShopProvider } from "../contexts/ShopContext";
import { ErrorBoundary } from "../components/ErrorBoundary";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <ShopProvider>
        <NewStitchingProvider>
          <Header />
          <div className="min-h-[calc(100vh-4rem)] bg-background">
            {children}
          </div>
        </NewStitchingProvider>
      </ShopProvider>
    </ErrorBoundary>
  );
}
