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
            个性化策略构建
          </h1>
          <div className="mx-auto max-w-3xl">
            <p
              className="mb-8 text-lg text-gray-700"
            >
              提供多维度、多策略的聚合分析功能，帮助投资者快速构建个性化的投资组合<br/> 对比不同策略的当日表现，做出更明智的投资决策
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
