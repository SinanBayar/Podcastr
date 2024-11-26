"use client";

import Image from "next/image";
import Link from "next/link";
import { sidebarLinks } from "@/constants";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { useAudio } from "@/providers/AudioProvider";

const LeftSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { audio } = useAudio();
  const {user} = useClerk()
  return (
    <section
      className={cn("left_sidebar h-lvh", {
        "h-[calc(100vh-128px)]": audio?.audioUrl,
      })}
    >
      <nav className="flex flex-col gap-6">
        <Link href="/" className="flex cursor-pointer item-center gap-1 pb-10">
          <Image src="/icons/logo.svg" alt="logo" width={23} height={27} />
          <h1 className="text-24 font-extrabold text-white max-md:hidden">
            Podcastr
          </h1>
        </Link>

        {sidebarLinks.map(({ route, label, imgURL }) => {
          const isActive =
            pathname === route || (label === "My Profile" && pathname === `${route}/${user?.id}`);
          return (
            <Link
              href={label == "My Profile" ? `${route}/${user?.id}` : route}
              key={label}
              className={cn("flex gap-3 items-center py-4", {
                "bg-nav-focus border-r-4 border-orange-1": isActive,
              })}
            >
              <Image src={imgURL} alt={label} width={24} height={24} />
              <p>{label}</p>
            </Link>
          );
        })}
      </nav>

      <SignedOut>
        <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
          <Button asChild className="text-16 w-full bg-orange-1 font-extrabold">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex-center w-full pb-14 pr-8 mt-10">
          <Button
            className="text-16 w-full bg-orange-1 font-extrabold"
            onClick={() => signOut(() => router.push("/"))}
          >
            Log out
          </Button>
        </div>
      </SignedIn>
    </section>
  );
};

export default LeftSidebar;
