import { Marquee } from "@/components/magicui/marquee";
import { cn } from "@/lib/utils";

const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/james",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "tw-relative tw-h-full tw-w-64 tw-cursor-pointer tw-overflow-hidden tw-rounded-xl tw-border tw-p-4",
        // light styles
        "tw-border-gray-950/[.1] tw-bg-gray-950/[.01] hover:tw-bg-gray-950/[.05]",
        // dark styles
        "dark:tw-border-gray-50/[.1] dark:tw-bg-gray-50/[.10] dark:hover:tw-bg-gray-50/[.15]"
      )}
    >
      <div className="tw-flex tw-flex-row tw-items-center tw-gap-2">
        <img
          className="tw-rounded-full"
          width="32"
          height="32"
          alt=""
          src={img}
        />
        <div className="tw-flex tw-flex-col">
          <figcaption className="tw-text-sm tw-font-medium dark:tw-text-white">
            {name}
          </figcaption>
          <p className="tw-text-xs tw-font-medium dark:tw-text-white/40">
            {username}
          </p>
        </div>
      </div>
      <blockquote className="tw-mt-2 tw-text-sm">{body}</blockquote>
    </figure>
  );
};

export function MarqueeDemo() {
  return (
    <div className="tw-relative tw-flex tw-w-full tw-flex-col tw-items-center tw-justify-center tw-overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      {/* <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee> */}
      <div className="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-left-0 tw-w-1/4 tw-bg-gradient-to-r tw-from-background"></div>
      <div className="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-0 tw-w-1/4 tw-bg-gradient-to-l tw-from-background"></div>
    </div>
  );
}
