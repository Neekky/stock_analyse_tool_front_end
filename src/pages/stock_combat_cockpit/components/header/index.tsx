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
            多指数趋势洞察
          </h1>
          <div className="mx-auto max-w-3xl">
            <p
              className="mb-8 text-lg text-gray-700"
            >
              跟踪各行业板块指数的涨跌情况，及时捕捉行业轮动机会，帮助投资者把握市场热点。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
