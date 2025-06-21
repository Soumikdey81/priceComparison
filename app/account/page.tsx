"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, Heart, ShoppingBag, LogOut } from "lucide-react";
import { toast } from "sonner";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const Account = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Logout failed. Please try again.");
    } else {
      toast.success("Logged out successfully!");
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />

      <div className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
            <p className="text-gray-600 mt-2">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Overview */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    JD
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">John Doe</h3>
                    <p className="text-gray-600">john.doe@example.com</p>
                    <p className="text-sm text-gray-500">
                      Member since January 2024
                    </p>
                  </div>
                </div>
                <div className="pt-4">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Price Alerts
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium">Price alert for iPhone 15 Pro</p>
                    <p className="text-sm text-gray-600">
                      Alert triggered - price dropped to $999
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium">Added item to wishlist</p>
                    <p className="text-sm text-gray-600">
                      Samsung Galaxy Watch 6
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">1 day ago</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">Account created</p>
                    <p className="text-sm text-gray-600">
                      Welcome to PriceHunter!
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">3 days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Account;
