"use client";

import useSWR from "swr";
import AnimatedSection from "@/components/shared/AnimatedSection";
import OptimizedImage from "@/components/shared/OptimizedImage";
import SectionHeader from "@/components/shared/SectionHeader";
import Card from "@/components/ui/Card";
import { fetcher } from "@/lib/utils";
import type { StaffMember } from "@/types";

export default function TeamSection() {
  const { data = [] } = useSWR<StaffMember[]>("/api/staff?public=true", fetcher);

  return (
    <section className="section" id="team">
      <div className="container">
        <SectionHeader label="Meet Our Team" title="The People Behind the Experience" />
        <div className="team-grid">
          {data.map((member, index) => (
            <AnimatedSection key={member.id} delay={index * 0.08}>
              <Card className="team-card">
                <div className="team-photo">
                  <OptimizedImage src={member.image} alt={member.name} />
                </div>
                <h3>{member.name}</h3>
                <span>{member.role}</span>
                <p>{member.bio}</p>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
