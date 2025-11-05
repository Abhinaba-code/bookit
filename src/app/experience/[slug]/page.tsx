import { getExperienceBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import { ExperienceClient } from "./components/experience-client";
import { Container } from "@/components/ui/container";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props) {
  const experience = await getExperienceBySlug(params.slug);
  if (!experience) {
    return { title: "Not Found" };
  }
  return {
    title: `${experience.title} | BookIt`,
    description: experience.description,
  };
}


export default async function ExperiencePage({ params }: Props) {
  const experience = await getExperienceBySlug(params.slug);

  if (!experience) {
    notFound();
  }

  return (
    <Container className="py-12">
        <ExperienceClient experience={experience} />
    </Container>
  );
}
