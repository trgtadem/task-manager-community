"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Users, Megaphone, AlertTriangle, Lightbulb, ArrowRight, Calendar, BookOpen, Heart } from "lucide-react"

interface LandingPageProps {
  onLoginClick: () => void
  onSignUpClick: () => void
}

// Mock announcements data
const announcements = [
  {
    id: 1,
    title: "Community Meetup - December 2025",
    description: "Join us for our annual winter meetup! Networking, workshops, and more.",
    date: "Dec 20, 2025",
    category: "Event",
  },
  {
    id: 2,
    title: "New Task Management Features",
    description: "We've rolled out batch task assignments and improved notifications.",
    date: "Dec 10, 2025",
    category: "Update",
  },
  {
    id: 3,
    title: "Volunteer Opportunity",
    description: "Help us organize the upcoming charity drive. Sign up now!",
    date: "Dec 5, 2025",
    category: "Volunteer",
  },
]

// Mock project retrospectives data
const retrospectives = [
  {
    id: 1,
    title: "Server Overload Incident 2023",
    mistake: "Insufficient load balancing during a traffic spike caused 4 hours of downtime.",
    lesson: "Implemented auto-scaling and load balancers. Added traffic monitoring alerts.",
    severity: "high",
    icon: AlertTriangle,
  },
  {
    id: 2,
    title: "Database Schema Redesign",
    mistake: "Initial flat structure led to slow queries and data duplication as we scaled.",
    lesson: "Normalized database structure. Now we design with growth in mind from day one.",
    severity: "medium",
    icon: BookOpen,
  },
  {
    id: 3,
    title: "Communication Breakdown Q2",
    mistake: "Lack of clear channels caused missed deadlines and duplicated work.",
    lesson: "Established weekly syncs, a shared task board, and clear ownership for each project.",
    severity: "medium",
    icon: Lightbulb,
  },
]

export function LandingPage({ onLoginClick, onSignUpClick }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar onLoginClick={onLoginClick} onSignUpClick={onSignUpClick} />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-muted/30">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              Welcome to the Community
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
              Building Together, Learning from Every Step
            </h1>
            <p className="mb-8 text-lg text-muted-foreground text-pretty">
              CommunityHub is where teams collaborate, manage tasks, and share knowledge. We believe in transparency -
              including our mistakes, so everyone can learn and grow.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" onClick={onSignUpClick}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={onLoginClick}>
                Login to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Announcements */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Megaphone className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Community Announcements</h2>
            <p className="text-muted-foreground">Latest news and updates from the team</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {announcements.map((item) => (
            <Card key={item.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{item.category}</Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {item.date}
                  </span>
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Project Retrospectives Section */}
      <section className="border-y bg-amber-50/50 dark:bg-amber-950/10">
        <div className="container mx-auto px-4 py-16">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Project Retrospectives</h2>
              <p className="text-muted-foreground">
                Mistakes we made and lessons we learned - because growth comes from honesty
              </p>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {retrospectives.map((item) => {
              const IconComponent = item.icon
              return (
                <Card key={item.id} className="border-amber-200/50 bg-background dark:border-amber-800/30">
                  <CardHeader>
                    <div className="mb-2 flex items-center gap-2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          item.severity === "high"
                            ? "bg-red-100 dark:bg-red-900/30"
                            : "bg-amber-100 dark:bg-amber-900/30"
                        }`}
                      >
                        <IconComponent
                          className={`h-4 w-4 ${
                            item.severity === "high"
                              ? "text-red-600 dark:text-red-400"
                              : "text-amber-600 dark:text-amber-400"
                          }`}
                        />
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          item.severity === "high"
                            ? "border-red-300 text-red-700 dark:border-red-800 dark:text-red-400"
                            : "border-amber-300 text-amber-700 dark:border-amber-800 dark:text-amber-400"
                        }
                      >
                        {item.severity === "high" ? "Critical" : "Notable"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
                        What Went Wrong
                      </p>
                      <p className="text-sm text-muted-foreground">{item.mistake}</p>
                    </div>
                    <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-400">
                        Lesson Learned
                      </p>
                      <p className="text-sm text-green-800 dark:text-green-300">{item.lesson}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Community Info Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">About Our Community</h2>
              <p className="text-muted-foreground">Who we are and what we stand for</p>
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We bring together passionate individuals who believe in collaborative growth. Our platform enables
                  seamless task management, transparent communication, and shared learning from both successes and
                  failures.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Our Values
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                    Transparency in everything we do
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                    Continuous learning from mistakes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                    Empowering every team member
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="font-semibold">CommunityHub</span>
          </div>
          <p className="text-sm text-muted-foreground">Building better teams through transparency and collaboration.</p>
        </div>
      </footer>
    </div>
  )
}
