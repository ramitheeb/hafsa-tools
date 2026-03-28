import { api } from '../api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BookOpen,
  ClipboardList,
  StickyNote,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

interface Props {
  onLogout: () => void;
}

const tools: { title: string; description: string; icon: LucideIcon }[] = [
  { title: 'Flashcards', description: 'Create and review flashcards', icon: BookOpen },
  { title: 'Practice Quizzes', description: 'Test your knowledge with quizzes', icon: ClipboardList },
  { title: 'Notes', description: 'Organize your study notes', icon: StickyNote },
  { title: 'Progress Tracker', description: 'Track your study progress', icon: TrendingUp },
];

export function Dashboard({ onLogout }: Props) {
  async function handleLogout() {
    await api.logout();
    onLogout();
  }

  return (
    <div className="min-h-svh">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <h1 className="text-lg font-bold">Hafsa Tools</h1>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Log out
        </Button>
      </header>

      <main className="mx-auto max-w-4xl p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            Welcome, Dr. Hafsa!
          </h2>
          <p className="text-muted-foreground">
            Your exam preparation tools will appear here.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => (
            <Card key={tool.title} className="transition-colors hover:border-foreground/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <tool.icon className="h-5 w-5 text-muted-foreground" />
                  <Badge variant="secondary">Coming soon</Badge>
                </div>
                <CardTitle className="text-base">{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
