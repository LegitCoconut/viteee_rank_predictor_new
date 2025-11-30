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
        <div className="border-t pt-6">
            <p>&copy; 2025 Malabar Matrix. All rights reserved.</p>
            <p>In association with vhome.co.in</p>
        </div>
      </div>
    </footer>
  );
}
