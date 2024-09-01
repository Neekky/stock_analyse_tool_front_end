import { useEffect, useState } from "react";
import { allInfoApi } from "@/apis";
import "./hero-home.less";
import { useNavigate } from "react-router-dom";
import PageIllustration from "@/components/pageIllustration/page-illustration";
import IndexCompilations from "./index-compilations";

export default function HeroHome() {
  const navigate = useNavigate();

  // 指数运行状态数据
  const [indexData, setIndexData] = useState({
    consecutive_up_days: 0,
    consecutive_down_days: 0,
    反转数据: {},
    当前趋势: "",
    是否剧烈振幅: false,
    是否加速: "",
    最新涨跌幅: 0,
    isTopOrBottom: "",
    scoreColor: "",
    upDaysColor: "",
    indexName: "",
  });

  useEffect(() => {
    getIndexStatusData();
  }, []);

  const getIndexStatusData = async () => {
    const res = await allInfoApi.get_status_of_index("sh000001");
    if (res.code === 200) {
      // 复制一份res.data
      const copyData = { ...res.data };
      copyData.isTopOrBottom =
        res.data?.["反转数据"]?.score > 0 ? "见顶" : "见底";
      copyData.scoreColor =
        res.data?.["最新涨跌幅"] > 0 ? "#f46649" : "#2aa491";
      copyData.indexName = "上证指数";
      copyData.upDaysColor =
        res.data?.consecutive_up_days > 0 ? "#f46649" : "#2aa491";

      setIndexData(copyData);
    }
  };



  return (
    <section className="relative hero-home-wrap">
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="pb-12 pt-28 md:pb-20 md:pt-32">
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
            className="mx-auto max-w-4xl flex flex-col items-center"
            data-aos="zoom-y-out"
            data-aos-delay={600}
          >
            <IndexCompilations ago={60} indexData={indexData} />
            <div
              onClick={() => navigate("/multi-index-analysis")}
              className="w-28 mt-4 btn group mb-4 bg-gradient-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow hover:bg-[length:100%_150%]"
            >
              <span className="relative inline-flex items-center">
                查看更多
                <span className="arrow-animate ml-1 tracking-normal text-blue-300 transition-transform group-hover:translate-x-0.5">
                  -&gt;
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
