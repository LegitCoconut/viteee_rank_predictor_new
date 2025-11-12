import { Globe, Instagram, Mail } from "lucide-react";
import Link from "next/link";

const VhomeLogo = () => (
    <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
    >
        <path d="M12 2L2 7V22H22V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 22V17H17V22H12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 22V12H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


export function Footer() {
  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 mt-12 border-t">
      <div className="container mx-auto text-center px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-muted-foreground mb-8">
            <div className="flex flex-col gap-4 items-center md:items-start">
                <Link href="https://malabarmatrix.site" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Globe className="h-5 w-5" />
                    <span>Malabar Matrix</span>
                </Link>
                <Link href="https://vhome.co.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <VhomeLogo />
                    <span>Vhome</span>
                </Link>
            </div>
            <div className="flex flex-col gap-4 items-center md:items-end">
                <a href="mailto:contact@malabarmatrix.site" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Mail className="h-5 w-5" />
                    <span>Contact Us</span>
                </a>
                <Link href="https://instagram.com/malabar.matrix" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Instagram className="h-5 w-5" />
                    <span>malabar.matrix</span>
                </Link>
            </div>
        </div>

        <div className="border-t pt-6">
            <p>&copy; 2025 Malabar Matrix. All rights reserved.</p>
            <p>In association with vhome.co.in</p>
        </div>
      </div>
    </footer>
  );
}
