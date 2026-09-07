import { FILM_BREATH } from "@/lib/content/film";
import { HOME_WHAT_WE_DO } from "@/lib/content/home";
import { ScrollScene } from "@/components/film/ScrollScene";
import { Beat, ChapterMark } from "@/components/film/Beat";

/**
 * CHAPTER 02 — THE BREATH. Near-empty, the act title only, held while one element
 * walks in.
 *
 * THIS IS THE CHAPTER THAT MOST IMITATIONS LEAVE OUT, and `DIRECTION.md` says so
 * directly: everything from the previous act has to be gone before anything from the
 * next arrives. Thirty-five screens of continuous invention is exhausting; the thing
 * that makes a long scroll survivable is the moment where nothing is being sold.
 *
 * NO CANVAS SEGMENT AT ALL. The trace simply runs through — the spine passes behind
 * this stage because no segment interrupts it, which is what the default is for. A
 * chapter card that also had a drawn flourish would not be a breath.
 *
 * It is a Server Component. There is no interactivity here and nothing to subscribe to:
 * the two beats read `--p` in CSS, which is inherited from the stage.
 */
export function Breath() {
  return (
    <ScrollScene id="breath" screens={3} screensSm={2} className="film-breath">
      <div className="film-chapter">
        <ChapterMark number={FILM_BREATH.chapter} title={FILM_BREATH.title} />

        <div className="film-copy">
          {/* Set at the display step and cropped by the frame. The act title is the
              only thing on screen, so it may as well be the size the page can hold. */}
          <Beat at={0.05} span={0.18} as="p" className="film-act">
            {HOME_WHAT_WE_DO.heading}
          </Beat>
          <Beat at={0.34} span={0.2} as="p" className="film-act-line">
            {FILM_BREATH.line}
          </Beat>
        </div>
      </div>
    </ScrollScene>
  );
}
