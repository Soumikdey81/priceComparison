"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { UserCircle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUserEmail(session?.user.email ?? null);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserEmail(null);
    router.push("/login");
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            PH
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            PriceHunter
          </span>
        </Link>

        <NavigationMenu className="mx-auto">
          <NavigationMenuList className="hidden sm:flex">
            {["/", "/about", "/how-it-works", "/contact"].map((path, index) => (
              <NavigationMenuItem key={index}>
                <Link
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  href={path}
                >
                  {path === "/"
                    ? "Home"
                    : path.replace("/", "").replace("-", " ")}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4">
          {!userEmail ? (
            <Link href="/login" className="hidden sm:flex">
              <Button variant="outline" className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                <span>Login</span>
              </Button>
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5" />
                  <span>{userEmail ? userEmail.split("@")[0] : ""}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white py-4 px-4 absolute top-full left-0 right-0 border-b border-gray-200 shadow-lg">
          <nav className="space-y-3 flex flex-col">
            {["/", "/about", "/how-it-works", "/contact"].map((path, index) => (
              <Link
                key={index}
                href={path}
                className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                {path === "/"
                  ? "Home"
                  : path.replace("/", "").replace("-", " ")}
              </Link>
            ))}

            <div className="pt-2 border-t border-gray-200">
              {!userEmail ? (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 w-full justify-center"
                  >
                    <UserCircle className="h-5 w-5" />
                    <span>Login</span>
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  className="flex items-center gap-2 w-full justify-center"
                  onClick={handleLogout}
                >
                  <UserCircle className="h-5 w-5" />
                  <span>Logout</span>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
