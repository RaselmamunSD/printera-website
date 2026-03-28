"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

const FALLBACK_PROJECTS = [
  {
    id: 1,
    title: "City Hall ADA Signage Package",
    category: "Corporate Offices",
    description:
      "Direct-mounted high-end acrylic signage system for medical buildings.",
    image: "/portfolio/port1.png",
    external_url: "",
  },
  {
    id: 2,
    title: "Corporate Office Nameplates",
    category: "Government Projects",
    description:
      "Multi-floor directional signage with high-contrast ADA compliance.",
    image: "/portfolio/port2.png",
    external_url: "",
  },
  {
    id: 3,
    title: "Hospital Wayfinding System",
    category: "Retail",
    description:
      "Custom dimensional letters and window vinyl for high-traffic retail.",
    image: "/portfolio/port3.png",
    external_url: "",
  },
  {
    id: 4,
    title: "Retail Store Signage",
    category: "Government Projects",
    description: "Exterior pylon and building identification signage.",
    image: "/portfolio/port4.png",
    external_url: "",
  },
  {
    id: 5,
    title: "University Campus Signs",
    category: "Corporate Offices",
    description: "Polished metal nameplates and frosted glass partitions.",
    image: "/portfolio/port5.png",
    external_url: "",
  },
  {
    id: 6,
    title: "Law Firm Office Suite",
    category: "Retail",
    description:
      "Full exterior and interior signage for a boutique restaurant.",
    image: "/portfolio/port6.png",
    external_url: "",
  },
  {
    id: 7,
    title: "Restaurant Branding Package",
    category: "Government Projects",
    description:
      "Custom-designed directional and informational signage for museum exhibits.",
    image: "/portfolio/port7.png",
    external_url: "",
  },
  {
    id: 8,
    title: "Government Building Directory",
    category: "Retail",
    description:
      "Complete branding solution for a luxury hotel including lobby and guest room signage.",
    image: "/portfolio/port8.png",
    external_url: "",
  },
];

const normalizeProject = (project) => ({
  id: project.id,
  title: project.title || "Untitled Project",
  category: project.category || "Uncategorized",
  description: project.description || "No description available.",
  image: project.image_url || project.image || "/portfolio/port1.png",
  external_url: project.external_url || "",
});

const ProjectCard = ({ project }) => {
  const detailsHref = project.external_url || "#";
  const isExternal = Boolean(project.external_url);

  return (
    <div className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg animate-in fade-in zoom-in duration-500">
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <Image
          src={project.image}
          alt={project.title}
          fill
          unoptimized={project.image.startsWith("http")}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-[10px] font-bold text-[#EE2A24] uppercase tracking-widest mb-1">
          {project.category}
        </span>
        <h3 className="text-lg font-bold text-[#1e1e2d] mb-2 leading-tight">
          {project.title}
        </h3>
        <p className="text-gray-400 text-sm mb-6 flex-grow leading-relaxed">
          {project.description}
        </p>
        <a
          href={detailsHref}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className={`inline-flex items-center text-xs font-bold uppercase tracking-wider ${isExternal
              ? "text-[#EE2A24] hover:underline"
              : "text-gray-300 cursor-not-allowed pointer-events-none"
            }`}
        >
          View Details <ChevronRight size={14} className="ml-1" />
        </a>
      </div>
    </div>
  );
};

export default function PortfolioSection() {
  const [activeTab, setActiveTab] = useState("All");
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);

  useEffect(() => {
    let isMounted = true;

    const loadPortfolioItems = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/portfolio/`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load portfolio items");
        }

        const data = await response.json();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setProjects(data.map(normalizeProject));
        }
      } catch (error) {
        console.error("Portfolio fetch error:", error);
      }
    };

    loadPortfolioItems();

    return () => {
      isMounted = false;
    };
  }, []);

  const tabs = useMemo(() => {
    const categories = projects
      .map((project) => project.category)
      .filter(Boolean);

    return ["All", ...new Set(categories)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return activeTab === "All"
      ? projects
      : projects.filter((project) => project.category === activeTab);
  }, [activeTab, projects]);

  useEffect(() => {
    if (!tabs.includes(activeTab)) {
      setActiveTab("All");
    }
  }, [tabs, activeTab]);

  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-[#1e1e2d] mb-4">
            Our Portfolio
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Explore our work across government facilities, corporate offices,
            and retail spaces. Each project showcases our commitment to quality
            and ADA compliance.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 border ${activeTab === tab
                  ? "bg-[#EE2A24] text-white border-[#EE2A24] shadow-md"
                  : "bg-white text-gray-500 border-gray-200 hover:border-[#EE2A24] hover:text-[#EE2A24]"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="text-center pt-10 border-t border-gray-100">
          <h4 className="text-lg font-bold text-[#1e1e2d] mb-6">
            Inspired by What You See?
          </h4>
          <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm">
            We can customize signage solutions tailored to your specific needs
            in any industry. Let’s discuss your project today.
          </p>
          <button className="bg-[#EE2A24] text-white px-10 py-4 rounded-xl font-bold transition-all hover:bg-[#d6221c] active:scale-95 shadow-lg shadow-red-100">
            Request Custom Quote
          </button>
        </div>
      </div>
    </section>
  );
}
