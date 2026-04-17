import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 mt-12 border-t">
      <div className="container mx-auto text-center px-4 space-y-2">
        <p>&copy; 2025 Malabar Matrix. All rights reserved.</p>
        <p>In association with vhome.co.in</p>
        <p className="text-sm text-muted-foreground">
          <Link href="/terms" className="hover:text-foreground underline underline-offset-4">
            Terms &amp; Conditions
          </Link>
        </p>
      </div>
    </footer>
  );
}
