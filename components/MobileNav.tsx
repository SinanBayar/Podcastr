"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { sidebarLinks } from "@/constants";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

const MobileNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useClerk();

  return (
    <section className="text-white-1">
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg"
            alt="Menu"
            width={30}
            height={30}
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-black-1">
          <SheetHeader className="hidden">
            <SheetTitle />
            <SheetDescription />
          </SheetHeader>
          <SheetClose asChild>
            <section className="mobile_nav">
              <nav className="flex flex-col gap-6">
                <Link
                  href="/"
                  className="flex cursor-pointer item-center gap-1 pb-10"
                >
                  <Image
                    src="/icons/logo.svg"
                    alt="logo"
                    width={23}
                    height={27}
                  />
                  <h1 className="text-24 font-extrabold text-white-1 ml-2">
                    Podcastr
                  </h1>
                </Link>
                {sidebarLinks.map(({ route, label, imgURL }) => {
                  const isActive =
                    pathname === route ||
                    (label === "My Profile" &&
                      pathname === `${route}/${user?.id}`);
                  return (
                    <SheetClose key={route} asChild>
                      <Link
                        href={
                          label == "My Profile" ? `${route}/${user?.id}` : route
                        }
                        className={cn(
                          "flex gap-3 items-center py-4 justify-start",
                          {
                            "bg-nav-focus border-r-4 border-orange-1": isActive,
                          }
                        )}
                      >
                        <Image
                          src={imgURL}
                          alt={label}
                          width={24}
                          height={24}
                        />
                        <p>{label}</p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
              <div className="flex-center w-full pb-14 pr-8 mt-10">
                <SignedOut>
                  <Button
                    asChild
                    className="text-16 w-full bg-orange-1 font-extrabold"
                  >
                    <Link href="/sign-in">Sign in</Link>
                  </Button>
                </SignedOut>
                <SignedIn>
                  <Button
                    className="text-16 w-full bg-orange-1 font-extrabold"
                    onClick={() => signOut(() => router.push("/"))}
                  >
                    Log out
                  </Button>
                </SignedIn>
              </div>
            </section>
          </SheetClose>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
