interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}

interface Syntalkic {
  id: string;
  role: string;
  topic: string;
  questions: string[];
  createdAt: string;
  userId: string;
  finalized: boolean;
}

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}

interface User {
  name: string;
  email: string;
  id: string;
}

interface SyntalkicCardProps {
  id?: string;
  userId?: string;
  role: string;
  topic: string;
  createdAt?: string;
  className?: string;
  description?: string;
}

interface AgentProps {
  userName: string;
  userId?: string;
  syntalkicId?: string;
  feedbackId?: string;
  type: "generate" | "syntalkic";
  topic?: string;
  role?: string;
  questions?: string[];
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface GetLatestSyntalkicsParams {
  userId: string;
  limit?: number;
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

type FormType = "sign-in" | "sign-up";

interface LogoProps {
  className: string;
  type: "full" | "single";
}
