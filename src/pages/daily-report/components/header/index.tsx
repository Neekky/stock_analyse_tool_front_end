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
            每日市场报告
          </h1>
          <div className="mx-auto max-w-3xl">
            <p
              className="mb-8 text-lg text-gray-700"
            >
              无论您是经验丰富的投资者，还是刚刚入市的新手。这份报告都能帮您<br/>快速把握市场脉搏，洞悉投资先机。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
