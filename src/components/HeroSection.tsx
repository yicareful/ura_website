import { CountUp } from "./CountUp";

export function HeroSection({
  eventCount,
  totalRunners,
  totalDistance,
  runner,
}: {
  eventCount: number;
  totalRunners: number;
  totalDistance: number;
  runner?: { name: string } | null;
}) {
  return (
    <section className="section-dark race-hero">
      <div className="race-hero__scene" aria-hidden />

      <div className="container race-hero__grid">
        <div>
          <div className="race-kicker stagger-enter visible">
            URA RACE CONTROL / SHANDONG CAMPUS RUN
          </div>

          <h1 className="race-hero__title stagger-enter visible">
            把每一次报名，接入同一条赛道
          </h1>

          <p className="race-hero__copy stagger-enter visible">
            面向山东高校长跑赛事的报名、组别、名册与选手中心。选手从浏览赛事到完成报名，运营者从发布赛事到管理名册，都在同一套节奏里推进。
          </p>

          <div className="race-hero__actions stagger-enter visible">
            <a href="/events" className="btn-primary">
              浏览赛事
            </a>
            {runner ? (
              <a href="/runner/my-registrations" className="btn-ghost-dark">
                查看我的报名
              </a>
            ) : (
              <a href="/runner/login" className="btn-ghost-dark">
                选手登录
              </a>
            )}
          </div>
        </div>

        <div className="race-hero__stats stagger-enter visible" aria-label="赛事平台统计">
          <div className="race-stat count-up">
            <div>
              <div className="race-stat__value"><CountUp to={eventCount} /></div>
            </div>
            <div className="race-stat__label">在办赛事</div>
          </div>
          <div className="race-stat count-up">
            <div>
              <div className="race-stat__value"><CountUp to={totalRunners} /></div>
            </div>
            <div className="race-stat__label">已报名选手</div>
          </div>
          <div className="race-stat count-up">
            <div>
              <div className="race-stat__value"><CountUp to={totalDistance} suffix="km" /></div>
            </div>
            <div className="race-stat__label">累计赛道里程</div>
          </div>
        </div>
      </div>
    </section>
  );
}
