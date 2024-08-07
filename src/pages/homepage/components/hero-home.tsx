import PageIllustration from "./page-illustration";
import { useEffect, useState } from "react";
import { allInfoApi } from "@/apis";
import "./hero-home.less";

export default function HeroHome() {
  const [indexData, setIndexData] = useState({
    consecutive_up_days: 0,
    consecutive_down_days: 0,
  });

  useEffect(() => {
    getIndexData();
  }, []);

  const getIndexData = async () => {
    const res = await allInfoApi.get_status_of_index("sh000001");
    console.log(res, 123123);
    if (res.code === 200) {
      setIndexData(res.data);
    }
  };

  const renderTrendWord = (percent, score) => {
    const numPer = Number(percent);
    let word: any = null;
    if (numPer >= 80) {
      word =
        score > 0 ? (
          <div>
            当前正在接近趋势顶部，开始注意风险，密切关注成交量，发现当日成交量减少后，可开始逐渐减仓。
            <br />
            同时结合趋势分析结果，综合判断，当从上升趋势转为下跌趋势时，轻仓操作。
            <br />
            见顶过程中，一般会出现天量。或是在当前位置出现滞涨，迟迟不突破，亦要小心。
          </div>
        ) : (
          <div>
            正在砸出趋势底部，开始密切关注机会，无论是缩量还是放量，都可以开始逐步建仓。
            <br />
            寻找跌的最惨的股和近期连板股，关注近期热点题材和新闻，市场情绪极度恐慌时，需要他们带头建立信心。
            <br />
            破位下跌过程，可能会有持续，关注第二日是否出现止跌信号，进行操作。
          </div>
        );
      return word;
    }

    if (numPer >= 70) {
      word =
        score > 0 ? (
          <div>
            当前正在开始走向趋势顶部，开始注意风险，密切关注成交量，发现当日成交量减少后，可开始逐渐减仓。
            <br />
            同时结合趋势分析结果，综合判断，当从上升趋势转为下跌趋势时，轻仓操作。
            <br />
            见顶过程中，一般会出现天量。或是在当前位置出现滞涨，迟迟不突破，亦要小心。
          </div>
        ) : (
          <div>
            正在砸出趋势底部，开始密切关注机会，无论是缩量还是放量，都可以开始逐步建仓。
            <br />
            寻找跌的最惨的股和近期连板股，关注近期热点题材和新闻，市场情绪极度恐慌时，需要他们带头建立信心。
            <br />
            破位下跌过程，可能会有持续，关注第二日是否出现止跌信号，进行操作。
          </div>
        );
      return word;
    }
  };

  return (
    <section className="relative hero-home-wrap">
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-16">
            <h1
              className="mb-6 border-y text-5xl font-bold [border-image:linear-gradient(to_right,transparent,theme(colors.slate.300/.8),transparent)1] md:text-6xl"
              data-aos="zoom-y-out"
              data-aos-delay={150}
            >
              云端智能，智领投资未来
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-lg text-gray-700"
                data-aos="zoom-y-out"
                data-aos-delay={300}
              >
                我们的平台采用先进算法，对海量数据进行实时分析，为您提供精准的投资建议。
              </p>
              <div className="relative before:absolute before:inset-0 before:border-y before:[border-image:linear-gradient(to_right,transparent,theme(colors.slate.300/.8),transparent)1]">
                <div
                  className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center"
                  data-aos="zoom-y-out"
                  data-aos-delay={450}
                >
                  <a
                    className="btn group mb-4 w-full bg-gradient-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto"
                    href="#0"
                  >
                    <span className="relative inline-flex items-center">
                      开始体验{" "}
                      <span className="ml-1 tracking-normal text-blue-300 transition-transform group-hover:translate-x-0.5">
                        -&gt;
                      </span>
                    </span>
                  </a>
                  <a
                    className="btn w-full bg-white text-gray-800 shadow hover:bg-gray-50 sm:ml-4 sm:w-auto"
                    href="#0"
                  >
                    了解更多
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* Hero image */}
          <div
            className="mx-auto max-w-3xl"
            data-aos="zoom-y-out"
            data-aos-delay={600}
          >
            <div className="index-module">
              <h2 className="module-title">上证指数</h2>
              <div className="module-content">
                当前连续
                <span
                  style={{
                    color: indexData.consecutive_up_days
                      ? "#f46649"
                      : "#2aa491",
                  }}
                >
                  {indexData.consecutive_up_days > 0
                    ? ` 上涨${indexData.consecutive_up_days}天`
                    : ` 下跌${indexData.consecutive_down_days}天`}
                </span>
              </div>
              <div className="module-content">
                当前趋势为
                <span
                  style={{
                    color:
                      indexData["当前趋势"] === "上行趋势"
                        ? "#f46649"
                        : "#2aa491",
                  }}
                >
                  {` ${indexData["当前趋势"]}`}
                </span>
              </div>
              {indexData["是否剧烈振幅"] ? (
                <div className="module-content">
                  今日剧烈震荡 {indexData["是否加速"]}
                </div>
              ) : null}
              <div className="module-content">
                当前
                <span
                  style={{
                    color:
                      indexData["反转数据"].score > 0 ? "#f46649" : "#2aa491",
                  }}
                >
                  {` ${indexData["反转数据"].score > 0 ? "见顶" : "见底"} `}
                </span>
                的概率为
                <span className="text-[#f46649] text-500">
                  {" "}
                  {indexData["反转数据"].percent}%{" "}
                </span>
                {renderTrendWord(100, -20)}
              </div>
              <div className="module-content">{indexData["最新涨跌幅"]}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
