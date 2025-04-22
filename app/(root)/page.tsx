"use client";
import { ArrowRight, MessageSquare, Shield, Sparkles } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GradientButton } from "@/components/ui/gradient-button";
import Link from "next/link";
import Image from "next/image";
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="relative w-full rounded-lg py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
          <div className="absolute inset-0 z-0">
            {" "}
            <Image
              src={"/hero-image.jpg"}
              alt="hero image"
              layout="fill"
              objectFit="cover"
              priority
              className="blur-sm"
            />
          </div>
          <div className="container relative px-4 mx-auto md:px-6 z-10">
            {" "}
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl text-shadow-lg text-white font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Chat with Artificial Intelligence about{" "}
                  <span className="block text-purple-400">
                    <AnimatedTextCycle
                      words={[
                        "Technology",
                        "Science",
                        "Health",
                        "Travel",
                        "Food",
                        "Sports",
                        "Entertainment",
                        "Education",
                        "Finance",
                        "Lifestyle",
                        "History",
                        "Art",
                        "Culture",
                      ]}
                      interval={2000}
                    />
                  </span>
                </h1>
                <p className="mx-auto text-shadow-md max-w-[700px] text-white md:text-xl ">
                  Engage in natural and fluent conversations with our advanced
                  artificial intelligence technology. Ask your questions, get
                  information, and request assistance.
                </p>
              </div>
              <div className="space-x-4">
                <GradientButton variant={"variant"} asChild>
                  <Link href={"/chats"}>
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </GradientButton>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-shadow-md text-3xl font-bold tracking-tighter sm:text-5xl">
                  Features
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Unique features offered by our AI chat platform
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              <Card>
                <CardHeader>
                  <Sparkles className="h-10 w-10 mb-2 text-purple-500" />
                  <CardTitle>Smart Assistant</CardTitle>
                  <CardDescription>
                    AI assistant that instantly answers your questions, learns,
                    and personalizes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Our assistant becomes smarter with each interaction and
                    offers a personalized experience by learning your
                    preferences.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <MessageSquare className="h-10 w-10 mb-2 text-purple-500" />
                  <CardTitle>Natural Conversation</CardTitle>
                  <CardDescription>
                    Natural and fluent speaking ability like a human
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Thanks to advanced language models, you can have natural
                    conversations as if you were talking to a real person.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Shield className="h-10 w-10 mb-2 text-purple-500" />
                  <CardTitle>Secure and Private</CardTitle>
                  <CardDescription>
                    Your data is secure, your conversations are private
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    All your data is encrypted and your conversations are kept
                    confidential. Your security is our priority.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl text-shadow-md font-bold tracking-tighter sm:text-5xl">
                  How It Works
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Start your AI chat experience in just three easy steps
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-900 mb-4">
                    1
                  </div>
                  <CardTitle>Create an Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Create your account in seconds with our fast registration
                    process and access our platform.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-900 mb-4">
                    2
                  </div>
                  <CardTitle>Choose a Topic</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Select the topic you want to chat about or start asking
                    questions directly.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-900 mb-4">
                    3
                  </div>
                  <CardTitle>Start Chatting</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Chat naturally with our AI assistant and get instant
                    answers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-shadow-md text-3xl font-bold tracking-tighter sm:text-5xl">
                  Get Started Now
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Start your AI chat experience now and see the difference
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <GradientButton className="w-full" asChild>
                  <Link href={"/chats"}>Try it Free!</Link>
                </GradientButton>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  No credit card required. Cancel anytime.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
