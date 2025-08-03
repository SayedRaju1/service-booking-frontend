import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Calendar, Star, Users, Clock, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Book Services with
              <span className="text-blue-600"> Ease</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Discover and book appointments with the best service providers in
              your area. From salons to dental clinics, find everything you need
              in one place.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/businesses">
                <Button size="lg" className="text-lg px-8 py-3">
                  Find Services
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-3"
                >
                  Join as Provider
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose Our Platform?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We make booking services simple, secure, and convenient
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Easy Booking</CardTitle>
                <CardDescription>
                  Book appointments in just a few clicks with our intuitive
                  interface
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Verified Providers</CardTitle>
                <CardDescription>
                  All service providers are verified and reviewed by our
                  community
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Secure Payments</CardTitle>
                <CardDescription>
                  Your payments are protected with industry-standard security
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Real-time Availability</CardTitle>
                <CardDescription>
                  See real-time availability and book instantly without phone
                  calls
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Customer Support</CardTitle>
                <CardDescription>
                  24/7 customer support to help you with any questions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Business Management</CardTitle>
                <CardDescription>
                  Complete business management tools for service providers
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Join thousands of customers and service providers who trust our
              platform
            </p>
            <div className="mt-8 flex items-center justify-center gap-x-6">
              <Link href="/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-3"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/businesses">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Browse Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-white">
                  Service Booking
                </span>
              </div>
              <p className="mt-4 text-gray-400">
                Making service booking simple and convenient for everyone.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                For Customers
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link
                    href="/businesses"
                    className="text-gray-300 hover:text-white"
                  >
                    Find Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="text-gray-300 hover:text-white"
                  >
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-gray-300 hover:text-white"
                  >
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                For Providers
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link
                    href="/register"
                    className="text-gray-300 hover:text-white"
                  >
                    Join as Provider
                  </Link>
                </li>
                <li>
                  <Link
                    href="/businesses"
                    className="text-gray-300 hover:text-white"
                  >
                    Manage Business
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="text-gray-300 hover:text-white"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                Company
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-300 hover:text-white"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-300 hover:text-white"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-300 hover:text-white"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-center">
              © 2024 Service Booking System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
