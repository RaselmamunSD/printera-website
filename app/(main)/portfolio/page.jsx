"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { API_BASE_URL } from "@/lib/apiClient";

const PORTFOLIO_ENDPOINT = `${API_BASE_URL}/portfolio/`;

const normalizeProject = (project) => ({
  id: project.id,
  title: project.title || "Untitled Project",
  category: project.category || "Uncategorized",
  description: project.description || "No description available.",
  image: project.image_url || project.image || "/portfolio/port1.png",
  external_url: project.external_url || "",
});

const ProjectCard = ({ project }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg animate-in fade-in zoom-in duration-500">
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <Image
          src={project.image}
          alt={project.title}
          fill
          unoptimized={project.image.startsWith("http")}
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
    </div>
  );
};

export default function PortfolioSection() {
  const [activeTab, setActiveTab] = useState("All");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadPortfolioItems = async () => {
      try {
        const response = await fetch(PORTFOLIO_ENDPOINT, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Portfolio fetch failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setProjects(data.map(normalizeProject));
          } else {
            console.warn("Portfolio API returned zero items", { endpoint: PORTFOLIO_ENDPOINT, data });
          }
        }
      } catch (error) {
        console.error("Portfolio fetch error:", error, { endpoint: PORTFOLIO_ENDPOINT });
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
