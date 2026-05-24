import { dummyLinks } from "@/data/links";
import { Card, CardContent } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center p-6 bg-background">
      <div className="w-full max-w-md flex flex-col gap-4 mt-12">
        {dummyLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            <Card className="w-full hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="flex items-center justify-center p-5">
                <span className="font-medium text-lg">{link.title}</span>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
