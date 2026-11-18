import { Metadata } from "next";
import MyAccountClient from "./MyAccountClient";

export const metadata: Metadata = {
  title: "My Account",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MyAccountPage() {
  return <MyAccountClient />;
}

