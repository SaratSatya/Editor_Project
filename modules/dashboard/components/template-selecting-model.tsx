"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  ChevronRight,
  Search,
  Star,
  Code,
  Server,
  Globe,
  Zap,
  Clock,
  Check,
  Plus,
} from "lucide-react";

type TemplateSelectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
    description?: string;
  }) => void;
};

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  popularity: number;
  tags: string[];
  features: string[];
  category: "frontend" | "backend" | "fullstack";
}

const templates: TemplateOption[] = [
  {
    id: "react",
    name: "React",
    description:
      "A JavaScript library for building user interfaces with component-based architecture",
    icon: "/react.svg",
    color: "#61DAFB",
    popularity: 5,
    tags: ["UI", "Frontend", "JavaScript"],
    features: ["Component-Based", "Virtual DOM", "JSX Support"],
    category: "frontend",
  },
  {
    id: "nextjs",
    name: "Next.js",
    description:
      "The React framework for production with server-side rendering and static site generation",
    icon: "/nextjs-icon.svg",
    color: "#000000",
    popularity: 4,
    tags: ["React", "SSR", "Fullstack"],
    features: ["Server Components", "API Routes", "File-based Routing"],
    category: "fullstack",
  },
  {
    id: "express",
    name: "Express",
    description:
      "Fast, unopinionated, minimalist web framework for Node.js to build APIs and web applications",
    icon: "/expressjs-icon.svg",
    color: "#000000",
    popularity: 4,
    tags: ["Node.js", "API", "Backend"],
    features: ["Middleware", "Routing", "HTTP Utilities"],
    category: "backend",
  },
  {
    id: "vue",
    name: "Vue.js",
    description:
      "Progressive JavaScript framework for building user interfaces with an approachable learning curve",
    icon: "/vuejs-icon.svg",
    color: "#4FC08D",
    popularity: 4,
    tags: ["UI", "Frontend", "JavaScript"],
    features: ["Reactive Data Binding", "Component System", "Virtual DOM"],
    category: "frontend",
  },
  {
    id: "hono",
    name: "Hono",
    description:
      "Fast, lightweight, built on Web Standards. Support for any JavaScript runtime.",
    icon: "/hono.svg",
    color: "#e36002",
    popularity: 3,
    tags: ["Node.js", "TypeScript", "Backend"],
    features: [
      "Dependency Injection",
      "TypeScript Support",
      "Modular Architecture",
    ],
    category: "backend",
  },
  {
    id: "angular",
    name: "Angular",
    description:
      "Angular is a web framework that empowers developers to build fast, reliable applications.",
    icon: "/angular-2.svg",
    color: "#DD0031",
    popularity: 3,
    tags: ["UI", "Fullstack", "TypeScript"],
    features: [
      "Reactive Data Binding",
      "Component System",
      "Dependency Injection",
      "TypeScript Support",
    ],
    category: "fullstack",
  },
];

const TemplateSelectionModal = ({
  isOpen,
  onClose,
  onSubmit,
}: TemplateSelectionModalProps) => {
  const [step, setStep] = useState<"select" | "configure">("select");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<
    "all" | "frontend" | "backend" | "fullstack"
  >("all");
  const [projectName, setProjectName] = useState("");

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      category === "all" || template.category === category;

    return matchesCategory && matchesSearch;
  });

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleContinue = () => {
    if (selectedTemplate) setStep("configure");
  };

  const handleCreateProject = () => {
    if (!selectedTemplate) return;

    const templateMap: Record<
      string,
      "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR"
    > = {
      react: "REACT",
      nextjs: "NEXTJS",
      express: "EXPRESS",
      vue: "VUE",
      hono: "HONO",
      angular: "ANGULAR",
    };

    const mappedTemplate = templateMap[selectedTemplate];

    onSubmit({
      title: projectName || templates.find((t) => t.id === selectedTemplate)!.name,
      template: mappedTemplate,
    });

    onClose();
    setStep("select");
    setSelectedTemplate(null);
    setProjectName("");
  };

  const handleBack = () => setStep("select");

  const renderStars = (count: number) =>
    Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < count ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
          }
        />
      ));

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          setStep("select");
          setSelectedTemplate(null);
          setProjectName("");
        }
      }}
    >
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        {step === "select" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#e93f3f] flex items-center gap-2">
                <Plus size={24} className="text-[#e93f3f]" />
                Select a Template
              </DialogTitle>
              <DialogDescription>
                Choose a template to create your new playground
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-6 py-4">
              {/* Search + Tabs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Tabs
                  defaultValue="all"
                  className="w-full sm:w-auto"
                  onValueChange={(value) =>
                    setCategory(value as "all" | "frontend" | "backend" | "fullstack")
                  }
                >
                  <TabsList className="grid grid-cols-4 w-full sm:w-[400px]">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="frontend">Frontend</TabsTrigger>
                    <TabsTrigger value="backend">Backend</TabsTrigger>
                    <TabsTrigger value="fullstack">Fullstack</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Template Cards */}
              <RadioGroup
                value={selectedTemplate || ""}
                onValueChange={handleSelectTemplate}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTemplates.length ? (
                    filteredTemplates.map((template) => (
                      <label
                        key={template.id}
                        htmlFor={template.id}
                        className={`relative flex cursor-pointer flex-col gap-3 rounded-lg border bg-background px-4 py-4 transition-all hover:border-[#e93f3f] hover:bg-muted ${
                          selectedTemplate === template.id
                            ? "border-[#e93f3f] shadow-[0_0_0_1px_#e93f3f,0_8px_24px_rgba(233,63,63,0.3)]"
                            : "shadow-sm"
                        }`}
                        onClick={() => handleSelectTemplate(template.id)}
                      >
                        <div className="absolute right-3 top-3 flex gap-1">
                          {renderStars(template.popularity)}
                        </div>

                        {selectedTemplate === template.id && (
                          <div className="absolute left-3 top-3 rounded-full bg-[#e93f3f] p-1 text-white">
                            <Check size={14} />
                          </div>
                        )}

                        <div className="flex gap-4">
                          <div
                            className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full"
                            style={{
                              backgroundColor: `${template.color}26`, // ~15% opacity
                            }}
                          >
                            <Image
                              src={template.icon || "/placeholder.svg"}
                              alt={`${template.name} icon`}
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          </div>

                          <div className="flex flex-col">
                            <div className="mb-1 flex items-center gap-2">
                              <h3 className="text-lg font-semibold">
                                {template.name}
                              </h3>
                              <div className="flex gap-1">
                                {template.category === "frontend" && (
                                  <Code size={14} className="text-blue-500" />
                                )}
                                {template.category === "backend" && (
                                  <Server
                                    size={14}
                                    className="text-green-500"
                                  />
                                )}
                                {template.category === "fullstack" && (
                                  <Globe
                                    size={14}
                                    className="text-purple-500"
                                  />
                                )}
                              </div>
                            </div>

                            <p className="mb-3 text-sm text-muted-foreground">
                              {template.description}
                            </p>

                            <div className="mt-auto flex flex-wrap gap-2">
                              {template.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-2xl border px-2 py-1 text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <RadioGroupItem
                          value={template.id}
                          id={template.id}
                          className="sr-only"
                        />
                      </label>
                    ))
                  ) : (
                    <div className="col-span-2 flex flex-col items-center justify-center p-8 text-center">
                      <Search size={48} className="mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium">
                        No templates found
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  )}
                </div>
              </RadioGroup>
            </div>

            <div className="mt-4 flex justify-between gap-3 border-t pt-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock size={14} className="mr-1" />
                <span>
                  Estimated setup time:{" "}
                  {selectedTemplate ? "2–5 minutes" : "Select a template"}
                </span>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  className="bg-[#E93F3F] hover:bg-[#d03636]"
                  disabled={!selectedTemplate}
                  onClick={handleContinue}
                >
                  Continue <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#e93f3f]">
                Configure Your Project
              </DialogTitle>
              <DialogDescription>
                {templates.find((t) => t.id === selectedTemplate)?.name} project
                configuration
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-6 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="my-awesome-project"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>

              <div className="rounded-lg border p-4 shadow-[0_0_0_1px_#E93F3F,0_8px_20px_rgba(233,63,63,0.15)]">
                <h3 className="mb-2 font-medium">Selected Template Features</h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {templates
                    .find((t) => t.id === selectedTemplate)
                    ?.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Zap size={14} className="text-[#E93F3F]" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between gap-3 border-t pt-4">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button
                className="bg-[#E93F3F] hover:bg-[#d03636]"
                onClick={handleCreateProject}
                disabled={!selectedTemplate}
              >
                Create Project
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelectionModal;
