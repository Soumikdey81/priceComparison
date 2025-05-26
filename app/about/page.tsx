import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />

      <div className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-12">
          About PriceHunter
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              At PriceHunter, we're committed to helping shoppers find the best
              deals across the web. Our mission is to simplify the online
              shopping experience by bringing transparency to e-commerce pricing
              and helping consumers make informed purchasing decisions.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Team working"
              className="w-full h-64 object-cover"
            />
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We believe in full price transparency across all e-commerce
                  platforms to help consumers make the best choices.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Simplicity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We strive to make price comparison simple and accessible to
                  everyone, saving time and reducing the complexity of online
                  shopping.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We continuously improve our technology to provide the most
                  accurate, up-to-date pricing information and innovative search
                  methods.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Story
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            PriceHunter is a personal academic project started in 2025 by a
            group of technology enthusiasts aiming to create an efficient price
            comparison tool. The project was motivated by the time-consuming and
            error-prone manual process of comparing prices across multiple
            e-commerce websites.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            To build PriceHunter, the team implemented web scraping techniques
            to automatically collect product data from various online retailers
            in real time. Additionally, the project integrates artificial
            intelligence (AI) for advanced features like image-based product
            search and smart deal recommendations, improving accuracy and user
            experience.
          </p>
          <p className="text-gray-600 leading-relaxed">
            While not a commercial startup, PriceHunter functions as a
            comprehensive platform demonstrating practical applications of web
            scraping, AI, API integration, and front-end development. This
            project serves as a robust academic exercise in solving real-world
            problems using modern web technologies and machine learning.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Page;
