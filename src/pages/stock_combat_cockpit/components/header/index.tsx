import PageIllustration from "@/components/pageIllustration/page-illustration";
import Header from "@/components/ui/header";

export default function Index() {
  return (
    <section>
      <Header />
      <PageIllustration />
      {/* Section header */}
      <div className="pt-28 md:pt-32">
        <div className="text-center pb-16">
          <h1
            className="mb-6 border-y text-5xl font-bold [border-image:linear-gradient(to_right,transparent,theme(colors.slate.300/.8),transparent)1] md:text-6xl"
          >
            市场实时监控
          </h1>
          <div className="mx-auto max-w-3xl">
            <p
              className="mb-8 text-lg text-gray-700"
            >
              实时跟踪大盘走势，深度解读市场情绪，为您呈现最全面、最直观的市场全景图。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
