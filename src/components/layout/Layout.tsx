import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MobileTabBar from "./MobileTabBar";

type LayoutProps = {
  children: ReactNode;
  showFooter?: boolean;
};

export default function Layout({ children, showFooter = true }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col pb-12 md:pb-0">
      <Navbar />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
      <MobileTabBar />
    </div>
  );
}
