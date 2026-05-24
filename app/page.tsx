"use client";

import { useState } from "react";
import { dummyLinks } from "@/data/links";
import { Card, CardContent } from "@/components/ui/card";
import { User, Code, Camera, Video, Mail, Share2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [links, setLinks] = useState(dummyLinks);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const handleAddLink = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    
    let finalUrl = newUrl.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`;
    }

    const newLink = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      url: finalUrl,
    };
    
    setLinks([newLink, ...links]);
    setNewTitle("");
    setNewUrl("");
    setIsAddDialogOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-6 bg-mesh-gradient text-white">
      {/* Container */}
      <div className="w-full max-w-md flex flex-col gap-6 mt-8 relative z-10">
        
        {/* Share Button */}
        <div className="absolute top-0 right-0">
          <button className="p-2 rounded-full glass-card hover:bg-white/20 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-full glass-card flex items-center justify-center border-2 border-white/40 shadow-xl overflow-hidden bg-white/10 backdrop-blur-md">
             <User className="w-12 h-12 text-white/80" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">@frontend_dev</h1>
            <p className="text-white/80 mt-1 text-sm font-medium">프론트엔드 개발자 포트폴리오</p>
          </div>
        </div>

        {/* Social Quick Links */}
        <div className="flex justify-center gap-4 my-2">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full glass-card hover:-translate-y-1 hover:bg-white/20 transition-all">
            <Camera className="w-5 h-5" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full glass-card hover:-translate-y-1 hover:bg-white/20 transition-all">
            <Video className="w-5 h-5" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full glass-card hover:-translate-y-1 hover:bg-white/20 transition-all">
            <Code className="w-5 h-5" />
          </a>
          <a href="mailto:example@gmail.com" className="p-3 rounded-full glass-card hover:-translate-y-1 hover:bg-white/20 transition-all">
            <Mail className="w-5 h-5" />
          </a>
        </div>

        {/* Add Link Button & Dialog */}
        <div className="flex justify-center w-full mt-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm shadow-md rounded-xl py-6 text-base gap-2">
                <Plus className="w-5 h-5" /> 새로운 링크 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-zinc-900 border border-zinc-800 text-white rounded-xl">
              <DialogHeader>
                <DialogTitle>새로운 링크 추가</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="title" className="text-zinc-400">타이틀</Label>
                  <Input
                    id="title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="예: 내 포트폴리오"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-600"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="url" className="text-zinc-400">URL</Label>
                  <Input
                    id="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-600"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsAddDialogOpen(false)}
                  className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  취소
                </Button>
                <Button 
                  onClick={handleAddLink}
                  disabled={!newTitle.trim() || !newUrl.trim()}
                  className="bg-white text-black hover:bg-zinc-200"
                >
                  추가하기
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Links List */}
        <div className="flex flex-col gap-4 mt-2">
          {links.map((link) => {
            let domain = "google.com";
            try {
              domain = new URL(link.url).hostname;
            } catch (e) {
              // Handle invalid URLs smoothly
            }
            const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
            
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Card className="w-full glass-card hover:-translate-y-1 hover:bg-white/20 border-0 transition-all duration-300 cursor-pointer overflow-hidden group">
                  <CardContent className="flex items-center p-4 relative">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 overflow-hidden mr-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={faviconUrl} alt={`${link.title} icon`} className="w-6 h-6 object-contain" />
                    </div>
                    <span className="font-semibold text-lg text-white group-hover:scale-105 transition-transform duration-300">
                      {link.title}
                    </span>
                  </CardContent>
                </Card>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
